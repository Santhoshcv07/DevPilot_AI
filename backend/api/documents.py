from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.user import User
from backend.models.document import Document
from backend.api.deps import get_current_user

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accepts a file upload, reads the text content, and saves a tracking record to the database.
    """
    # 1. Security/Validation: Only allow text-based files for now
    allowed_types = ["text/plain", "text/markdown", "text/csv"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file.content_type}. Please upload a .txt file."
        )

    try:
        # 2. Read the raw bytes from the uploaded file and decode them into a Python string
        raw_content = await file.read()
        text_content = raw_content.decode("utf-8")
        
        # NOTE: We have the text! In the next lesson, we will "chunk" this text.
        # For now, we will just count how long it is to prove we read it successfully.
        character_count = len(text_content)

        # 3. Create the parent Document record in the database
        new_doc = Document(
            user_id=current_user.id,
            filename=file.filename,
            file_type=file.content_type
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        # 4. Return success metadata to the frontend
        return {
            "message": "File uploaded and read successfully",
            "document_id": new_doc.id,
            "filename": new_doc.filename,
            "characters_read": character_count
        }

    except UnicodeDecodeError:
         raise HTTPException(status_code=400, detail="Could not read the file as plain text. Ensure it is UTF-8 encoded.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")