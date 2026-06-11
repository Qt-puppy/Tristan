import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.api.routers import upload

load_dotenv()

app = FastAPI(
    title="Tristan Compliance Engine API",
    description="Backend API for Tristan document compliance and risk-screening engine.",
    version="1.0.0"
)

# Dynamic CORS configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Tristan API is running."}
