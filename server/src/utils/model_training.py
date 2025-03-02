import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
import joblib
from pathlib import Path
import logging
from datetime import datetime
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, data_dir: Path, model_dir: Path):
        self.data_dir = data_dir
        self.model_dir = model_dir
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
    def load_data(self, region: str, medicine: str) -> pd.DataFrame:
        """Load and prepare data for Prophet"""
        file_path = self.data_dir / region / "processed" / f"{medicine.lower()}_prophet.csv"
        df = pd.read_csv(file_path)
        df['ds'] = pd.to_datetime(df['ds'])
        return df
    
    def tune_hyperparameters(self, df: pd.DataFrame) -> dict:
        """Tune Prophet hyperparameters using grid search"""
        param_grid = {
            'changepoint_prior_scale': [0.001, 0.01, 0.05, 0.1, 0.5],
            'seasonality_prior_scale': [0.01, 0.1, 1.0, 10.0],
            'seasonality_mode': ['multiplicative', 'additive']
        }
        
        best_params = {}
        best_rmse = float('inf')
        
        for cp in param_grid['changepoint_prior_scale']:
            for sp in param_grid['seasonality_prior_scale']:
                for sm in param_grid['seasonality_mode']:
                    params = {
                        'changepoint_prior_scale': cp,
                        'seasonality_prior_scale': sp,
                        'seasonality_mode': sm,
                        'yearly_seasonality': True,
                        'weekly_seasonality': True,
                        'daily_seasonality': False
                    }
                    
                    try:
                        model = Prophet(**params)
                        model.fit(df)
                        
                        # Cross validation
                        df_cv = cross_validation(model, initial='365 days', 
                                               period='90 days', horizon='90 days')
                        df_p = performance_metrics(df_cv)
                        rmse = df_p['rmse'].mean()
                        
                        if rmse < best_rmse:
                            best_rmse = rmse
                            best_params = params
                            
                        logger.info(f"Parameters: {params}")
                        logger.info(f"RMSE: {rmse:.2f}")
                        
                    except Exception as e:
                        logger.error(f"Error during hyperparameter tuning: {str(e)}")
                        continue
        
        return best_params
    
    def train_model(self, df: pd.DataFrame, params: dict) -> Prophet:
        """Train Prophet model with given parameters"""
        model = Prophet(**params)
        model.fit(df)
        return model
    
    def save_model(self, model: Prophet, region: str, medicine: str):
        """Save trained model and metadata"""
        model_path = self.model_dir / f"{region}_{medicine.lower()}_model.pkl"
        metadata_path = self.model_dir / f"{region}_{medicine.lower()}_metadata.json"
        
        # Save model
        joblib.dump(model, model_path)
        
        # Save metadata
        metadata = {
            'trained_at': datetime.now().isoformat(),
            'parameters': model.params
        }
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f)
            
        logger.info(f"Model saved: {model_path}")

def train_models(medicine_id: int, region: str):
    """Main function to train models for a specific medicine and region"""
    try:
        trainer = ModelTrainer(
            data_dir=Path("dataset/data"),
            model_dir=Path("models")
        )
        
        # Get medicine name from database
        # This should be implemented based on your database structure
        medicine_name = get_medicine_name(medicine_id)
        
        # Load and prepare data
        df = trainer.load_data(region, medicine_name)
        
        # Tune hyperparameters
        best_params = trainer.tune_hyperparameters(df)
        
        # Train final model
        model = trainer.train_model(df, best_params)
        
        # Save model and metadata
        trainer.save_model(model, region, medicine_name)
        
        logger.info(f"Successfully trained model for {medicine_name} in {region}")
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise

if __name__ == "__main__":
    # This can be used for manual training
    import sys
    if len(sys.argv) != 3:
        print("Usage: python model_training.py <medicine_id> <region>")
        sys.exit(1)
        
    medicine_id = int(sys.argv[1])
    region = sys.argv[2]
    train_models(medicine_id, region)