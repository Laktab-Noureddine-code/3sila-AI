from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

# check_same_thread=False is required for SQLite interactions across threads
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

def get_session():
    with Session(engine) as session:
        yield session
