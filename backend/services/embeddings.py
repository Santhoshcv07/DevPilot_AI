def get_embedding(text: str) -> list[float]:
    """
    Temporary cloud-safe embedding fallback.

    Local sentence-transformers is disabled because it exceeds
    the 512 MB memory limit on Render Free.
    """
    print("Embeddings are temporarily disabled on cloud deployment.")
    return []