from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
from datetime import datetime, timedelta
import joblib
from pathlib import Path

from ..database import get_db
from ..models import Medicine, Prediction
from ..schemas import PredictionResponse, PredictionCreate
from ..utils.prophet_helper import load_prophet_model, generate_prediction

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

MODEL_DIR = Path("models")
FORECAST_DIR = Path("forecasts")

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
    
    # Load predictions from database or generate new ones
    predictions = db.query(Prediction).filter(
        Prediction.medicine_id == medicine_id,
        Prediction.region == region,
        Prediction.date >= datetime.now()
    ).all()
    
    if not predictions:
        # Generate new predictions if none exist
        model_path = MODEL_DIR / f"{region}_{medicine.name.lower()}_model.pkl"
        if not model_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"No prediction model found for {medicine.name} in {region}"
            )
        
        model = joblib.load(model_path)
        future_dates = pd.date_range(
            start=datetime.now(),
            periods=90,
            freq='D'
        )
        
        forecast = model.predict(pd.DataFrame({'ds': future_dates}))
        
        # Store predictions in database
        new_predictions = []
        for _, row in forecast.iterrows():
            pred = Prediction(
                medicine_id=medicine_id,
                region=region,
                date=row['ds'],
                predicted_demand=row['yhat'],
                confidence_interval=row['yhat_upper'] - row['yhat_lower']
            )
            db.add(pred)
            new_predictions.append(pred)
        
        db.commit()
        predictions = new_predictions
    
    return predictions

@router.post("/retrain", status_code=201)
async def trigger_model_retraining(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Trigger retraining of prediction models"""
    background_tasks.add_task(retrain_models, db)
    return {"message": "Model retraining scheduled"}

async def retrain_models(db: Session):
    """Background task to retrain all prediction models"""
    from ..utils.model_training import train_models
    
    try:
        # Get all unique medicine-region combinations
        medicines = db.query(Medicine).all()
        regions = ['delhi', 'kolkata']  # Add more regions as needed
        
        for medicine in medicines:
            for region in regions:
                # Train model for each medicine-region combination
                train_models(medicine.id, region)
                
        # Update last_trained timestamp in database
        db.execute(
            "UPDATE model_metadata SET last_trained = :now",
            {"now": datetime.now()}
        )
        db.commit()
        
    except Exception as e:
        # Log error and notify administrators
        print(f"Error during model retraining: {str(e)}")
        # Add proper error logging here
