from fastapi import FastAPI
# Import our new router from the api folder
from backend.api.health import router as health_router
from backend.api.chat import router as chat_router  # 1. Import new router



# 1. Initialize the main FastAPI application
app = FastAPI(
    title="DevPilot AI API",
    version="1.0.0",
    description="The backend engine for DevPilot AI"
)

# 2. Plug the router into the main app
app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])