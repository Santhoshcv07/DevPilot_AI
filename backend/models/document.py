from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # e.g., "text/plain", "application/pdf"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Establish clean relationships linking Users to Documents
    user = relationship("User", back_populates="documents")
    # Link Documents to individual data chunks. Cascade deletion clears fragments automatically.
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)  # Stored text segment
    chunk_index = Column(Integer, nullable=False)  # The ordered position of this chunk in the original file
    
    # NOTE: Later, we will store vector arrays here. For now, we build the core relational structural text logs.

    # Relational link back to parent tracking row
    document = relationship("Document", back_populates="chunks")