from typing import Any, Optional
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
from pydantic import BaseModel, EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class UpdateProfileRequest(BaseModel):
    email: Optional[EmailStr] = None

@router.get("/me", response_model=UserRead)
def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    session: Session = Depends(get_session)
) -> Any:
    """
    Request password reset token.
    In production: Send email with reset link.
    For now: Return token in response.
    """
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    
    if not user:
        # Don't reveal if email exists (security best practice)
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token (expires in 15 minutes)
    reset_token_expires = security.timedelta(minutes=15)
    reset_token = security.create_access_token(
        user.id, expires_delta=reset_token_expires
    )
    
    # In production: Send email here
    # For now, return token for testing
    return {
        "message": "Password reset token generated",
        "reset_token": reset_token  # Remove this in production!
    }

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Change password for logged-in user.
    Requires old password verification.
    """
    # Verify old password
    if not security.verify_password(request.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect old password"
        )
    
    # Update to new password
    current_user.hashed_password = security.get_password_hash(request.new_password)
    session.add(current_user)
    session.commit()
    
    return {"message": "Password updated successfully"}

@router.put("/profile", response_model=UserRead)
def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> Any:
    """
    Update current user profile.
    """
    if request.email:
        # Check if email already exists
        existing_user = session.exec(
            select(User).where(User.email == request.email)
        ).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        current_user.email = request.email
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user
