from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Any
from sqlmodel import Session, select
from app.core.deps import get_current_user
from app.core.database import get_session
from app.core.pagination import paginate, PaginatedResponse
from app.models.user import User
from app.models.history import History

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/", response_model=PaginatedResponse[History])
async def get_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page")
) -> Any:
    """
    Get all past queries for the logged-in user (paginated).
    """
    statement = select(History).where(History.user_id == current_user.id).order_by(History.created_at.desc())
    results = session.exec(statement).all()
    return paginate(results, page=page, per_page=per_page)

@router.get("/summaries", response_model=PaginatedResponse[History])
async def get_summaries(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page")
) -> Any:
    """
    Get all summaries for the logged-in user (paginated).
    """
    statement = select(History).where(
        History.user_id == current_user.id,
        History.action_type == "summarize"
    ).order_by(History.created_at.desc())
    results = session.exec(statement).all()
    return paginate(results, page=page, per_page=per_page)

@router.get("/translations", response_model=PaginatedResponse[History])
async def get_translations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page")
) -> Any:
    """
    Get all translations for the logged-in user (paginated).
    """
    statement = select(History).where(
        History.user_id == current_user.id,
        History.action_type == "translate"
    ).order_by(History.created_at.desc())
    results = session.exec(statement).all()
    return paginate(results, page=page, per_page=per_page)

@router.delete("/summaries/all")
async def delete_all_summaries(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Delete ALL summaries for the logged-in user.
    """
    statement = select(History).where(
        History.user_id == current_user.id,
        History.action_type == "summarize"
    )
    results = session.exec(statement).all()
    
    for item in results:
        session.delete(item)
        
    session.commit()
    return {"message": "All summaries deleted successfully"}

@router.delete("/translations/all")
async def delete_all_translations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Delete ALL translations for the logged-in user.
    """
    statement = select(History).where(
        History.user_id == current_user.id,
        History.action_type == "translate"
    )
    results = session.exec(statement).all()
    
    for item in results:
        session.delete(item)
        
    session.commit()
    return {"message": "All translations deleted successfully"}

@router.delete("/summaries/{summary_id}")
async def delete_summary(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Delete a specific summary by ID.
    User can only delete their own summaries.
    """
    history_item = session.get(History, summary_id)
    
    if not history_item:
        raise HTTPException(status_code=404, detail="Summary not found")
    
    # Check ownership
    if history_item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this summary")
    
    # Check if it's actually a summary
    if history_item.action_type != "summarize":
        raise HTTPException(status_code=400, detail="This item is not a summary")
    
    session.delete(history_item)
    session.commit()
    
    return {"message": "Summary deleted successfully"}

@router.delete("/translations/{translation_id}")
async def delete_translation(
    translation_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Delete a specific translation by ID.
    User can only delete their own translations.
    """
    history_item = session.get(History, translation_id)
    
    if not history_item:
        raise HTTPException(status_code=404, detail="Translation not found")
    
    # Check ownership
    if history_item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this translation")
    
    # Check if it's actually a translation
    if history_item.action_type != "translate":
        raise HTTPException(status_code=400, detail="This item is not a translation")
    
    session.delete(history_item)
    session.commit()
    
    return {"message": "Translation deleted successfully"}
