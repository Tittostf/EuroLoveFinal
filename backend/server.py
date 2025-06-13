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

# Gift System Routes
@api_router.post("/send-gift")
async def send_gift(gift_request: SendGiftRequest, current_user: User = Depends(get_current_user)):
    if current_user.user_type != "client":
        raise HTTPException(status_code=403, detail="Only clients can send gifts")
    
    # Check if client has enough credits
    if current_user.credits < gift_request.gift_value:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    
    # Get recipient (escort)
    recipient_doc = await db.users.find_one({"id": gift_request.recipient_id, "user_type": "escort"})
    if not recipient_doc:
        raise HTTPException(status_code=404, detail="Escort not found")
    
    recipient = User(**recipient_doc)
    
    # Calculate shares
    platform_share = gift_request.gift_value * 0.30  # 30% to platform
    escort_share = gift_request.gift_value * 0.70    # 70% to escort
    
    # Create gift transaction
    gift = Gift(
        sender_id=current_user.id,
        recipient_id=gift_request.recipient_id,
        gift_name=gift_request.gift_name,
        gift_value=gift_request.gift_value,
        platform_share=platform_share,
        escort_share=escort_share
    )
    
    # Start database transaction
    async with await client.start_session() as session:
        async with session.start_transaction():
            # Deduct credits from client
            await db.users.update_one(
                {"id": current_user.id},
                {"$inc": {
                    "credits": -gift_request.gift_value,
                    "points": gift_request.gift_value  # 1€ = 1 point for clients
                }},
                session=session
            )
            
            # Add earnings to escort
            await db.users.update_one(
                {"id": gift_request.recipient_id},
                {"$inc": {
                    "credits": escort_share,
                    "points": gift_request.gift_value  # 1€ received = 1 point for escorts
                }},
                session=session
            )
            
            # Record gift transaction
            await db.gifts.insert_one(gift.dict(), session=session)
            
            # Record platform revenue
            revenue = PlatformRevenue(
                source="gift",
                amount=platform_share,
                description=f"Gift: {gift_request.gift_name} from {current_user.username} to {recipient.username}"
            )
            await db.platform_revenue.insert_one(revenue.dict(), session=session)
    
    return {
        "message": "Gift sent successfully",
        "gift_id": gift.id,
        "remaining_credits": current_user.credits - gift_request.gift_value
    }

@api_router.post("/repost")
async def repost_ad(repost_request: RepostRequest, current_user: User = Depends(get_current_user)):
    if current_user.user_type != "escort":
        raise HTTPException(status_code=403, detail="Only escorts can repost")
    
    if current_user.id != repost_request.escort_id:
        raise HTTPException(status_code=403, detail="Can only repost own profile")
    
    # Check if escort has enough credits
    repost_cost = 2.0
    if current_user.credits < repost_cost:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    
    # Create repost transaction
    repost = Repost(
        escort_id=current_user.id,
        cost=repost_cost,
        points_earned=2.0
    )
    
    # Start database transaction
    async with await client.start_session() as session:
        async with session.start_transaction():
            # Deduct credits and add points to escort
            await db.users.update_one(
                {"id": current_user.id},
                {"$inc": {
                    "credits": -repost_cost,
                    "points": 2.0  # 2 points per repost
                }},
                session=session
            )
            
            # Record repost transaction
            await db.reposts.insert_one(repost.dict(), session=session)
            
            # Record platform revenue
            revenue = PlatformRevenue(
                source="repost",
                amount=repost_cost,
                description=f"Repost by {current_user.username}"
            )
            await db.platform_revenue.insert_one(revenue.dict(), session=session)
    
    return {
        "message": "Ad reposted successfully",
        "repost_id": repost.id,
        "remaining_credits": current_user.credits - repost_cost,
        "total_points": current_user.points + 2.0
    }

# Leaderboard Routes
@api_router.get("/leaderboard-clients", response_model=List[LeaderboardEntry])
async def get_client_leaderboard():
    # Get top clients by points (gift spending)
    clients = await db.users.find(
        {"user_type": "client"},
        {"_id": 0, "password_hash": 0}
    ).sort("points", -1).limit(10).to_list(10)
    
    leaderboard = []
    for rank, client in enumerate(clients, 1):
        # Calculate total spent from gifts
        total_spent_result = await db.gifts.aggregate([
            {"$match": {"sender_id": client["id"]}},
            {"$group": {"_id": None, "total": {"$sum": "$gift_value"}}}
        ]).to_list(1)
        
        total_spent = total_spent_result[0]["total"] if total_spent_result else 0.0
        
        leaderboard.append(LeaderboardEntry(
            user_id=client["id"],
            username=client["username"],
            points=client["points"],
            rank=rank,
            total_spent=total_spent
        ))
    
    return leaderboard

@api_router.get("/leaderboard-escorts", response_model=List[LeaderboardEntry])
async def get_escort_leaderboard():
    # Get top escorts by points (gifts received + reposts)
    escorts = await db.users.find(
        {"user_type": "escort"},
        {"_id": 0, "password_hash": 0}
    ).sort("points", -1).limit(10).to_list(10)
    
    leaderboard = []
    for rank, escort in enumerate(escorts, 1):
        # Calculate total earned from gifts
        total_earned_result = await db.gifts.aggregate([
            {"$match": {"recipient_id": escort["id"]}},
            {"$group": {"_id": None, "total": {"$sum": "$escort_share"}}}
        ]).to_list(1)
        
        total_earned = total_earned_result[0]["total"] if total_earned_result else 0.0
        
        leaderboard.append(LeaderboardEntry(
            user_id=escort["id"],
            username=escort["username"],
            points=escort["points"],
            rank=rank,
            name=escort.get("name"),
            total_earned=total_earned
        ))
    
    return leaderboard

# User Profile Routes
@api_router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "user_type": current_user.user_type,
        "credits": current_user.credits,
        "points": current_user.points,
        "name": current_user.name,
        "location": current_user.location,
        "verified": current_user.verified,
        "vip": current_user.vip
    }

@api_router.get("/gift-history")
async def get_gift_history(current_user: User = Depends(get_current_user)):
    if current_user.user_type == "client":
        # Get gifts sent by client
        gifts = await db.gifts.find({"sender_id": current_user.id}).sort("transaction_date", -1).to_list(100)
        
        # Enrich with recipient info
        for gift in gifts:
            recipient = await db.users.find_one({"id": gift["recipient_id"]}, {"username": 1, "name": 1})
            gift["recipient_name"] = recipient.get("name") or recipient.get("username")
            
    else:  # escort
        # Get gifts received by escort
        gifts = await db.gifts.find({"recipient_id": current_user.id}).sort("transaction_date", -1).to_list(100)
        
        # Enrich with sender info
        for gift in gifts:
            sender = await db.users.find_one({"id": gift["sender_id"]}, {"username": 1})
            gift["sender_name"] = sender.get("username")
    
    return gifts

@api_router.get("/repost-history")
async def get_repost_history(current_user: User = Depends(get_current_user)):
    if current_user.user_type != "escort":
        raise HTTPException(status_code=403, detail="Only escorts can view repost history")
    
    reposts = await db.reposts.find({"escort_id": current_user.id}).sort("repost_date", -1).to_list(100)
    return reposts

# Escort Discovery Routes
@api_router.get("/escorts")
async def get_escorts(city: Optional[str] = None, country: Optional[str] = None):
    query = {"user_type": "escort", "profile_active": True}
    
    if city or country:
        location_query = []
        if city:
            location_query.append({"location": {"$regex": city, "$options": "i"}})
        if country:
            location_query.append({"location": {"$regex": country, "$options": "i"}})
        query["$or"] = location_query
    
    escorts = await db.users.find(
        query,
        {"_id": 0, "password_hash": 0, "email": 0}
    ).sort("points", -1).to_list(100)
    
    # Add repost stats
    for escort in escorts:
        repost_count = await db.reposts.count_documents({"escort_id": escort["id"]})
        escort["repost_count"] = repost_count
        
        # Get last repost time
        last_repost = await db.reposts.find_one(
            {"escort_id": escort["id"]},
            sort=[("repost_date", -1)]
        )
        escort["last_repost"] = last_repost["repost_date"] if last_repost else None
    
    return escorts

# Admin Routes
async def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(admin_user: User = Depends(verify_admin)):
    # Calculate total revenue
    revenue_result = await db.platform_revenue.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
    
    # Count totals
    total_gifts = await db.gifts.count_documents({})
    total_reposts = await db.reposts.count_documents({})
    total_clients = await db.users.count_documents({"user_type": "client"})
    total_escorts = await db.users.count_documents({"user_type": "escort"})
    
    # Get top clients and escorts
    top_clients = await get_client_leaderboard()
    top_escorts = await get_escort_leaderboard()
    
    return AdminStats(
        total_revenue=total_revenue,
        total_gifts=total_gifts,
        total_reposts=total_reposts,
        total_clients=total_clients,
        total_escorts=total_escorts,
        top_clients=top_clients,
        top_escorts=top_escorts
    )

# Add admin user creation endpoint for initial setup
@api_router.post("/admin/create-admin")
async def create_admin(admin_data: UserCreate):
    # Check if any admin exists
    admin_exists = await db.users.find_one({"user_type": "admin"})
    if admin_exists:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    admin = User(
        username=admin_data.username,
        email=admin_data.email,
        password_hash=hash_password(admin_data.password),
        user_type="admin"
    )
    
    await db.users.insert_one(admin.dict())
    
    return {"message": "Admin created successfully"}

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
