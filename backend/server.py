from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field, EmailStr
import uuid
import stripe
import jwt
from supabase import create_client, Client
import asyncio
from enum import Enum

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Supabase client
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET_KEY')
JWT_ALGORITHM = "HS256"

# Create FastAPI app
app = FastAPI(title="EuroLove Dating Platform API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enums
class UserRole(str, Enum):
    CLIENT = "client"
    ESCORT = "escort"
    
class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class GiftType(str, Enum):
    HEART = "heart"
    ROSE = "rose"
    DIAMOND = "diamond"
    CROWN = "crown"
    LUXURY_CAR = "luxury_car"

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    age: int
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    age: int
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None
    credits: int = 0
    earnings: float = 0.0
    vip_status: bool = False
    vip_expires_at: Optional[datetime] = None
    created_at: datetime
    status: UserStatus = UserStatus.ACTIVE

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None
    age: Optional[int] = None

class Gift(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    gift_type: GiftType
    credits_cost: int
    money_value: float
    message: Optional[str] = None
    created_at: datetime

class SendGift(BaseModel):
    receiver_id: str
    gift_type: GiftType
    message: Optional[str] = None

class Subscription(BaseModel):
    id: str
    user_id: str
    plan_type: str
    price: float
    expires_at: datetime
    created_at: datetime
    stripe_subscription_id: Optional[str] = None

class CreateCheckoutSession(BaseModel):
    product_type: str  # "credits" or "vip"
    package_id: str
    success_url: str
    cancel_url: str

class RepostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class Repost(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    image_url: Optional[str] = None
    likes: int = 0
    earnings: float = 0.0
    created_at: datetime

# Gift pricing configuration
GIFT_PRICES = {
    GiftType.HEART: {"credits": 1, "value": 0.01},
    GiftType.ROSE: {"credits": 5, "value": 0.05},
    GiftType.DIAMOND: {"credits": 10, "value": 0.10},
    GiftType.CROWN: {"credits": 25, "value": 0.25},
    GiftType.LUXURY_CAR: {"credits": 100, "value": 1.00},
}

# Credit packages
CREDIT_PACKAGES = {
    "starter": {"credits": 100, "price": 5.00, "name": "Starter Pack"},
    "popular": {"credits": 500, "price": 20.00, "name": "Popular Pack"},
    "premium": {"credits": 1000, "price": 35.00, "name": "Premium Pack"},
}

# VIP packages
VIP_PACKAGES = {
    "monthly": {"duration_days": 30, "price": 9.99, "name": "Monthly VIP"},
    "yearly": {"duration_days": 365, "price": 99.99, "name": "Yearly VIP"},
}

# Database initialization
async def init_database():
    """Initialize database tables"""
    try:
        # Create profiles table
        supabase.table('profiles').select('id').limit(1).execute()
        logger.info("Database tables verified")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

# Authentication helpers
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user from Supabase
    response = supabase.table('profiles').select('*').eq('id', user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return response.data[0]

# Routes
@api_router.get("/")
async def root():
    return {"message": "EuroLove Dating Platform API", "version": "1.0.0"}

# Authentication endpoints
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    try:
        # First check if user already exists
        existing_user = supabase.table('profiles').select('email').eq('email', user_data.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or try logging in.")
        
        # Register user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if auth_response.user:
            user_id = auth_response.user.id
            
            # Create user profile
            profile_data = {
                "id": user_id,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "role": user_data.role.value,
                "age": user_data.age,
                "bio": user_data.bio,
                "location": user_data.location,
                "profile_image": user_data.profile_image,
                "credits": 50,  # Welcome bonus
                "earnings": 0.0,
                "vip_status": False,
                "created_at": datetime.utcnow().isoformat(),
                "status": UserStatus.ACTIVE.value
            }
            
            try:
                profile_response = supabase.table('profiles').insert(profile_data).execute()
            except Exception as profile_error:
                # If profile creation fails, clean up the auth user
                logger.error(f"Profile creation failed: {profile_error}")
                if "duplicate key value violates unique constraint" in str(profile_error) or "already exists" in str(profile_error):
                    raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or try logging in.")
                else:
                    raise HTTPException(status_code=500, detail="Registration failed. Please try again.")
            
            # Create access token
            access_token = create_access_token({"sub": user_id, "email": user_data.email})
            
            return {
                "message": "User registered successfully",
                "access_token": access_token,
                "token_type": "bearer",
                "user": profile_response.data[0]
            }
        else:
            # Handle Supabase auth errors
            if hasattr(auth_response, 'error') and auth_response.error:
                error_message = auth_response.error.message
                if "already registered" in error_message or "already exists" in error_message:
                    raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or try logging in.")
                else:
                    raise HTTPException(status_code=400, detail=f"Registration failed: {error_message}")
            else:
                raise HTTPException(status_code=400, detail="Registration failed")
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        error_str = str(e).lower()
        if "duplicate" in error_str or "already exists" in error_str or "unique constraint" in error_str:
            raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or try logging in.")
        else:
            raise HTTPException(status_code=500, detail="Registration failed. Please try again.")

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    try:
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if auth_response.user:
            user_id = auth_response.user.id
            
            # Get user profile
            profile_response = supabase.table('profiles').select('*').eq('id', user_id).execute()
            
            if profile_response.data:
                access_token = create_access_token({"sub": user_id, "email": user_data.email})
                
                return {
                    "message": "Login successful",
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": profile_response.data[0]
                }
            else:
                raise HTTPException(status_code=404, detail="User profile not found")
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return {"message": "Logout successful"}

# Profile endpoints
@api_router.get("/profile/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.put("/profile/me")
async def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    try:
        update_data = {}
        
        if profile_data.full_name:
            update_data["full_name"] = profile_data.full_name
        if profile_data.bio:
            update_data["bio"] = profile_data.bio
        if profile_data.location:
            update_data["location"] = profile_data.location
        if profile_data.profile_image:
            update_data["profile_image"] = profile_data.profile_image
        if profile_data.age:
            update_data["age"] = profile_data.age
            
        response = supabase.table('profiles').update(update_data).eq('id', current_user['id']).execute()
        
        return {"message": "Profile updated successfully", "profile": response.data[0]}
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/profiles")
async def get_profiles(role: Optional[UserRole] = None, limit: int = 20, offset: int = 0):
    try:
        query = supabase.table('profiles').select('id,email,full_name,role,age,bio,location,profile_image,vip_status,created_at')
        
        if role:
            query = query.eq('role', role.value)
            
        query = query.eq('status', UserStatus.ACTIVE.value).range(offset, offset + limit - 1)
        response = query.execute()
        
        return {"profiles": response.data}
    except Exception as e:
        logger.error(f"Get profiles error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/profiles/{user_id}")
async def get_profile(user_id: str):
    try:
        response = supabase.table('profiles').select('id,email,full_name,role,age,bio,location,profile_image,vip_status,created_at').eq('id', user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return {"profile": response.data[0]}
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Gift endpoints
@api_router.get("/gifts/types")
async def get_gift_types():
    return {
        "gift_types": [
            {"type": gift_type.value, "credits": data["credits"], "value": data["value"]}
            for gift_type, data in GIFT_PRICES.items()
        ]
    }

@api_router.post("/gifts/send")
async def send_gift(gift_data: SendGift, current_user: dict = Depends(get_current_user)):
    try:
        # Validate gift type and get pricing
        if gift_data.gift_type not in GIFT_PRICES:
            raise HTTPException(status_code=400, detail="Invalid gift type")
            
        gift_info = GIFT_PRICES[gift_data.gift_type]
        
        # Check if user has enough credits
        if current_user['credits'] < gift_info['credits']:
            raise HTTPException(status_code=400, detail="Insufficient credits")
            
        # Verify receiver exists
        receiver_response = supabase.table('profiles').select('*').eq('id', gift_data.receiver_id).execute()
        if not receiver_response.data:
            raise HTTPException(status_code=404, detail="Receiver not found")
            
        receiver = receiver_response.data[0]
        
        # Create gift record
        gift_record = {
            "id": str(uuid.uuid4()),
            "sender_id": current_user['id'],
            "receiver_id": gift_data.receiver_id,
            "gift_type": gift_data.gift_type.value,
            "credits_cost": gift_info['credits'],
            "money_value": gift_info['value'],
            "message": gift_data.message,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insert gift
        supabase.table('gifts').insert(gift_record).execute()
        
        # Update sender credits
        new_sender_credits = current_user['credits'] - gift_info['credits']
        supabase.table('profiles').update({"credits": new_sender_credits}).eq('id', current_user['id']).execute()
        
        # Update receiver earnings
        new_receiver_earnings = receiver['earnings'] + gift_info['value']
        supabase.table('profiles').update({"earnings": new_receiver_earnings}).eq('id', gift_data.receiver_id).execute()
        
        return {"message": "Gift sent successfully", "gift": gift_record}
    except Exception as e:
        logger.error(f"Send gift error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/gifts/received")
async def get_received_gifts(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.table('gifts').select('*').eq('receiver_id', current_user['id']).order('created_at', desc=True).execute()
        return {"gifts": response.data}
    except Exception as e:
        logger.error(f"Get received gifts error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/gifts/sent")
async def get_sent_gifts(current_user: dict = Depends(get_current_user)):
    try:
        response = supabase.table('gifts').select('*').eq('sender_id', current_user['id']).order('created_at', desc=True).execute()
        return {"gifts": response.data}
    except Exception as e:
        logger.error(f"Get sent gifts error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Rewards and Leaderboard endpoints
@api_router.get("/rewards/pools")
async def get_reward_pools():
    # Calculate reward pools based on platform revenue
    total_client_pool = 580.0  # 50% of gifts + 20% of subscriptions
    total_escort_pool = 580.0  # 50% of gifts + 30% of reposts
    
    return {
        "client_reward_pool": total_client_pool,
        "escort_reward_pool": total_escort_pool,
        "total_rewards": total_client_pool + total_escort_pool,
        "next_distribution": "2025-02-01T00:00:00Z"
    }

@api_router.get("/rewards/client-leaderboard")
async def get_client_leaderboard():
    try:
        # Get top 10 clients by credits spent
        response = supabase.table('profiles').select('id,full_name,profile_image,credits,earnings').eq('role', 'client').order('earnings', desc=True).limit(10).execute()
        
        # Calculate rewards for top 10
        leaderboard = []
        for idx, client in enumerate(response.data):
            reward_percentage = max(0.1, 0.5 - (idx * 0.04))  # Decreasing rewards
            estimated_reward = 580.0 * reward_percentage
            
            leaderboard.append({
                "rank": idx + 1,
                "user": client,
                "estimated_reward": round(estimated_reward, 2)
            })
            
        return {"leaderboard": leaderboard}
    except Exception as e:
        logger.error(f"Client leaderboard error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/rewards/escort-leaderboard")
async def get_escort_leaderboard():
    try:
        # Get top 5 escorts by earnings
        response = supabase.table('profiles').select('id,full_name,profile_image,credits,earnings').eq('role', 'escort').order('earnings', desc=True).limit(5).execute()
        
        # Calculate rewards for top 5
        leaderboard = []
        for idx, escort in enumerate(response.data):
            reward_percentage = max(0.1, 0.4 - (idx * 0.06))  # Decreasing rewards
            estimated_reward = 580.0 * reward_percentage
            
            leaderboard.append({
                "rank": idx + 1,
                "user": escort,
                "estimated_reward": round(estimated_reward, 2)
            })
            
        return {"leaderboard": leaderboard}
    except Exception as e:
        logger.error(f"Escort leaderboard error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Payment endpoints
@api_router.get("/payments/packages/credits")
async def get_credit_packages():
    return {"packages": CREDIT_PACKAGES}

@api_router.get("/payments/packages/vip")
async def get_vip_packages():
    return {"packages": VIP_PACKAGES}

@api_router.post("/payments/checkout/session")
async def create_checkout_session(session_data: CreateCheckoutSession, current_user: dict = Depends(get_current_user)):
    try:
        if session_data.product_type == "credits":
            package = CREDIT_PACKAGES.get(session_data.package_id)
            if not package:
                raise HTTPException(status_code=400, detail="Invalid package")
                
            stripe_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': package['name'],
                            'description': f"{package['credits']} credits"
                        },
                        'unit_amount': int(package['price'] * 100),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=session_data.success_url,
                cancel_url=session_data.cancel_url,
                client_reference_id=current_user['id'],
                metadata={
                    'product_type': 'credits',
                    'package_id': session_data.package_id,
                    'credits': package['credits']
                }
            )
            
        elif session_data.product_type == "vip":
            package = VIP_PACKAGES.get(session_data.package_id)
            if not package:
                raise HTTPException(status_code=400, detail="Invalid package")
                
            stripe_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': package['name'],
                            'description': f"{package['duration_days']} days VIP access"
                        },
                        'unit_amount': int(package['price'] * 100),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=session_data.success_url,
                cancel_url=session_data.cancel_url,
                client_reference_id=current_user['id'],
                metadata={
                    'product_type': 'vip',
                    'package_id': session_data.package_id,
                    'duration_days': package['duration_days']
                }
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid product type")
            
        return {"session_id": stripe_session.id, "url": stripe_session.url}
    except Exception as e:
        logger.error(f"Checkout session error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {"status": session.payment_status, "session": session}
    except Exception as e:
        logger.error(f"Checkout status error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Stripe webhook
@api_router.post("/payments/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['client_reference_id']
        metadata = session['metadata']
        
        if metadata['product_type'] == 'credits':
            # Add credits to user
            credits_to_add = int(metadata['credits'])
            response = supabase.table('profiles').select('credits').eq('id', user_id).execute()
            if response.data:
                current_credits = response.data[0]['credits']
                new_credits = current_credits + credits_to_add
                supabase.table('profiles').update({"credits": new_credits}).eq('id', user_id).execute()
                
        elif metadata['product_type'] == 'vip':
            # Add VIP subscription
            duration_days = int(metadata['duration_days'])
            expires_at = datetime.utcnow() + timedelta(days=duration_days)
            
            supabase.table('profiles').update({
                "vip_status": True,
                "vip_expires_at": expires_at.isoformat()
            }).eq('id', user_id).execute()

    return {"status": "success"}

# Repost endpoints
@api_router.post("/reposts")
async def create_repost(repost_data: RepostCreate, current_user: dict = Depends(get_current_user)):
    try:
        repost_record = {
            "id": str(uuid.uuid4()),
            "user_id": current_user['id'],
            "title": repost_data.title,
            "content": repost_data.content,
            "image_url": repost_data.image_url,
            "likes": 0,
            "earnings": 0.0,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table('reposts').insert(repost_record).execute()
        return {"message": "Repost created successfully", "repost": response.data[0]}
    except Exception as e:
        logger.error(f"Create repost error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/reposts")
async def get_reposts(limit: int = 20, offset: int = 0):
    try:
        response = supabase.table('reposts').select('*').order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        return {"reposts": response.data}
    except Exception as e:
        logger.error(f"Get reposts error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/reposts/user/{user_id}")
async def get_user_reposts(user_id: str):
    try:
        response = supabase.table('reposts').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        return {"reposts": response.data}
    except Exception as e:
        logger.error(f"Get user reposts error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Include router
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    await init_database()
    logger.info("EuroLove Dating Platform API started successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("EuroLove Dating Platform API shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
