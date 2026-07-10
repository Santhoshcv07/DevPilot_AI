from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


# 1. Inherit from the Base blueprint we made in database.py
class User(Base):
    # 2. Tell SQLAlchemy the exact name of the table in Postgres
    __tablename__ = "users"

    # 3. Define the columns
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Automatically record exactly when this user was created
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
    # Connect users cleanly to all their uploaded data libraries
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")