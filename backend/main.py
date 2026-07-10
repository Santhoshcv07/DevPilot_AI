from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import os
import subprocess
from api.health import router as health_router
# CHANGED: Import the new chats router (we delete the old chat.py mentally)
from api.chats import router as chats_router 
from api.auth import router as auth_router
from api.users import router as users_router
from core.config import settings
from api.documents import router as documents_router

from core.database import Base, engine

app = FastAPI(
    title=settings.project_name,
    version=settings.project_version,
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, you will change this to your Vercel URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/health", tags=["Health"])
# CHANGED: Plug in the new stateful chats router
app.include_router(chats_router, prefix="/api/chats", tags=["Chats"]) 
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(documents_router, prefix="/api/documents", tags=["Documents"])

@app.get("/api/workspace/select")

@app.get("/api/workspace/files")
def get_workspace_files(path: str):
    """
    Scans the given absolute directory path and returns a structured file tree.
    """
    if not path or not os.path.exists(path):
         raise HTTPException(status_code=400, detail="Invalid workspace path provided.")
         
    def build_tree(current_path):
        tree = []
        try:
            # Sort folders first, then files
            items = sorted(os.listdir(current_path))
            folders = [i for i in items if os.path.isdir(os.path.join(current_path, i))]
            files = [i for i in items if os.path.isfile(os.path.join(current_path, i))]
            
            for item in folders + files:
                item_path = os.path.join(current_path, item)
                
                # Skip hidden folders like .git, .next, node_modules
                if item.startswith('.') or item == 'node_modules' or item == '__pycache__':
                    continue
                    
                is_dir = os.path.isdir(item_path)
                node = {
                    "name": item,
                    "path": item_path,
                    "type": "folder" if is_dir else "file"
                }
                
                if is_dir:
                    # Recursively build the tree for subfolders
                    node["children"] = build_tree(item_path)
                else:
                    # Try to guess the language for the code editor
                    ext = item.split('.')[-1].lower() if '.' in item else ''
                    node["language"] = ext
                    
                tree.append(node)
        except Exception as e:
            pass # Handle permission errors gracefully
            
        return tree

    file_tree = build_tree(path)
    return {"status": "success", "files": file_tree}

@app.get("/api/workspace/file-content")
def get_file_content(file_path: str):
    """
    Reads the physical text inside a specific file.
    """
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"status": "success", "content": content}
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

class SaveFileRequest(BaseModel):
    file_path: str
    content: str

@app.post("/api/workspace/save-file")
def save_file_content(req: SaveFileRequest):
    """
    Overwrites the specified file with new content from the editor.
    """
    if not os.path.exists(req.file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        with open(req.file_path, "w", encoding="utf-8") as f:
            f.write(req.content)
        return {"status": "success", "message": "File saved successfully"}
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# --- NEW: SERVE WORKSPACE ---
server_process = None

class ServeRequest(BaseModel):
    path: str

@app.post("/api/workspace/serve")
def serve_workspace(req: ServeRequest):
    """
    Kills any existing preview server and starts a new python http.server in the workspace path.
    """
    global server_process
    if not os.path.exists(req.path):
        raise HTTPException(status_code=404, detail="Workspace path not found")
    
    if server_process:
        try:
            server_process.kill()
        except:
            pass
            
    server_process = subprocess.Popen(["python", "-m", "http.server", "8080"], cwd=req.path)
    return {"status": "success", "url": "http://localhost:8080"}