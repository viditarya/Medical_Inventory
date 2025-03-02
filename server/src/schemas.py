from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .models import UserRole

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    username: str
    email: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class MedicineBase(BaseModel):
    name: str
    category: str
    unit: str

class MedicineCreate(MedicineBase):
    pass

class Medicine(MedicineBase):
    id: int

    class Config:
        from_attributes = True

class BatchBase(BaseModel):
    medicine_id: int
    quantity: int
    expiry_date: datetime
    qr_code: str

class BatchCreate(BatchBase):
    pass

class Batch(BatchBase):
    id: int

    class Config:
        from_attributes = True

class PredictionBase(BaseModel):
    medicine_id: int
    region: str
    date: datetime
    predicted_demand: float
    confidence_interval: float

class PredictionCreate(PredictionBase):
    pass

class PredictionResponse(PredictionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
