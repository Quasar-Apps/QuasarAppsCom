from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
        "title": "Fintech Revolution",
        "slug": "fintech-revolution",
        "client": "NeoBank Pro",
        "industry": "Financial Services",
        "services": ["Mobile App Development", "UX Design", "Backend Architecture"],
        "duration": "8 months",
        "year": "2024",
        "hero_image": "https://images.unsplash.com/photo-1720135885007-454165745e21?crop=entropy&cs=srgb&fm=jpg&q=85",
        "thumbnail": "https://images.unsplash.com/photo-1720135885007-454165745e21?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "short_description": "A groundbreaking mobile banking app that redefined user experience in financial services.",
        "challenge": "NeoBank Pro needed to create a mobile-first banking experience that could compete with established players while offering innovative features that appeal to younger demographics. The existing solutions in the market were clunky and failed to provide intuitive navigation.",
        "solution": "We designed and developed a comprehensive mobile banking platform with biometric authentication, real-time spending insights, AI-powered financial advice, and a seamless peer-to-peer payment system. The dark mode interface reduces eye strain and creates a premium feel.",
        "results": ["500K+ downloads in first 3 months", "4.8★ rating on App Store", "40% reduction in customer support tickets", "60% increase in daily active users"],
        "technologies": ["React Native", "Node.js", "PostgreSQL", "AWS", "TensorFlow"],
        "testimonial": "Quasar Apps transformed our vision into reality. The attention to UX detail was exceptional.",
        "testimonial_author": "Sarah Chen",
        "testimonial_role": "CEO, NeoBank Pro",
        "gallery": ["https://images.unsplash.com/photo-1720135885007-454165745e21?crop=entropy&cs=srgb&fm=jpg&q=85"]
    },
    {
        "id": "2",
        "title": "Sonic Pulse",
        "slug": "sonic-pulse",
        "client": "BeatStream Inc.",
        "industry": "Entertainment",
        "services": ["iOS Development", "Android Development", "Audio Engineering"],
        "duration": "6 months",
        "year": "2024",
        "hero_image": "https://images.pexels.com/photos/12605419/pexels-photo-12605419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "thumbnail": "https://images.pexels.com/photos/12605419/pexels-photo-12605419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "short_description": "An immersive EDM music streaming app with live DJ sets and social features.",
        "challenge": "BeatStream wanted to create a unique music streaming platform focused on electronic dance music that goes beyond just playing tracks, offering live events, artist interactions, and a vibrant community experience.",
        "solution": "We built a cutting-edge streaming platform with real-time audio processing, live DJ broadcast capabilities, spatial audio support, and integrated social features. The visualizer adapts to the music beat, creating an immersive experience.",
        "results": ["1M+ active users", "200+ partnered DJs", "Featured in Apple's Best Apps 2024", "3x user engagement vs competitors"],
        "technologies": ["Swift", "Kotlin", "WebRTC", "Firebase", "Core Audio"],
        "testimonial": "The audio quality and UX are unmatched. Quasar truly understood our vision for the future of music.",
        "testimonial_author": "Marcus Webb",
        "testimonial_role": "Founder, BeatStream Inc.",
        "gallery": ["https://images.pexels.com/photos/12605419/pexels-photo-12605419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]
    },
    {
        "id": "3",
        "title": "Enterprise Command",
        "slug": "enterprise-command",
        "client": "TechCorp Global",
        "industry": "Enterprise Software",
        "services": ["Web Application", "Dashboard Design", "Data Visualization"],
        "duration": "12 months",
        "year": "2023",
        "hero_image": "https://images.unsplash.com/photo-1706700392642-dee59f678a09?crop=entropy&cs=srgb&fm=jpg&q=85",
        "thumbnail": "https://images.unsplash.com/photo-1706700392642-dee59f678a09?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "short_description": "A powerful enterprise dashboard bringing data intelligence to decision makers.",
        "challenge": "TechCorp needed a unified dashboard to aggregate data from multiple sources, provide real-time analytics, and enable executives to make data-driven decisions without technical expertise.",
        "solution": "We developed a comprehensive enterprise command center with customizable widgets, real-time data streaming, predictive analytics, automated reporting, and role-based access control. The matrix-inspired design creates a futuristic command center feel.",
        "results": ["85% faster decision-making", "50% reduction in reporting time", "Deployed across 12 countries", "ROI achieved in 6 months"],
        "technologies": ["React", "Python", "Apache Kafka", "Elasticsearch", "Kubernetes"],
        "testimonial": "This dashboard has transformed how we operate. It's like having a command center for our entire business.",
        "testimonial_author": "James Morrison",
        "testimonial_role": "CTO, TechCorp Global",
        "gallery": ["https://images.unsplash.com/photo-1706700392642-dee59f678a09?crop=entropy&cs=srgb&fm=jpg&q=85"]
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
    
    _ = await db.contact_messages.insert_one(doc)
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
