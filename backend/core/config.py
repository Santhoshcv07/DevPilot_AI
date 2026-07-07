from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application settings. Pydantic will automatically load these 
    from the .env file and validate their types.
    """
    project_name: str
    project_version: str

    class Config:
        # Tell Pydantic to look for a file named .env
        env_file = ".env"

# Create a single instance of the settings to be used throughout the app
settings = Settings()