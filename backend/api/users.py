from fastapi import APIRouter, Depends
from backend.schemas.user import UserResponse
from backend.models.user import User
from backend.api.deps import get_current_user

router = APIRouter()

# Notice the response_model. It ensures we don't accidentally leak the hashed_password!
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Fetch the currently logged-in user's profile. 
    This route is strictly protected by the get_current_user dependency.
    """
    return current_user