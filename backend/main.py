from fastapi import FastAPI
from backend.api.health import router as health_router
from backend.api.chat import router as chat_router
from backend.api.auth import router as auth_router
from backend.api.users import router as users_router # 1. Import new router
from backend.core.config import settings

app = FastAPI(
    title=settings.project_name,
    version=settings.project_version,
)

app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"]) # 2. Plug it in