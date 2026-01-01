from typing import Optional
from sqlmodel import Field, SQLModel

class UserBase(SQLModel):
    name: str
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserRead(UserBase):
    id: int

