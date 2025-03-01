from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/regions")
def get_regions():
    return ["delhi", "kolkata"]

@router.get("/medicines")
def get_medicines(region: str, db: Session = Depends(get_db)):
    try:
        medicines = db.query(models.medicines).all()
        return medicines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/batches")
def get_batches(region: str, db: Session = Depends(get_db)):
    try:
        batches = db.query(models.batches).all()
        return batches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
