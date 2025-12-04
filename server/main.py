from fastapi import FastAPI

from core.db import Base, engine
from routers.auth import router as auth_router
from routers.translation import router as translation_router

app = FastAPI(title="Transformer API")


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.include_router(translation_router, prefix="/translate", tags=["translation"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
