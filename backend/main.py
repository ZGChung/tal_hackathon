from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, curriculum, preferences, rednote, rewrite, seed
from backend.database import init_db
import os

# Import models to ensure they're registered with Base
from backend.models import user
from backend.models import curriculum as curriculum_model
from backend.models import preferences as preferences_model

app = FastAPI(title="TAL Hackathon API", version="0.1.0")

# Configure CORS - support both dev and production
# If ALLOWED_ORIGINS is not set, allow all origins (for initial deployment)
# You should set ALLOWED_ORIGINS in production for security
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]
    allow_all_origins = False
else:
    # Default: allow all origins if not set (for initial deployment)
    # This allows the app to work immediately after deployment
    allowed_origins = ["*"]
    allow_all_origins = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not allow_all_origins else ["*"],
    allow_credentials=not allow_all_origins,  # Can't use credentials with allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(curriculum.router)
app.include_router(preferences.router)
app.include_router(rednote.router)
app.include_router(rewrite.router)
app.include_router(seed.router)


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    # Seed database with initial data for demo
    try:
        from backend.database_seed import seed_database
        import traceback

        seed_database()
    except Exception as e:
        # Don't fail startup if seeding fails, but print full error for debugging
        print(f"Warning: Database seeding failed: {e}")
        import traceback

        traceback.print_exc()


@app.get("/")
async def root():
    return {"message": "Welcome to TAL Hackathon API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
