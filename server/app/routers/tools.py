from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Any, Optional
from sqlmodel import Session
from app.core.deps import get_current_user_optional
from app.core.database import get_session
from app.models.user import User
from app.models.history import History
from app.services.ai_service import summarize_text, translate_text

router = APIRouter(prefix="/tools", tags=["tools"])

class TextRequest(BaseModel):
    text: str

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "French"

@router.post("/summarize")
async def summarize_endpoint(
    request: TextRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
) -> Any:
    """
    Summarize text.
    - Guest: Max 250 chars, no history.
    - User: Max 2000 chars, saves history.
    """
    # 1. Tier System Logic
    if current_user:
        limit = 2000
    else:
        limit = 250
    
    if len(request.text) > limit:
        raise HTTPException(
            status_code=403, 
            detail=f"Character limit exceeded ({limit}). {'Login to increase limit.' if not current_user else ''}"
        )

    # 2. Call AI Service
    summary = summarize_text(request.text)

    # 3. Save History (Users only)
    if current_user:
        history_entry = History(
            user_id=current_user.id,
            original_text=request.text,
            summary_text=summary,
            translated_text="", # Not performing translation here
            action_type="summarize"
        )
        session.add(history_entry)
        session.commit()

    return {"summary": summary}

@router.post("/translate")
async def translate_endpoint(
    request: TranslationRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
) -> Any:
    """
    Translate text.
    - Guest: Max 250 chars, no history.
    - User: Max 2000 chars, saves history.
    """
    # 1. Tier System Logic
    if current_user:
        limit = 2000
    else:
        limit = 250
    
    if len(request.text) > limit:
        raise HTTPException(
            status_code=403, 
            detail=f"Character limit exceeded ({limit}). {'Login to increase limit.' if not current_user else ''}"
        )

    # 2. Call AI Service
    translation = translate_text(request.text, request.target_lang)

    # 3. Save History (Users only)
    if current_user:
        history_entry = History(
            user_id=current_user.id,
            original_text=request.text,
            summary_text="", # Not performing summary here
            translated_text=translation,
            target_lang=request.target_lang,
            action_type="translate"
        )
        session.add(history_entry)
        session.commit()

    return {"translation": translation}
