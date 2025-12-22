from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, curriculum
from backend.database import init_db
# Import models to ensure they're registered with Base
from backend.models import user
from backend.models import curriculum as curriculum_model

app = FastAPI(title="TAL Hackathon API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(curriculum.router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {"message": "Welcome to TAL Hackathon API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

