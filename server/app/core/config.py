from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    SECRET_KEY: str
    DATABASE_URL: str
    ENV: str = "development"  # development | production
    ALLOWED_ORIGINS: str = "*"  # Allow all origins (use specific domains in production)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    ENCRYPTION_KEY: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
