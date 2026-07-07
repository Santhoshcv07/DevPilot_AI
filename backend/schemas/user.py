from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# 1. The Schema for data coming IN (The Signup Form)
class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="A valid email address")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")

# 2. The Schema for data going OUT (The API Response)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        # This tells Pydantic to read data from a SQLAlchemy Model instead of a normal dictionary
        from_attributes = True