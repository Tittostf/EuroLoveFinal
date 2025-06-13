#!/usr/bin/env python3
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import hashlib
from datetime import datetime
import uuid

# Add parent directory to path to import server modules
sys.path.append('/app/backend')

load_dotenv('/app/backend/.env')

async def create_sample_data():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    mongo_client = AsyncIOMotorClient(mongo_url)
    db = mongo_client[os.environ['DB_NAME']]
    
    print("Creating sample data...")
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "username": "admin",
        "email": "admin@eurolove.com",
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
        "user_type": "admin",
        "credits": 0.0,
        "points": 0.0,
        "profile_active": True,
        "created_at": datetime.utcnow()
    }
    
    # Create sample clients
    clients = [
        {
            "id": str(uuid.uuid4()),
            "username": "client1",
            "email": "client1@example.com",
            "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
            "user_type": "client",
            "credits": 500.0,
            "points": 1200.0,
            "profile_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "client2",
            "email": "client2@example.com",
            "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
            "user_type": "client",
            "credits": 300.0,
            "points": 850.0,
            "profile_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    # Create sample escorts
    escorts = [
        {
            "id": str(uuid.uuid4()),
            "username": "isabella_vip",
            "email": "isabella@example.com",
            "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
            "user_type": "escort",
            "credits": 150.0,
            "points": 2450.0,
            "name": "Isabella",
            "age": 24,
            "location": "London, UK",
            "services": ["Companion", "Dinner Date", "City Tour"],
            "image_url": "https://images.pexels.com/photos/18906155/pexels-photo-18906155.jpeg",
            "verified": True,
            "vip": True,
            "profile_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "sophia_elite",
            "email": "sophia@example.com",
            "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
            "user_type": "escort",
            "credits": 100.0,
            "points": 1890.0,
            "name": "Sophia",
            "age": 26,
            "location": "Paris, France",
            "services": ["Companion", "Travel", "Events"],
            "image_url": "https://images.unsplash.com/photo-1635358154434-5254df331548",
            "verified": True,
            "vip": True,
            "profile_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "emma_berlin",
            "email": "emma@example.com",
            "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
            "user_type": "escort",
            "credits": 80.0,
            "points": 1340.0,
            "name": "Emma",
            "age": 23,
            "location": "Berlin, Germany",
            "services": ["Companion", "Massage", "Social Events"],
            "image_url": "https://images.pexels.com/photos/11797869/pexels-photo-11797869.jpeg",
            "verified": True,
            "vip": False,
            "profile_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    try:
        # Insert users
        all_users = [admin_user] + clients + escorts
        await db.users.insert_many(all_users)
        print(f"✅ Created {len(all_users)} users")
        
        # Create some sample gifts
        gifts = []
        for i, client in enumerate(clients):
            for j, escort in enumerate(escorts):
                if i <= j:  # Create some variety
                    gift_value = 50.0 + (i * j * 25)
                    gift = {
                        "id": str(uuid.uuid4()),
                        "sender_id": client["id"],
                        "recipient_id": escort["id"],
                        "gift_name": "Diamond" if gift_value > 100 else "Heart",
                        "gift_value": gift_value,
                        "platform_share": gift_value * 0.30,
                        "escort_share": gift_value * 0.70,
                        "transaction_date": datetime.utcnow(),
                        "status": "completed"
                    }
                    gifts.append(gift)
        
        if gifts:
            await db.gifts.insert_many(gifts)
            print(f"✅ Created {len(gifts)} gift transactions")
        
        # Create some sample reposts
        reposts = []
        for i, escort in enumerate(escorts):
            for j in range(i + 2):  # Different number of reposts per escort
                repost = {
                    "id": str(uuid.uuid4()),
                    "escort_id": escort["id"],
                    "cost": 2.0,
                    "points_earned": 2.0,
                    "repost_date": datetime.utcnow(),
                    "status": "completed"
                }
                reposts.append(repost)
        
        if reposts:
            await db.reposts.insert_many(reposts)
            print(f"✅ Created {len(reposts)} repost transactions")
        
        # Create platform revenue records
        total_gift_revenue = sum(gift["platform_share"] for gift in gifts)
        total_repost_revenue = sum(repost["cost"] for repost in reposts)
        
        revenue_records = [
            {
                "id": str(uuid.uuid4()),
                "source": "gift",
                "amount": total_gift_revenue,
                "date": datetime.utcnow(),
                "description": "Total gift revenue from sample data"
            },
            {
                "id": str(uuid.uuid4()),
                "source": "repost", 
                "amount": total_repost_revenue,
                "date": datetime.utcnow(),
                "description": "Total repost revenue from sample data"
            }
        ]
        
        await db.platform_revenue.insert_many(revenue_records)
        print(f"✅ Created platform revenue records")
        
        print("\n🎉 Sample data created successfully!")
        print("\n📊 Summary:")
        print(f"   • Admin user: admin@eurolove.com / admin123")
        print(f"   • {len(clients)} clients with credits")
        print(f"   • {len(escorts)} escorts with profiles")
        print(f"   • {len(gifts)} gift transactions")
        print(f"   • {len(reposts)} repost transactions")
        print(f"   • Total platform revenue: €{total_gift_revenue + total_repost_revenue:.2f}")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
    finally:
        mongo_client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_data())