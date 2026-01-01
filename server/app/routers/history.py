from fastapi import APIRouter, Depends
from typing import List, Any
from sqlmodel import Session, select
from app.core.deps import get_current_user
from app.core.database import get_session
from app.models.user import User
from app.models.history import History

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/", response_model=List[History])
async def get_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Get all past queries for the logged-in user.
    """
    statement = select(History).where(History.user_id == current_user.id).order_by(History.created_at.desc())
    results = session.exec(statement).all()
    return results
