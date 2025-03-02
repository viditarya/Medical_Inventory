from sqlalchemy import (
    Column, 
    Integer, 
    String, 
    Float, 
    DateTime, 
    ForeignKey, 
    Enum as SQLEnum,
    Boolean
)
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    CASHIER = "cashier"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(SQLEnum(UserRole))
    is_active = Column(Boolean, default=True)

class Medicine(Base):
    __tablename__ = "medicines"
    
    medicine_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    unit = Column(String(20), nullable=False)
    batches = relationship("Batch", back_populates="medicine")
    predictions = relationship("Prediction", back_populates="medicine")

class Batch(Base):
    __tablename__ = "batches"
    
    batch_id = Column(Integer, primary_key=True)
    medicine_id = Column(Integer, ForeignKey("medicines.medicine_id"))
    quantity = Column(Integer, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    qr_code = Column(String(20), unique=True, nullable=False)
    medicine = relationship("Medicine", back_populates="batches")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True)
    medicine_id = Column(Integer, ForeignKey("medicines.medicine_id"))
    region = Column(String)
    date = Column(DateTime)
    predicted_demand = Column(Float)
    confidence_interval = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    medicine = relationship("Medicine", back_populates="predictions")
