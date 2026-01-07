from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.core import security
from app.core.config import settings
from app.core.database import get_session, engine
from app.models.user import User, UserRead
from app.models.password_reset import PasswordReset
import random
from datetime import datetime


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
    
    access_token_expires = security.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

from app.core.deps import get_current_user
from pydantic import BaseModel, EmailStr

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str


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

@router.post("/send-reset-code")
def send_reset_code(
    request: PasswordResetRequest,
    session: Session = Depends(get_session)
) -> Any:
    """
    Generate and send a 6-digit password reset code.
    MOCK: Currently prints code to console instead of sending email.
    """
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    
    if not user:
        # Security: Don't reveal if user exists
        return {"message": "If the email is registered, a reset code has been sent."}
    
    # Generate 6-digit code
    code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.utcnow() + security.timedelta(minutes=15)
    
    # Save to database
    reset_entry = PasswordReset(
        email=request.email,
        code=code,
        expires_at=expires_at
    )
    session.add(reset_entry)
    session.commit()
    
    # MOCK EMAIL SENDING
    print(f"============================================")
    print(f"EMAIL TO: {request.email}")
    print(f"SUBJECT: Password Reset Code")
    print(f"BODY: Your verification code is: {code}")
    print(f"============================================")
    
    # TODO: Integrate real SMTP sending here
    # send_email(to=request.email, subject="Reset Code", body=f"Code: {code}")
    
    return {"message": "If the email is registered, a reset code has been sent."}


@router.post("/reset-password-with-code")
def reset_password_with_code(
    request: PasswordResetConfirm,
    session: Session = Depends(get_session)
) -> Any:
    """
    Reset password using the 6-digit verification code.
    """
    # 1. Verify code
    reset_entry = session.exec(
        select(PasswordReset)
        .where(PasswordReset.email == request.email)
        .where(PasswordReset.code == request.code)
        .where(PasswordReset.expires_at > datetime.utcnow())
        .order_by(PasswordReset.created_at.desc())
    ).first()
    
    if not reset_entry:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code"
        )
    
    # 2. Get User
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 3. Update Password
    user.hashed_password = security.get_password_hash(request.new_password)
    session.add(user)
    
    # 4. Optional: Delete used code (or all codes for this user)
    session.delete(reset_entry)
    
    session.commit()
    
    return {"message": "Password updated successfully"}


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
