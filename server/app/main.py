from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel
from app.core.database import engine
# Import models to ensure they are registered with SQLModel.metadata
from app.models.user import User
from app.models.history import History

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="3sila-AI API", lifespan=lifespan)

from app.routers import auth, tools, history
app.include_router(auth.router)
app.include_router(tools.router)
app.include_router(history.router)
