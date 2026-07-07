from fastapi import FastAPI
# Import our new router from the api folder
from backend.api.health import router as health_router
from backend.api.chat import router as chat_router  # 1. Import new router
from backend.core.config import settings # 1. Import our settings


# 2. Use the settings dynamically
app = FastAPI(
    title=settings.project_name,
    version=settings.project_version,
)

app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])