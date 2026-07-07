from fastapi import APIRouter

# 1. Initialize the router (a mini-app)
router = APIRouter()

# 2. Define the endpoint using the router, not the main app
@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "message": "DevPilot AI API is operational"
    }