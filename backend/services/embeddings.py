# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer

# Do not load the model during backend startup.
# Load it only when embeddings are actually required.
_model = None


def get_model():
    global _model

    if _model is None:
        print("Loading embedding model...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def get_embedding(text: str) -> list[float]:
    """
    Converts text into a 384-dimensional embedding vector.
    The model is loaded lazily to reduce application startup memory usage.
    """
    try:
        model = get_model()
        vector = model.encode(
            text,
            convert_to_numpy=True,
            show_progress_bar=False
        )

        return vector.tolist()

    except Exception as e:
        print(f"Embedding error: {e}")
        return []