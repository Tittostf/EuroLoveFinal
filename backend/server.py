from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timedelta
import hashlib
import jwt
from decimal import Decimal

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

# Security
security = HTTPBearer()
SECRET_KEY = "eurolove_secret_key_2025"  # In production, use environment variable

# Database Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    user_type: Literal["client", "escort", "admin"]
    credits: float = Field(default=0.0)
    points: float = Field(default=0.0)
    profile_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # Escort specific fields
    name: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None
    services: List[str] = Field(default_factory=list)
    hourly_rate: Optional[float] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    verified: bool = Field(default=False)
    vip: bool = Field(default=False)

class Gift(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str  # Client ID
    recipient_id: str  # Escort ID
    gift_name: str
    gift_value: float  # In credits/euros
    platform_share: float  # 30% of value
    escort_share: float  # 70% of value
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["completed", "pending", "failed"] = "completed"

class Repost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    escort_id: str
    cost: float = Field(default=2.0)  # 2 credits per repost
    points_earned: float = Field(default=2.0)  # 2 points per repost
    repost_date: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["completed", "pending", "failed"] = "completed"

class PlatformRevenue(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: Literal["gift", "repost", "subscription", "other"]
    amount: float
    date: datetime = Field(default_factory=datetime.utcnow)
    description: str

# Request/Response Models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    user_type: Literal["client", "escort"]
    
    # Optional escort fields
    name: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None
    services: List[str] = Field(default_factory=list)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SendGiftRequest(BaseModel):
    recipient_id: str
    gift_name: str
    gift_value: float

class RepostRequest(BaseModel):
    escort_id: str

class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    points: float
    rank: int
    # Additional fields for display
    name: Optional[str] = None
    total_spent: Optional[float] = None
    total_earned: Optional[float] = None

class AdminStats(BaseModel):
    total_revenue: float
    total_gifts: int
    total_reposts: int
    total_clients: int
    total_escorts: int
    top_clients: List[LeaderboardEntry]
    top_escorts: List[LeaderboardEntry]

# Utility Functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_jwt_token(user_id: str, user_type: str) -> str:
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_doc = await db.users.find_one({"id": user_id})
        if not user_doc:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user_doc)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Authentication Routes
@api_router.post("/register")
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"email": user_data.email}, {"username": user_data.username}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        user_type=user_data.user_type,
        name=user_data.name,
        age=user_data.age,
        location=user_data.location,
        services=user_data.services,
        credits=100.0 if user_data.user_type == "client" else 50.0  # Welcome credits
    )
    
    await db.users.insert_one(user.dict())
    
    # Create JWT token
    token = create_jwt_token(user.id, user.user_type)
    
    return {
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "user_type": user.user_type,
            "credits": user.credits
        }
    }

@api_router.post("/login")
async def login_user(login_data: UserLogin):
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc or not verify_password(login_data.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_doc)
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    token = create_jwt_token(user.id, user.user_type)
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "user_type": user.user_type,
            "credits": user.credits,
            "points": user.points
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
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
