from datetime import datetime, date, time, timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel

from app.core.database import get_session
from app.core.security_encryption import encryption_service
from app.models.system_config import SystemConfig
from app.models.user import User, UserRead
from app.models.history import History
from app.core.deps import get_current_active_admin

router = APIRouter(prefix="/admin", tags=["admin"])

class ConfigUpdate(BaseModel):
    value: str
    description: str | None = None

@router.put("/config/{key}", response_model=SystemConfig)
def update_config(
    key: str,
    config_in: ConfigUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin), # Require admin authentication
) -> Any:
    """
    Update system configuration.
    The value will be encrypted before storage.
    """
    # Check if config exists
    config = session.get(SystemConfig, key)
    
    encrypted_value = encryption_service.encrypt(config_in.value)
    
    if not config:
        config = SystemConfig(
            key=key,
            value=encrypted_value,
            description=config_in.description
        )
    else:
        config.value = encrypted_value
        if config_in.description:
            config.description = config_in.description
        config.updated_at = datetime.utcnow()
        
    session.add(config)
    session.commit()
    session.refresh(config)
    return config

class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_history_actions: int
    total_translations: int
    total_summarizations: int
    actions_today: int

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get dashboard statistics including users and history usage.
    """
    total_users = session.scalar(select(func.count()).select_from(User)) or 0
    active_users = session.scalar(select(func.count()).select_from(User).where(User.is_active == True)) or 0
    
    total_history = session.scalar(select(func.count()).select_from(History)) or 0
    total_translations = session.scalar(select(func.count()).select_from(History).where(History.action_type == "translate")) or 0
    total_summarizations = session.scalar(select(func.count()).select_from(History).where(History.action_type == "summarize")) or 0
    
    today_start = datetime.combine(date.today(), time.min)
    actions_today = session.scalar(select(func.count()).select_from(History).where(History.created_at >= today_start)) or 0
    
    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        total_history_actions=total_history,
        total_translations=total_translations,
        total_summarizations=total_summarizations,
        actions_today=actions_today
    )

class ActivityDataPoint(BaseModel):
    date: str
    translations: int
    summarizations: int

@router.get("/charts/activity", response_model=list[ActivityDataPoint])
def get_activity_chart(
    days: int = 7,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get activity chart data (translations vs summarizations) over the last N days.
    """
    # Calculate start date
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)
    start_datetime = datetime.combine(start_date, time.min)
    
    # Fetch all relevant history records
    statement = select(History.created_at, History.action_type).where(History.created_at >= start_datetime)
    results = session.exec(statement).all()
    
    # Initialize data structure for the last N days
    activity_map = {}
    for i in range(days):
        current_date_str = (start_date + timedelta(days=i)).isoformat()
        activity_map[current_date_str] = {"translations": 0, "summarizations": 0}
        
    # Tally up results
    for created_at, action_type in results:
        date_str = created_at.date().isoformat()
        if date_str in activity_map:
            if action_type == "translate":
                activity_map[date_str]["translations"] += 1
            elif action_type == "summarize":
                activity_map[date_str]["summarizations"] += 1
                
    # Convert map to sorted list of data points
    chart_data = [
        ActivityDataPoint(
            date=date_str,
            translations=counts["translations"],
            summarizations=counts["summarizations"]
        )
        for date_str, counts in activity_map.items()
    ]
    
    return chart_data

@router.get("/users", response_model=list[UserRead])
def get_users(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get a paginated list of all users except the currently logged-in admin.
    """
    statement = select(User).where(User.id != current_user.id).offset(skip).limit(limit)
    users = session.exec(statement).all()
    return users

@router.patch("/users/{user_id}/status", response_model=UserRead)
def toggle_user_status(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Toggle a user's active status (suspend / reactivate).
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot change your own status")
        
    user.is_active = not user.is_active
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.patch("/users/{user_id}/role", response_model=UserRead)
def toggle_user_role(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Toggle a user's admin role (promote / demote).
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot change your own role")
        
    user.is_admin = not user.is_admin
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Delete a user permanently along with their history.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")
        
    # Delete associated history records to prevent foreign key constraint issues
    statement = select(History).where(History.user_id == user_id)
    user_histories = session.exec(statement).all()
    for history in user_histories:
        session.delete(history)
        
    session.delete(user)
    session.commit()
    return {"message": "User deleted successfully"}

@router.get("/history", response_model=list[History])
def get_all_history(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get a paginated view of all user translations/summarizations across the app.
    Ordered by most recent first.
    """
    statement = select(History).order_by(History.created_at.desc()).offset(skip).limit(limit)
    history_records = session.exec(statement).all()
    return history_records

@router.get("/history/user/{user_id}", response_model=list[History])
def get_user_specific_history(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    """
    Get a paginated view of history for a specific user.
    """
    # Verify user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    statement = select(History).where(History.user_id == user_id).order_by(History.created_at.desc()).offset(skip).limit(limit)
    user_history_records = session.exec(statement).all()
    return user_history_records
