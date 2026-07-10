from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import json
from sqlalchemy.orm import Session
fromcore.database import get_db
frommodels.user import User
frommodels.chat import Chat, Message
fromschemas.chat import ChatResponse, MessageResponse
fromschemas.prompt import PromptRequest
fromapi.deps import get_current_user
fromservices.ai import get_ai_response_with_history
from typing import List
fromservices.search import search_document

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

# --- 2. CHAT WITH THE AI (STATEFUL + RAG) ---
@router.post("/{chat_id}/messages")
def send_message(
    chat_id: int,
    request: PromptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Saves a message, optionally searches a document, calls AI, and saves the response."""
    
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # 1. Save the User's plain question to the Database
    user_message = Message(chat_id=chat.id, role="user", content=request.query)
    db.add(user_message)
    db.commit()

    # 2. THE RAG PIPELINE: Did the user attach a document?
    context_text = ""
    if request.document_id:
        print(f"\n--- DEBUG: Searching Document ID {request.document_id} ---")
        
        # Search the JSON vault for the top 3 most mathematically relevant chunks
        relevant_chunks = search_document(request.query, request.document_id, db)
        
        print(f"--- DEBUG: Found {len(relevant_chunks)} chunks with math attached ---")
        
        if relevant_chunks:
            # Format those chunks into a clean, readable reference block
            combined_chunks = "\n\n".join(relevant_chunks)
            context_text = f"\n\n--- REFERENCE DOCUMENT ---\n{combined_chunks}\n--------------------------\n"
            print(f"--- DEBUG: Successfully injected {len(context_text)} characters into prompt ---\n")
        else:
            print("--- DEBUG: WARNING! No chunks were returned. The AI cannot see the document! ---\n")

    # 3. Fetch past messages for context
    past_messages = db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.created_at.asc()).all()
    conversation_history = [{"role": msg.role, "content": msg.content} for msg in past_messages]

    # 4. SECRET INJECTION: Secretly staple the document chunks to the user's latest question 
    if context_text:
        conversation_history[-1]["content"] += context_text

    def generate_response():
        ai_text_accumulator = []
        for token in get_ai_response_with_history(conversation_history):
            ai_text_accumulator.append(token)
            yield f"data: {json.dumps({'content': token})}\n\n"
        
        yield "data: [DONE]\n\n"
        
        # Save to Database using a fresh session
        fromcore.database import SessionLocal
        db_session = SessionLocal()
        try:
            fromservices.ai import clean_chatgpt_style
            full_text = "".join(ai_text_accumulator)
            cleaned_text = clean_chatgpt_style(full_text)
            
            ai_message = Message(chat_id=chat_id, role="assistant", content=cleaned_text)
            db_session.add(ai_message)
            
            # Auto-titling if this is the first real exchange
            chat_obj = db_session.query(Chat).filter(Chat.id == chat_id).first()
            if chat_obj and chat_obj.title == "New Conversation":
                fromservices.ai import client
                title_prompt = f"Based on this user message, generate a brief 3 to 4 word descriptive title for this conversation (no quotes, no extra text, just the words): {request.query}"
                title_res = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": title_prompt}]
                )
                new_title = title_res.choices[0].message.content.strip().replace('"', '')
                chat_obj.title = new_title
                
            db_session.commit()
        except Exception as e:
            print(f"Error saving stream to DB: {e}")
        finally:
            db_session.close()

    return StreamingResponse(generate_response(), media_type="text/event-stream")

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

from pydantic import BaseModel
class RenameRequest(BaseModel):
    title: str

# --- 5. RENAME CHAT ---
@router.put("/{chat_id}")
def rename_chat(
    chat_id: int, 
    request: RenameRequest,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    chat.title = request.title
    db.commit()
    db.refresh(chat)
    return chat

# --- 6. DELETE CHAT ---
@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted"}

# --- 7. DELETE LAST EXCHANGE (FOR REGENERATE) ---
@router.delete("/{chat_id}/last-exchange")
def delete_last_exchange(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Get all messages ordered by time
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.desc()).limit(2).all()
    
    if len(messages) > 0:
        for msg in messages:
            db.delete(msg)
        db.commit()
        return {"message": "Last exchange deleted"}
    
    return {"message": "No exchange to delete"}