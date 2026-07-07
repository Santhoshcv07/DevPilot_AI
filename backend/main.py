from fastapi import FastAPI

# 1. Initialize the FastAPI application
app = FastAPI(title="DevPilot AI API")

# 2. Create our first "Route" or "Endpoint"
@app.get("/")
async def root():
    return {"message": "Welcome to DevPilot AI Backend! The server is alive."}