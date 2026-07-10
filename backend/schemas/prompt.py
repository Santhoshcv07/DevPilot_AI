from alembic.environment import Optional
from pydantic import BaseModel, Field

class PromptRequest(BaseModel):
    """Schema for validating incoming user prompts."""
    query: str = Field(
        ..., 
        min_length=3, 
        max_length=2000, 
        description="The text prompt sent by the user."
    )
    document_id: Optional[int] = None