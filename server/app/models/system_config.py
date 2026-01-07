from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class SystemConfig(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str  # Encrypted value
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
