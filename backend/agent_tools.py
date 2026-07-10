import os

def create_local_file(absolute_directory: str, file_name: str, content: str) -> str:
    """
    Creates a file exactly at the absolute directory specified by the user 
    (e.g., C:\\Users\\Desktop\\MyProject).
    """
    try:
        # 1. Combine the desktop/local folder path with the file name
        full_path = os.path.join(absolute_directory, file_name)
        
        # 2. Safely create the folder on their computer if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # 3. Write the file physically to their hard drive
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        return f"SUCCESS: Generated {file_name} inside {absolute_directory}"
    except Exception as e:
        return f"ERROR generating file: {str(e)}"
