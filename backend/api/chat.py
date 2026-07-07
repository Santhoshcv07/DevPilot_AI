from fastapi import APIRouter
from backend.schemas.prompt import PromptRequest

router = APIRouter()

# Notice this is a .post(), not a .get()!
@router.post("/ask")
async def ask_ai(request: PromptRequest):
    """
    Receive a prompt from the user and validate it.
    """
    # For now, we just echo it back. Later, we will send this to Groq.
    return {
        "message": "Prompt received successfully!",
        "received_data": request.query
    }