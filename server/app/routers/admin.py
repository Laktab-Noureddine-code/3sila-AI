from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from app.core.database import get_session
from app.core.security_encryption import encryption_service
from app.models.system_config import SystemConfig
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

class ConfigUpdate(BaseModel):
    value: str
    description: str | None = None

@router.put("/config/{key}", response_model=SystemConfig)
def update_config(
    key: str,
    config_in: ConfigUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user), # Require authentication
) -> Any:
    """
    Update system configuration.
    The value will be encrypted before storage.
    """
    # Check if config exists
    config = session.get(SystemConfig, key)
    
    encrypted_value = encryption_service.encrypt(config_in.value)
    
    if not config:
        config = SystemConfig(
            key=key,
            value=encrypted_value,
            description=config_in.description
        )
    else:
        config.value = encrypted_value
        if config_in.description:
            config.description = config_in.description
        config.updated_at = datetime.utcnow()
        
    session.add(config)
    session.commit()
    session.refresh(config)
    return config

from datetime import datetime
