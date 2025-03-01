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
    
    # Enhanced trend and seasonality parameters
    trend_factor = 1.0
    trend_increase = 0.00005  # Reduced for more stability
    
    # Add realistic weekly patterns
    weekly_pattern = {
        0: 1.2,    # Monday: Highest (people stock up)
        1: 1.1,    # Tuesday
        2: 1.0,    # Wednesday
        3: 1.0,    # Thursday
        4: 1.1,    # Friday: Slight increase before weekend
        5: 0.85,   # Saturday: Reduced
        6: 0.75    # Sunday: Lowest
    }
    
    # Simulate temperature effects (seasonal)
    def get_temperature_effect(date):
        # Simulate temperature variation through the year
        day_of_year = date.dayofyear
        temp_effect = np.sin(2 * np.pi * day_of_year / 365)
        return 1 + (temp_effect * 0.1)  # ±10% effect

    for date in dates:
        # Base demand with reduced random variation
        demand = base_demand * (1 + np.random.normal(0, 0.05))  # Reduced from 0.1 to 0.05
        
        # Apply weekly pattern
        demand *= weekly_pattern[date.dayofweek]
        
        # Apply temperature effect
        demand *= get_temperature_effect(date)
        
        # Apply seasonal factor with smooth transitions
        month = date.month
        if month > 1:
            # Smooth transition between months
            prev_factor = seasonal_factor[month-2]
            curr_factor = seasonal_factor[month-1]
            day_weight = date.day / date.days_in_month
            smooth_factor = prev_factor * (1-day_weight) + curr_factor * day_weight
            demand *= smooth_factor
        else:
            demand *= seasonal_factor[month-1]
        
        # Apply trend with reduced volatility
        trend_factor += trend_increase
        demand *= trend_factor
        
        # Gradual pandemic effects with ramp-up and cool-down
        for pandemic_start, pandemic_end, multiplier in pandemic_periods:
            if pandemic_start <= date <= pandemic_end:
                days_into_pandemic = (date - pandemic_start).days
                total_pandemic_days = (pandemic_end - pandemic_start).days
                ramp_up_days = min(14, total_pandemic_days // 4)
                cool_down_days = min(14, total_pandemic_days // 4)
                
                if days_into_pandemic <= ramp_up_days:
                    # Ramp up period
                    effect = 1 + (multiplier - 1) * (days_into_pandemic / ramp_up_days)
                elif (pandemic_end - date).days <= cool_down_days:
                    # Cool down period
                    days_to_end = (pandemic_end - date).days
                    effect = 1 + (multiplier - 1) * (days_to_end / cool_down_days)
                else:
                    # Full effect period
                    effect = multiplier
                
                demand *= min(effect, 2.0)  # Cap at 2x
        
        # More realistic special event effects with pre and post event impact
        for event_date, event_multiplier in special_events:
            days_diff = abs((date - event_date).days)
            if days_diff <= 5:  # Extended from 3 to 5 days
                # Pre-event build-up and post-event cool-down
                if days_diff == 0:
                    # Peak effect on event day
                    effect = event_multiplier
                else:
                    # Gradual effect around events
                    effect = 1 + (event_multiplier - 1) * (1 - days_diff/5)
                demand *= min(effect, 1.3)  # Cap at 1.3x
        
        # Add small random noise for day-to-day variation
        daily_noise = 1 + np.random.normal(0, 0.02)  # ±2% daily variation
        demand *= daily_noise
        
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
    # Configuration with extended historical data
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2023, 12, 31)
    
    regions = {
        'delhi': {
            'medicines': [
                (1, 'Paracetamol', 'Pain Relief', 'tablets', 100),
                (2, 'Ibuprofen', 'Anti-inflammatory', 'tablets', 80),
                (3, 'Amoxicillin', 'Antibiotic', 'tablets', 60),
                (4, 'Cetirizine', 'Antihistamine', 'tablets', 40),
                (5, 'Salbutamol', 'Bronchodilator', 'puffs', 30)
            ],
            'pandemic_periods': [
                (datetime(2020, 3, 15), datetime(2020, 7, 31), 1.8),  # Reduced from 2.0
                (datetime(2021, 4, 1), datetime(2021, 6, 30), 1.6),   # Reduced from 1.8
                (datetime(2023, 1, 1), datetime(2023, 3, 31), 1.4)    # Reduced from 1.5
            ],
            'seasonal_factors': {
                'Cetirizine': [1.2, 1.4, 1.6, 1.7, 1.5, 1.2, 1.0, 1.0, 1.2, 1.3, 1.2, 1.2],  # More pronounced
                'Paracetamol': [1.2, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 1.1, 1.2],  # Winter increase
                'default': [1.0, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.1, 1.0, 1.0]
            },
            'special_events': [
                # More granular Diwali effects
                (datetime(2020, 10, 24), 1.2),  # Pre-Diwali
                (datetime(2020, 10, 25), 1.3),  # Diwali
                (datetime(2020, 10, 26), 1.2),  # Post-Diwali
                # Add similar patterns for other years
                (datetime(2021, 11, 3), 1.2),
                (datetime(2021, 11, 4), 1.3),
                (datetime(2021, 11, 5), 1.2),
                # Add more festival dates with similar patterns
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
