from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class IncomeEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    date: str  # YYYY-MM-DD format
    amount: float
    source: str
    month: int  # 1-12
    year: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class IncomeEntryCreate(BaseModel):
    date: str
    amount: float
    source: str

class MonthlyTarget(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    monthly_target: float
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MonthlyTargetCreate(BaseModel):
    monthly_target: float

class MonthlySummary(BaseModel):
    month: int
    year: int
    month_name: str
    total: float
    target: float
    remaining: float
    entries_count: int

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Auth routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_input: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_input.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(email=user_input.email)
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['password_hash'] = get_password_hash(user_input.password)
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_input: UserLogin):
    # Find user
    user_dict = await db.users.find_one({"email": user_input.email}, {"_id": 0})
    if not user_dict:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(user_input.password, user_dict['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create user object
    user = User(
        id=user_dict['id'],
        email=user_dict['email'],
        created_at=datetime.fromisoformat(user_dict['created_at']) if isinstance(user_dict['created_at'], str) else user_dict['created_at']
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

# Income routes
@api_router.post("/income", response_model=IncomeEntry)
async def create_income(income_input: IncomeEntryCreate, current_user: User = Depends(get_current_user)):
    # Parse date to get month and year
    date_parts = income_input.date.split('-')
    year = int(date_parts[0])
    month = int(date_parts[1])
    
    # Create income entry
    entry = IncomeEntry(
        user_id=current_user.id,
        date=income_input.date,
        amount=income_input.amount,
        source=income_input.source,
        month=month,
        year=year
    )
    
    entry_dict = entry.model_dump()
    entry_dict['created_at'] = entry_dict['created_at'].isoformat()
    
    await db.income_entries.insert_one(entry_dict)
    
    return entry

@api_router.get("/income", response_model=List[IncomeEntry])
async def get_income_entries(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    query = {"user_id": current_user.id}
    if month:
        query["month"] = month
    if year:
        query["year"] = year
    
    entries = await db.income_entries.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for entry in entries:
        if isinstance(entry['created_at'], str):
            entry['created_at'] = datetime.fromisoformat(entry['created_at'])
    
    return entries

@api_router.delete("/income/{entry_id}")
async def delete_income_entry(entry_id: str, current_user: User = Depends(get_current_user)):
    result = await db.income_entries.delete_one({"id": entry_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry deleted successfully"}

@api_router.get("/income/monthly-summary")
async def get_monthly_summary(
    month: int,
    year: int,
    current_user: User = Depends(get_current_user)
):
    # Get entries for the month
    entries = await db.income_entries.find(
        {"user_id": current_user.id, "month": month, "year": year},
        {"_id": 0}
    ).to_list(1000)
    
    # Calculate total
    total = sum(entry['amount'] for entry in entries)
    
    # Get target
    target_doc = await db.monthly_targets.find_one({"user_id": current_user.id}, {"_id": 0})
    target = target_doc['monthly_target'] if target_doc else 0
    
    month_names = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    
    return {
        "month": month,
        "year": year,
        "month_name": month_names[month],
        "total": total,
        "target": target,
        "remaining": target - total,
        "entries_count": len(entries)
    }

@api_router.get("/income/ytd")
async def get_ytd_total(current_user: User = Depends(get_current_user)):
    # Get current year
    current_year = datetime.now(timezone.utc).year
    
    # Get all entries for current year
    entries = await db.income_entries.find(
        {"user_id": current_user.id, "year": current_year},
        {"_id": 0}
    ).to_list(10000)
    
    # Calculate total
    ytd_total = sum(entry['amount'] for entry in entries)
    
    return {"ytd_total": ytd_total, "year": current_year}

@api_router.get("/income/yearly", response_model=List[MonthlySummary])
async def get_yearly_summary(current_user: User = Depends(get_current_user)):
    # Get last 12 months
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year
    
    summaries = []
    month_names = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    
    # Get target
    target_doc = await db.monthly_targets.find_one({"user_id": current_user.id}, {"_id": 0})
    target = target_doc['monthly_target'] if target_doc else 0
    
    for i in range(12):
        # Calculate month and year for each of the last 12 months
        month = current_month - i
        year = current_year
        
        if month <= 0:
            month += 12
            year -= 1
        
        # Get entries for this month
        entries = await db.income_entries.find(
            {"user_id": current_user.id, "month": month, "year": year},
            {"_id": 0}
        ).to_list(1000)
        
        total = sum(entry['amount'] for entry in entries)
        
        summaries.append(MonthlySummary(
            month=month,
            year=year,
            month_name=month_names[month],
            total=total,
            target=target,
            remaining=target - total,
            entries_count=len(entries)
        ))
    
    return summaries

# Target routes
@api_router.post("/target", response_model=MonthlyTarget)
async def set_monthly_target(target_input: MonthlyTargetCreate, current_user: User = Depends(get_current_user)):
    # Check if target exists
    existing_target = await db.monthly_targets.find_one({"user_id": current_user.id})
    
    if existing_target:
        # Update existing target
        await db.monthly_targets.update_one(
            {"user_id": current_user.id},
            {"$set": {
                "monthly_target": target_input.monthly_target,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        existing_target['monthly_target'] = target_input.monthly_target
        existing_target['updated_at'] = datetime.now(timezone.utc)
        return MonthlyTarget(**existing_target)
    else:
        # Create new target
        target = MonthlyTarget(
            user_id=current_user.id,
            monthly_target=target_input.monthly_target
        )
        
        target_dict = target.model_dump()
        target_dict['updated_at'] = target_dict['updated_at'].isoformat()
        
        await db.monthly_targets.insert_one(target_dict)
        
        return target

@api_router.get("/target", response_model=MonthlyTarget)
async def get_monthly_target(current_user: User = Depends(get_current_user)):
    target = await db.monthly_targets.find_one({"user_id": current_user.id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Target not set")
    
    if isinstance(target['updated_at'], str):
        target['updated_at'] = datetime.fromisoformat(target['updated_at'])
    
    return MonthlyTarget(**target)

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