from cryptography.fernet import Fernet
from app.core.config import settings

class EncryptionService:
    def __init__(self):
        self.fernet = Fernet(settings.ENCRYPTION_KEY)

    def encrypt(self, data: str) -> str:
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, token: str) -> str:
        return self.fernet.decrypt(token.encode()).decode()

encryption_service = EncryptionService()
