def get_text_chunks(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    """
    Splits a long string of text into smaller, overlapping chunks.
    """
    chunks = []
    start = 0
    text_length = len(text)
    
    # If the file is completely empty, return nothing
    if text_length == 0:
        return chunks

    while start < text_length:
        # Slice the string from 'start' to 'start + chunk_size'
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        
        # Move the starting point forward, but step back by the overlap amount
        start += (chunk_size - chunk_overlap)
        
    return chunks