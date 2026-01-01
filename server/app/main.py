from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel
from app.core.database import engine
# Import models to ensure they are registered with SQLModel.metadata
from app.models.user import User

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="3sila-AI API", lifespan=lifespan)

from app.routers import auth
app.include_router(auth.router)
