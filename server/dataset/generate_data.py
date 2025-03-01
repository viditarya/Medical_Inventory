import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import random
from pathlib import Path

# Load environment variables
load_dotenv()

def create_connection(db_name):
    return psycopg2.connect(
        dbname=db_name,
        user=os.getenv('DB_USERNAME'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )

def generate_qr_code():
    return ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=12))

def generate_batch_data(medicine_id, start_date, end_date):
    batches = []
    current_date = start_date
    
    while current_date <= end_date:
        # Generate 1-3 batches per month
        for _ in range(random.randint(1, 3)):
            quantity = random.randint(1000, 5000)
            expiry_date = current_date + timedelta(days=random.randint(180, 730))  # 6 months to 2 years
            
            batches.append({
                'medicine_id': medicine_id,
                'quantity': quantity,
                'expiry_date': expiry_date.strftime('%Y-%m-%d'),
                'qr_code': generate_qr_code()
            })
        
        current_date += timedelta(days=30)
    
    return batches

def generate_usage_history(medicine_id, start_date, end_date, base_demand, 
                         seasonal_factor, pandemic_periods, special_events):
    dates = pd.date_range(start_date, end_date)
    usage = []
    
    trend_factor = 1.0
    trend_increase = 0.0001  # Reduced trend increase
    
    for date in dates:
        # Reduced random variation
        demand = base_demand * (1 + np.random.normal(0, 0.1))
        
        month = date.month
        demand *= seasonal_factor[month-1]
        
        trend_factor += trend_increase
        demand *= trend_factor
        
        # Reduced pandemic effects
        for pandemic_start, pandemic_end, multiplier in pandemic_periods:
            if pandemic_start <= date <= pandemic_end:
                demand *= min(multiplier, 2.0)
        
        # Reduced special event effects
        for event_date, event_multiplier in special_events:
            if abs((date - event_date).days) <= 3:
                demand *= min(event_multiplier, 1.3)
        
        if date.dayofweek in [5, 6]:
            demand *= 0.9
        
        usage.append({
            'medicine_id': medicine_id,
            'date': date.strftime('%Y-%m-%d'),
            'quantity_used': max(1, int(round(demand)))
        })
    
    return usage

def export_to_csv(data, filename, directory):
    df = pd.DataFrame(data)
    path = Path(directory)
    path.mkdir(parents=True, exist_ok=True)
    df.to_csv(path / filename, index=False)
    print(f"Exported {filename} to {path}")

def clean_database(conn, cur):
    """Clean all existing data from the tables"""
    cur.execute("""
        TRUNCATE TABLE usage_history CASCADE;
        TRUNCATE TABLE batches CASCADE;
        TRUNCATE TABLE medicines CASCADE;
        TRUNCATE TABLE predictions CASCADE;
        TRUNCATE TABLE thresholds CASCADE;
        TRUNCATE TABLE pandemics CASCADE;
        -- Reset the serial sequences
        ALTER SEQUENCE medicines_medicine_id_seq RESTART WITH 1;
        ALTER SEQUENCE batches_batch_id_seq RESTART WITH 1;
        ALTER SEQUENCE usage_history_usage_id_seq RESTART WITH 1;
    """)
    conn.commit()

def main():
    # Configuration with extended historical data for better Prophet training
    start_date = datetime(2020, 1, 1)  # 3+ years of historical data
    end_date = datetime(2023, 12, 31)
    
    regions = {
        'delhi': {
            'medicines': [
                (1, 'Paracetamol', 'Pain Relief', 'tablets', 100),  # Last number is base demand
                (2, 'Ibuprofen', 'Anti-inflammatory', 'tablets', 80),
                (3, 'Amoxicillin', 'Antibiotic', 'tablets', 60),
                (4, 'Cetirizine', 'Antihistamine', 'tablets', 40),
                (5, 'Salbutamol', 'Bronchodilator', 'puffs', 30)
            ],
            'pandemic_periods': [
                (datetime(2020, 3, 15), datetime(2020, 7, 31), 2.0),
                (datetime(2021, 4, 1), datetime(2021, 6, 30), 1.8),
                (datetime(2023, 1, 1), datetime(2023, 3, 31), 1.5)
            ],
            'seasonal_factors': {
                'Cetirizine': [1.2, 1.4, 1.5, 1.5, 1.4, 1.1, 1.0, 1.0, 1.1, 1.2, 1.2, 1.2],
                'default': [1.0, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.1, 1.0, 1.0]
            },
            'special_events': [
                (datetime(2020, 10, 25), 1.3),
                (datetime(2021, 11, 4), 1.3),
                (datetime(2022, 10, 24), 1.3),
                (datetime(2023, 11, 12), 1.3)
            ]
        },
        'kolkata': {
            'medicines': [
                (1, 'Paracetamol', 'Pain Relief', 'tablets', 90),
                (2, 'Ibuprofen', 'Anti-inflammatory', 'tablets', 70),
                (3, 'Amoxicillin', 'Antibiotic', 'tablets', 50),
                (4, 'Loperamide', 'Antidiarrheal', 'tablets', 45),
                (5, 'Metronidazole', 'Antiprotozoal', 'tablets', 35)
            ],
            'pandemic_periods': [
                (datetime(2020, 5, 1), datetime(2020, 9, 30), 2.0),
                (datetime(2021, 5, 1), datetime(2021, 7, 31), 1.8),
                (datetime(2023, 6, 1), datetime(2023, 8, 31), 1.5)
            ],
            'seasonal_factors': {
                'Loperamide': [1.0, 1.0, 1.1, 1.2, 1.3, 1.5, 1.5, 1.4, 1.3, 1.2, 1.0, 1.0],
                'default': [1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.2, 1.1, 1.1, 1.0, 1.0, 1.0]
            },
            'special_events': [
                (datetime(2020, 10, 23), 1.3),
                (datetime(2021, 10, 11), 1.3),
                (datetime(2022, 10, 1), 1.3),
                (datetime(2023, 10, 20), 1.3)
            ]
        }
    }

    for region, config in regions.items():
        print(f"\nProcessing {region.upper()} region...")
        
        # Connect to database
        conn = create_connection(f'medismart_{region}')
        cur = conn.cursor()
        
        # Clean existing data
        print(f"Cleaning existing data in {region} database...")
        clean_database(conn, cur)
        
        # Process medicines
        print("Inserting new data...")
        medicines_data = [(id, name, category, unit) for id, name, category, unit, _ in config['medicines']]
        execute_values(cur, 
            "INSERT INTO medicines (medicine_id, name, category, unit) VALUES %s",
            medicines_data
        )
        
        # Generate and store data for each medicine
        for medicine_id, name, category, unit, base_demand in config['medicines']:
            print(f"Generating data for {name}...")
            
            # Generate usage history
            seasonal_factor = config['seasonal_factors'].get(name, config['seasonal_factors']['default'])
            usage_data = generate_usage_history(
                medicine_id, 
                start_date, 
                end_date,
                base_demand,
                seasonal_factor,
                config['pandemic_periods'],
                config['special_events']
            )
            
            # Generate batch data
            batch_data = generate_batch_data(medicine_id, start_date, end_date)
            
            # Insert into database
            execute_values(cur, 
                "INSERT INTO batches (medicine_id, quantity, expiry_date, qr_code) VALUES %s",
                [(b['medicine_id'], b['quantity'], b['expiry_date'], b['qr_code']) for b in batch_data]
            )
            
            execute_values(cur, 
                "INSERT INTO usage_history (medicine_id, date, quantity_used) VALUES %s",
                [(u['medicine_id'], u['date'], u['quantity_used']) for u in usage_data]
            )
            
            # Export to CSV
            export_to_csv(
                usage_data,
                f"{name.lower()}_usage.csv",
                f"data/{region}/raw"
            )
            
            # Create Prophet-ready dataset
            prophet_data = pd.DataFrame(usage_data)
            prophet_data = prophet_data.rename(columns={'date': 'ds', 'quantity_used': 'y'})
            export_to_csv(
                prophet_data,
                f"{name.lower()}_prophet.csv",
                f"data/{region}/processed"
            )
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"Completed processing {region} region!")

if __name__ == "__main__":
    main()
