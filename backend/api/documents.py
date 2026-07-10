from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.user import User
from backend.models.document import Document, DocumentChunk
from backend.api.deps import get_current_user
from backend.services.chunking import get_text_chunks
from backend.services.embeddings import get_embedding # NEW: Imported the Math Translator

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed_types = ["text/plain", "text/markdown", "text/csv"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    try:
        raw_content = await file.read()
        text_content = raw_content.decode("utf-8")
        character_count = len(text_content)

        # 1. Create the parent Document record
        new_doc = Document(
            user_id=current_user.id,
            filename=file.filename,
            file_type=file.content_type
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        # 2. Chop the text into overlapping pieces (The Meat Grinder)
        chunks = get_text_chunks(text_content, chunk_size=500, chunk_overlap=50)

        # 3. Save every piece AND its math to the PostgreSQL database
        db_chunks = []
        for index, chunk_text in enumerate(chunks):
            
            # NEW: Translate the English text into a 384-dimensional math vector
            vector_math = get_embedding(chunk_text)
            
            chunk_record = DocumentChunk(
                document_id=new_doc.id,
                content=chunk_text,
                chunk_index=index,
                embedding=vector_math # NEW: Save the math vector to the database vault!
            )
            db_chunks.append(chunk_record)

        # Bulk insert all chunks at once for massive performance speed
        db.add_all(db_chunks) 
        db.commit()

        return {
            "message": "File uploaded, chunked, and embedded successfully!",
            "document_id": new_doc.id,
            "filename": new_doc.filename,
            "characters_read": character_count,
            "chunks_created": len(db_chunks)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")