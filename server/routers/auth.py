from fastapi import APIRouter, Depends

from auth.schemas import UserCreate, UserRead, UserUpdate
from auth.users import auth_backend, current_active_user, fastapi_users
from auth.models import User


router = APIRouter()


router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="",
    tags=["auth"],
)


@router.post("/logout", tags=["auth"])
async def logout(user: User = Depends(current_active_user)):
    return {"detail": "Logout successful (implement token revocation if needed)"}
