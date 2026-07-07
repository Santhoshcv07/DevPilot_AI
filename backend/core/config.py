from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str
    project_version: str
    
    # Add the database URL here. Pydantic will pull it from the .env file.
    database_url: str

    # Add these two new lines:
    secret_key: str
    access_token_expire_minutes: int = 60 # The keycard expires in 1 hour

    class Config:
        env_file = ".env"

settings = Settings()