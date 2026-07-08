from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.user import User
from backend.models.chat import Chat, Message
from backend.schemas.chat import ChatResponse, MessageResponse
from backend.schemas.prompt import PromptRequest
from backend.api.deps import get_current_user
from backend.services.ai import get_ai_response_with_history
from typing import List

router = APIRouter()

# --- 1. CREATE A NEW CHAT SESSION ---
@router.post("/", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
def create_chat(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Creates a new empty chat session for the logged-in user."""
    new_chat = Chat(user_id=current_user.id, title="New Conversation")
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

# --- 2. CHAT WITH THE AI (STATEFUL) ---
@router.post("/{chat_id}/messages", response_model=MessageResponse)
def send_message(
    chat_id: int,
    request: PromptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Saves a user message, fetches history, calls AI, and saves the AI response."""
    
    # 1. Verify the chat exists AND belongs to the current user (Security Check)
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # 2. Save the User's message to the Database
    user_message = Message(chat_id=chat.id, role="user", content=request.query)
    db.add(user_message)
    db.commit()

    # 3. Fetch all past messages for this chat, ordered by time
    past_messages = db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.created_at.asc()).all()
    
    # 4. Format the database rows into the exact JSON array required by Groq
    conversation_history = [{"role": msg.role, "content": msg.content} for msg in past_messages]

    # 5. Hand the entire history array to the Chef
    ai_text = get_ai_response_with_history(conversation_history)

    # 6. Save the AI's response to the Database
    ai_message = Message(chat_id=chat.id, role="assistant", content=ai_text)
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)

    # 7. Return the newly created AI message row
    return ai_message

# --- 3. GET ALL CHATS (THE SIDEBAR) ---
from typing import List # Add this import at the very top of your file if it's not there!

@router.get("/", response_model=List[ChatResponse])
def get_user_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Fetches all chat sessions belonging to the logged-in user, ordered by newest first.
    """
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.created_at.desc()).all()
    return chats

# --- 4. GET CHAT HISTORY (THE MAIN WINDOW) ---
@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
def get_chat_messages(
    chat_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Fetches the entire message history for a specific chat session.
    """
    # 1. Security Check: Ensure the user actually owns this chat
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # 2. Fetch and return all messages in chronological order
    messages = db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.created_at.asc()).all()
    return messages