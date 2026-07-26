from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Absolute path to SQLite database
DB_PATH = BASE_DIR / "ksp_intellicrime.db"


class Settings(BaseSettings):
    # App
    APP_NAME: str = "KSP IntelliCrime AI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = f"sqlite:///{DB_PATH}"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()