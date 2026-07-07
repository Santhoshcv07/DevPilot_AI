from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str
    project_version: str
    
    # Add the database URL here. Pydantic will pull it from the .env file.
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()