from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from datetime import datetime, timedelta

from ..database import get_db
from ..models import Medicine, Prediction
from ..schemas import PredictionResponse
from ..utils.prophet_helper import load_prophet_model, generate_prediction

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("/{medicine_id}", response_model=List[PredictionResponse])
async def get_medicine_predictions(
    medicine_id: int,
    region: str,
    db: Session = Depends(get_db)
):
    """Get predictions for a specific medicine in a region"""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    try:
        # Load the saved Prophet model
        model = load_prophet_model(region, medicine.name.lower())
        
        # Generate predictions for next 90 days
        predictions = generate_prediction(model, days=90)
        
        # Format response
        response = []
        for date, value in predictions.items():
            response.append({
                "medicine_id": medicine_id,
                "region": region,
                "date": date,
                "predicted_demand": round(value),
                "confidence_interval": 0.95
            })
        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating predictions: {str(e)}"
        )