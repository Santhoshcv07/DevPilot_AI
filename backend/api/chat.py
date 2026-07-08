from fastapi import APIRouter, Depends
from backend.schemas.prompt import PromptRequest
from backend.services.ai import get_ai_response
from backend.api.deps import get_current_user
from backend.models.user import User

router = APIRouter()

# We inject The Bouncer (get_current_user) directly into the route parameters
@router.post("/ask")
def ask_ai(
    request: PromptRequest, 
    current_user: User = Depends(get_current_user)
):
    """
    Secure endpoint to send a prompt to the AI.
    Requires a valid JWT token.
    """
    
    # Hand the validated text to The Chef
    ai_text = get_ai_response(request.query)
    
    # Return the plated response back to the user
    return {
        "user": current_user.email,
        "prompt": request.query,
        "response": ai_text
    }