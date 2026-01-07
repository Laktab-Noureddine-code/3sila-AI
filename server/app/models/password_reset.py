from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Field, SQLModel

class PasswordReset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    code: str  # The 6-digit code
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
