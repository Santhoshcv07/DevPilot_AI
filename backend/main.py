from fastapi import FastAPI
from backend.api.health import router as health_router
# CHANGED: Import the new chats router (we delete the old chat.py mentally)
from backend.api.chats import router as chats_router 
from backend.api.auth import router as auth_router
from backend.api.users import router as users_router
from backend.core.config import settings
from backend.api.documents import router as documents_router

app = FastAPI(
    title=settings.project_name,
    version=settings.project_version,
)

app.include_router(health_router, prefix="/api/health", tags=["Health"])
# CHANGED: Plug in the new stateful chats router
app.include_router(chats_router, prefix="/api/chats", tags=["Chats"]) 
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(documents_router, prefix="/api/documents", tags=["Documents"])