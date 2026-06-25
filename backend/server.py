from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'admin@quasarapps.com')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

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
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str

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

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

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
async def submit_contact(input: ContactMessageCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    # Save to database
    _ = await db.contact_messages.insert_one(doc)
    
    # Send email notification
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D111A2;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #eee;">
            <p><strong>Name:</strong> {input.name}</p>
            <p><strong>Email:</strong> {input.email}</p>
            <p><strong>Company:</strong> {input.company or 'Not provided'}</p>
            <h3 style="color: #333;">Message:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">{input.message}</p>
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
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact email sent for {input.email}")
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}")
        # Don't raise exception - still return success since message was saved
    
    return contact_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['created_at'], str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
