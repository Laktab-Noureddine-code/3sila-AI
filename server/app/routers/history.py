from fastapi import APIRouter, Depends, Query
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
