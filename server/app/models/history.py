from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class History(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    action_type: str = Field(default="unknown") # summarize, translate
    original_text: str
    summary_text: Optional[str] = None
    translated_text: Optional[str] = None
    target_lang: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
