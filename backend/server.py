from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'admin@quasarapps.com')

# Create the main app without a prefix
app = FastAPI()

# Rate limiting (in-memory store; use a shared backend like Redis for multi-instance).
# Keys on the client IP via ``request.client.host``.
#
# IMPORTANT (deploy): run uvicorn with ``--proxy-headers --forwarded-allow-ips=<proxy-ip>``
# so it derives the real client IP from X-Forwarded-For ONLY when set by the trusted edge
# proxy. We deliberately do NOT parse X-Forwarded-For in app code: the client-settable
# left-most hop is spoofable, so trusting it would let an attacker rotate the header for a
# fresh bucket per request and bypass the limit entirely (fail-open). Without proxy-header
# trust the key is coarser (the proxy IP — limit is global) but still fails CLOSED.
# Wiring the proxy flags is tracked for Phase 5 (deploy/run setup).
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Best-effort guard: reject obviously-oversized requests by their Content-Length header
# before routing. NOT a hard limit — chunked requests omit Content-Length and the header
# is client-supplied. The real bound on the contact payload is the pydantic field caps
# (message <= 5000); enforce a true hard limit at the proxy/ASGI layer
# (e.g. nginx client_max_body_size) — see ROADMAP SEC-5.
MAX_BODY_BYTES = 64 * 1024


@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length is not None:
        try:
            if int(content_length) > MAX_BODY_BYTES:
                return JSONResponse(status_code=413, content={"detail": "Request body too large"})
        except ValueError:
            pass
    return await call_next(request)


# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Contact Form Model
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=150)
    message: str = Field(min_length=1, max_length=5000)
    # Honeypot: a hidden field real users never fill. Bot submissions that populate it
    # are silently dropped. The obscure name avoids browser/password-manager autofill
    # (a "website"/"email" name could drop a real lead). Capped to limit abuse.
    hp_field: Optional[str] = Field(default=None, max_length=200)


# Case Study Model
class CaseStudy(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    title: str
    slug: str
    client: str
    industry: str
    services: List[str]
    duration: str
    year: str
    hero_image: str
    thumbnail: str
    short_description: str
    challenge: str
    solution: str
    results: List[str]
    technologies: List[str]
    testimonial: Optional[str] = None
    testimonial_author: Optional[str] = None
    testimonial_role: Optional[str] = None
    gallery: List[str] = []


# Seed case studies data
CASE_STUDIES = [
    {
        "id": "1",
        "title": "myCSA.app",
        "slug": "mycsa-app",
        "client": "myCSA",
        "industry": "Agriculture & Farm Tech",
        "services": ["Web Application", "UX Design", "Full-Stack Development"],
        "duration": "Ongoing",
        "year": "2024-Present",
        "hero_image": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?crop=entropy&cs=srgb&fm=jpg&q=85",
        "thumbnail": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "short_description": "A comprehensive farm management platform that brings orders, crops, harvest, packing, and delivery into one connected system.",
        "challenge": "Small and medium-sized farms were running their operations across texts, spreadsheets, and memory. They needed a unified system to manage CSA (Community Supported Agriculture) subscriptions, track crops and lots, coordinate harvest and packing, and handle delivery routes—all while giving different team members the views they need.",
        "solution": "We designed and built myCSA.app from the ground up with a UX-led approach. The platform features role-based dashboards for admins, growers, packers, sellers, and drivers. We created Sage, an operational intelligence layer that surfaces pressure, shortages, blockers, and next actions using real farm data. The system handles everything from order management and crop tracking to packing queues and delivery dispatch.",
        "results": ["End-to-end farm operation visibility", "Role-based dashboards for entire team", "Sage AI surfaces issues before they hit orders", "No commission per order pricing model"],
        "technologies": ["React", "Node.js", "PostgreSQL", "Real-time data processing", "AI/ML for operational intelligence"],
        "testimonial": "Made by farmers, for farmers. Less farm admin, more real farm work.",
        "testimonial_author": "myCSA Team",
        "testimonial_role": "Farm Operations",
        "gallery": ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?crop=entropy&cs=srgb&fm=jpg&q=85"]
    }
]

# Routes
@api_router.get("/")
async def root():
    return {"message": "Quasar Apps API"}


# Case Studies Routes
@api_router.get("/case-studies", response_model=List[CaseStudy])
async def get_case_studies():
    return CASE_STUDIES


@api_router.get("/case-studies/{slug}", response_model=CaseStudy)
async def get_case_study(slug: str):
    for study in CASE_STUDIES:
        if study["slug"] == slug:
            return study
    raise HTTPException(status_code=404, detail="Case study not found")


# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
@limiter.limit("5/minute")
async def submit_contact(request: Request, input: ContactMessageCreate):
    contact_obj = ContactMessage(**input.model_dump())

    # Honeypot: silently accept and drop bot submissions (no store, no email).
    if input.hp_field:
        logger.info("Dropped contact submission via honeypot")
        return contact_obj

    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()

    # Save to database
    _ = await db.contact_messages.insert_one(doc)

    # Send email notification
    try:
        from html import escape

        safe_name = escape(input.name)
        safe_email = escape(str(input.email))
        safe_company = escape(input.company) if input.company else "Not provided"
        safe_message = escape(input.message).replace("\n", "<br/>")

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D111A2;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #eee;">
            <p><strong>Name:</strong> {safe_name}</p>
            <p><strong>Email:</strong> {safe_email}</p>
            <p><strong>Company:</strong> {safe_company}</p>
            <h3 style="color: #333;">Message:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">{safe_message}</p>
            <hr style="border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Sent from Quasar Apps contact form</p>
        </div>
        """

        params = {
            "from": "Quasar Apps <noreply@quasarapps.com>",
            "to": [CONTACT_EMAIL],
            "subject": f"New Contact: {input.name}" + (f" from {input.company}" if input.company else ""),
            "html": html_content,
            "reply_to": input.email
        }

        # Run sync SDK in thread to keep FastAPI non-blocking
        if resend.api_key:
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Contact email sent for {input.email}")
        else:
            logger.warning("RESEND_API_KEY not set; skipping contact email notification")
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        # Don't raise exception - still return success since message was saved

    return contact_obj


# Include the router in the main app
app.include_router(api_router)

# CORS — credentials disabled, so a wildcard origin doesn't expose authenticated
# data (CORS is not an auth boundary); methods/headers are pinned. Set CORS_ORIGINS
# to the production frontend origin(s) to restrict cross-origin access.
_cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '*').split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=_cors_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
