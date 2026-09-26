"""ARC (AI Responsive Companion) FastAPI application entrypoint."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import init_db, AsyncSessionLocal
from app.api.voice import router as voice_router
from app.api.medicines import router as medicines_router
from app.api.health import router as health_router
from app.api.emergency import router as emergency_router
from app.api.caregivers import router as caregivers_router
from app.api.reports import router as reports_router
from app.api.government import router as government_router
from app.api.checkins import router as checkins_router
from app.api.demo import router as demo_router, seed_demo_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema and seeds demo scenario on startup."""
    logger.info("Initializing ARC Database...")
    await init_db()

    # Pre-seed demo scenario for Lakshmi
    try:
        async with AsyncSessionLocal() as session:
            await seed_demo_data(session)
            logger.info("Pre-seeded demo scenario for Lakshmi (72).")
    except Exception as e:
        logger.warning(f"Demo seeding note: {e}")

    yield
    logger.info("ARC Backend shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Voice-first, multilingual elderly assistance and caregiver coordination platform.",
    lifespan=lifespan,
)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
api_v1 = settings.API_V1_PREFIX
app.include_router(voice_router, prefix=api_v1)
app.include_router(medicines_router, prefix=api_v1)
app.include_router(health_router, prefix=api_v1)
app.include_router(emergency_router, prefix=api_v1)
app.include_router(caregivers_router, prefix=api_v1)
app.include_router(reports_router, prefix=api_v1)
app.include_router(government_router, prefix=api_v1)
app.include_router(checkins_router, prefix=api_v1)
app.include_router(demo_router, prefix=api_v1)


@app.get("/")
async def root():
    return {
        "app": "ARC — AI Responsive Companion",
        "tagline": "Speak. Connect. Stay Safe.",
        "message": "Technology that adapts to the elder — not the other way around.",
        "status": "online",
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
    }


@app.get("/healthz")
async def health_check():
    return {"status": "healthy"}


@app.get(f"{api_v1}/grok/status")
async def get_grok_status():
    from app.agents.grok_agent import grok_agent
    configured = grok_agent.has_api_key()
    return {
        "configured": configured,
        "model": "grok-beta",
        "provider": "xAI Grok",
        "status": "ready" if configured else "fallback_to_local_qa",
    }


from pydantic import BaseModel
class GrokConfigRequest(BaseModel):
    api_key: str

@app.post(f"{api_v1}/grok/config")
async def configure_grok(req: GrokConfigRequest):
    from app.agents.grok_agent import grok_agent
    grok_agent.set_api_key(req.api_key)
    return {
        "success": True,
        "configured": grok_agent.has_api_key(),
        "message": "Grok API Key configured successfully. ARC is now backed by xAI Grok generative intelligence.",
    }
