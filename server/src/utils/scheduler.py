from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from .model_training import train_models
from ..database import SessionLocal
from ..models import Medicine

def setup_model_retraining_schedule():
    scheduler = BackgroundScheduler()
    
    def retrain_all_models():
        db = SessionLocal()
        try:
            medicines = db.query(Medicine).all()
            regions = ['delhi', 'kolkata']
            
            for medicine in medicines:
                for region in regions:
                    train_models(medicine.id, region)
                    
        finally:
            db.close()
    
    # Schedule retraining every Sunday at 2 AM
    scheduler.add_job(
        retrain_all_models,
        trigger=CronTrigger(day_of_week='sun', hour=2),
        id='model_retraining',
        name='Weekly model retraining'
    )
    
    scheduler.start()