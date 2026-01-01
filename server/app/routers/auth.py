from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.core import security
from app.core.database import get_session, engine
from app.models.user import User, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserRead)
def create_user(
    user_in: User,
    session: Session = Depends(get_session)
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = session.exec(
        select(User).where(User.email == user_in.email)
    ).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    # Hash the password
    user_in.hashed_password = security.get_password_hash(user_in.hashed_password)
    
    session.add(user_in)
    session.commit()
    session.refresh(user_in)
    return user_in

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = security.timedelta(minutes=60)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

from app.core.deps import get_current_user

@router.get("/me", response_model=UserRead)
def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user
