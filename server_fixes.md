# EUROLOVE Backend API Fixes

Based on the testing results, the following issues need to be fixed in the backend server:

## 1. Health Check Endpoint (404 Not Found)

The health check endpoint is defined in the code but returns 404. This is likely because the endpoint is defined on the API router but the URL is not being properly routed.

**Fix:**
- Move the health check endpoint from the API router to the main app, or
- Ensure the API router prefix is correctly applied

## 2. Gift History and Repost History Endpoints (500 Internal Server Error)

Both endpoints are returning 500 Internal Server Error due to an issue with MongoDB ObjectId serialization. The error in the logs shows:
```
ValueError: [TypeError("'ObjectId' object is not iterable"), TypeError('vars() argument must have __dict__ attribute')]
```

**Fix:**
- Add a custom JSON encoder to handle MongoDB ObjectId objects
- Convert ObjectId to string before returning in the response

## 3. Add Credits Endpoint (404 Not Found)

The add-credits endpoint is defined in the code but returns 404. This could be due to:
- Incorrect URL path
- Issue with query parameter handling

**Fix:**
- Ensure the endpoint is correctly registered with the API router
- Check the URL path and parameter handling

## Recommended Changes to server.py

1. Add a custom JSON encoder for MongoDB ObjectId:
```python
from bson import ObjectId
import json

class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Configure FastAPI to use the custom encoder
app = FastAPI(json_encoder=MongoJSONEncoder)
```

2. Fix the gift history and repost history endpoints:
```python
@api_router.get("/gift-history")
async def get_gift_history(current_user: User = Depends(get_current_user)):
    if current_user.user_type == "client":
        # Get gifts sent by client
        gifts = await db.gifts.find({"sender_id": current_user.id}).sort("transaction_date", -1).to_list(100)
        
        # Convert _id to string and enrich with recipient info
        for gift in gifts:
            if "_id" in gift:
                gift["_id"] = str(gift["_id"])
            recipient = await db.users.find_one({"id": gift["recipient_id"]}, {"username": 1, "name": 1})
            gift["recipient_name"] = recipient.get("name") or recipient.get("username")
            
    else:  # escort
        # Get gifts received by escort
        gifts = await db.gifts.find({"recipient_id": current_user.id}).sort("transaction_date", -1).to_list(100)
        
        # Convert _id to string and enrich with sender info
        for gift in gifts:
            if "_id" in gift:
                gift["_id"] = str(gift["_id"])
            sender = await db.users.find_one({"id": gift["sender_id"]}, {"username": 1})
            gift["sender_name"] = sender.get("username")
    
    return gifts

@api_router.get("/repost-history")
async def get_repost_history(current_user: User = Depends(get_current_user)):
    if current_user.user_type != "escort":
        raise HTTPException(status_code=403, detail="Only escorts can view repost history")
    
    reposts = await db.reposts.find({"escort_id": current_user.id}).sort("repost_date", -1).to_list(100)
    
    # Convert _id to string
    for repost in reposts:
        if "_id" in repost:
            repost["_id"] = str(repost["_id"])
    
    return reposts
```

3. Fix the add-credits endpoint:
```python
# Change from:
@api_router.post("/add-credits")
async def add_credits(amount: float, current_user: User = Depends(get_current_user)):

# To:
@api_router.post("/add-credits")
async def add_credits(amount: float = Query(...), current_user: User = Depends(get_current_user)):
```

4. Move the health check endpoint to the main app:
```python
# Remove from api_router:
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Add to main app:
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

These changes should resolve the issues identified during testing.
