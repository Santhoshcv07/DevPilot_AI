from sentence_transformers import SentenceTransformer

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> list[float]:
    """
    Translates a string of English text into a 384-dimensional mathematical vector.
    """
    try:
        vector = model.encode(text).tolist()
        return vector
    except Exception as e:
        print(f"Embedding error: {e}")
        return []