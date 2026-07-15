from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app import models

app = FastAPI(
    title="KSP IntelliCrime AI",
    description="AI-Powered Crime Intelligence & Decision Support Platform",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to KSP IntelliCrime AI", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}