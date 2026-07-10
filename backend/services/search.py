import numpy as np
from sqlalchemy.orm import Session
from backend.models.document import DocumentChunk
from backend.services.embeddings import get_embedding

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """
    Calculates the mathematical similarity between two vectors.
    Returns a score from 1.0 (perfect match) to -1.0 (opposite).
    """
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    # The dot product divided by the product of the magnitudes
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

def search_document(query: str, document_id: int, db: Session, top_k: int = 3) -> list[str]:
    """
    1. Translates the query into math.
    2. Calculates similarity against all chunks in the DB.
    3. Returns the top 3 most relevant text blocks.
    """
    # 1. Translate the user's question into math
    query_vector = get_embedding(query)
    if not query_vector:
        return []

    # 2. Fetch all chunks for this specific document
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).all()

    # 3. Calculate the similarity score for every single chunk
    results = []
    for chunk in chunks:
        if chunk.embedding:
            score = cosine_similarity(query_vector, chunk.embedding)
            results.append((score, chunk.content))

    # 4. Sort the list by the highest score first
    results.sort(key=lambda x: x[0], reverse=True)

    # 5. Extract just the raw text of the top 'K' (e.g., top 3) results
    top_chunks = [result[1] for result in results[:top_k]]
    
    return top_chunks