from pydantic_settings import BaseSettings
from pathlib import Path

# Resolve .env relative to this file's location (backend/core/config.py -> project root/.env)
_env_file_path = Path(__file__).resolve().parent.parent.parent / ".env"

class Settings(BaseSettings):
    project_name: str
    project_version: str
    
    # Add the database URL here. Pydantic will pull it from the .env file.
    database_url: str

    # Add these two new lines:
    secret_key: str
    access_token_expire_minutes: int = 60 # The keycard expires in 1 hour

    groq_api_key: str

    class Config:
        env_file = str(_env_file_path)

settings = Settings()