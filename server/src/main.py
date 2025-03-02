from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth
from .database import engine, get_db
from datetime import timedelta
from typing import List
import os
from dotenv import load_dotenv
from .utils.scheduler import setup_model_retraining_schedule

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediSmart API",
    description="API for MediSmart Medicine Inventory Management System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    setup_model_retraining_schedule()

# Auth endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not auth.verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Medicine endpoints
@app.get("/medicines", response_model=List[schemas.Medicine])
async def get_medicines(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    medicines = db.query(models.Medicine).all()
    return medicines

@app.post("/medicines", response_model=schemas.Medicine)
async def create_medicine(
    medicine: schemas.MedicineCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.MANAGER]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_medicine = models.Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

# Batch endpoints
@app.get("/batches", response_model=List[schemas.Batch])
async def get_batches(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    batches = db.query(models.Batch).all()
    return batches

@app.post("/batches", response_model=schemas.Batch)
async def create_batch(
    batch: schemas.BatchCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.MANAGER]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_batch = models.Batch(**batch.dict())
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch
