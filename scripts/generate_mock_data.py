from datetime import datetime, timedelta
import random
import json
import names  # pip install names
import sqlite3

# Constants for data generation
MEDICINE_CATEGORIES = [
    'Pain Relief', 'Antibiotic', 'Anti-inflammatory', 'Antacid', 'Antidiabetic',
    'Antihistamine', 'Antiviral', 'Cardiovascular', 'Respiratory', 'Supplements'
]

UNITS = ['Tablet', 'Capsule', 'Bottle', 'Ampule', 'Vial']

# Generate consistent data across a time period
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2024, 12, 31)

def generate_medicines(num_medicines=50):
    medicines = []
    for i in range(1, num_medicines + 1):
        medicines.append({
            'medicine_id': i,
            'name': f"{names.get_first_name()} {random.choice(['Plus', 'Max', 'Fort', 'XR', 'SR'])}",
            'category': random.choice(MEDICINE_CATEGORIES),
            'unit': random.choice(UNITS)
        })
    return medicines

def generate_batches(medicines, num_batches=200):
    batches = []
    batch_id = 1
    
    for medicine in medicines:
        # Generate 2-6 batches per medicine
        num_medicine_batches = random.randint(2, 6)
        for _ in range(num_medicine_batches):
            expiry_date = datetime.now() + timedelta(days=random.randint(30, 1095))  # 1 month to 3 years
            batches.append({
                'batch_id': batch_id,
                'medicine_id': medicine['medicine_id'],
                'quantity': random.randint(50, 500),
                'expiry_date': expiry_date.strftime('%Y-%m-%d'),
                'qr_code': f"QR-{medicine['medicine_id']:04d}-{batch_id}"
            })
            batch_id += 1
    return batches

def generate_usage_history(medicines, batches, num_records=1000):
    usage_history = []
    usage_id = 1
    current_date = START_DATE
    
    while current_date <= END_DATE:
        # Generate 1-5 usage records per day
        for _ in range(random.randint(1, 5)):
            medicine = random.choice(medicines)
            valid_batches = [b for b in batches if b['medicine_id'] == medicine['medicine_id']]
            
            if valid_batches:
                batch = random.choice(valid_batches)
                usage_history.append({
                    'usage_id': usage_id,
                    'medicine_id': medicine['medicine_id'],
                    'batch_id': batch['batch_id'],
                    'date': current_date.strftime('%Y-%m-%d'),
                    'quantity_used': random.randint(1, 50)
                })
                usage_id += 1
        
        current_date += timedelta(days=1)
    
    return usage_history

def generate_predictions(medicines):
    predictions = []
    prediction_id = 1
    quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4']
    
    for medicine in medicines:
        base_demand = random.randint(200, 1000)
        for quarter in quarters:
            # Add some randomness to predictions
            variation = random.uniform(0.8, 1.2)
            predictions.append({
                'prediction_id': prediction_id,
                'medicine_id': medicine['medicine_id'],
                'predicted_demand': int(base_demand * variation),
                'period': quarter,
                'created_at': '2024-01-01'
            })
            prediction_id += 1
    
    return predictions

def generate_users():
    users = [
        {'user_id': 1, 'username': 'admin', 'password_hash': 'hashed_admin', 'role': 'admin'},
        {'user_id': 2, 'username': 'manager', 'password_hash': 'hashed_manager', 'role': 'manager'},
        {'user_id': 3, 'username': 'cashier', 'password_hash': 'hashed_cashier', 'role': 'cashier'}
    ]
    
    # Generate additional random users
    for i in range(4, 10):
        role = random.choice(['manager', 'cashier'])
        name = names.get_full_name().lower().replace(' ', '.')
        users.append({
            'user_id': i,
            'username': name,
            'password_hash': f'hashed_{name}',
            'role': role
        })
    
    return users

def generate_thresholds(medicines):
    return [{
        'threshold_id': i,
        'medicine_id': medicine['medicine_id'],
        'reorder_level': random.randint(50, 200)
    } for i, medicine in enumerate(medicines, 1)]

def save_to_json(data):
    for key, value in data.items():
        with open(f'mock_data_{key}.json', 'w') as f:
            json.dump(value, f, indent=2)

def save_to_sqlite(data):
    conn = sqlite3.connect('mock_database.db')
    c = conn.cursor()
    
    # Create tables
    c.execute('''CREATE TABLE IF NOT EXISTS medicines
                 (medicine_id INTEGER PRIMARY KEY, name TEXT, category TEXT, unit TEXT)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS batches
                 (batch_id INTEGER PRIMARY KEY, medicine_id INTEGER, quantity INTEGER, 
                  expiry_date TEXT, qr_code TEXT)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS usage_history
                 (usage_id INTEGER PRIMARY KEY, medicine_id INTEGER, batch_id INTEGER,
                  date TEXT, quantity_used INTEGER)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS predictions
                 (prediction_id INTEGER PRIMARY KEY, medicine_id INTEGER,
                  predicted_demand INTEGER, period TEXT, created_at TEXT)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (user_id INTEGER PRIMARY KEY, username TEXT, password_hash TEXT, role TEXT)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS thresholds
                 (threshold_id INTEGER PRIMARY KEY, medicine_id INTEGER, reorder_level INTEGER)''')
    
    # Insert data
    for medicine in data['medicines']:
        c.execute('INSERT INTO medicines VALUES (?,?,?,?)',
                 (medicine['medicine_id'], medicine['name'], medicine['category'], medicine['unit']))
    
    for batch in data['batches']:
        c.execute('INSERT INTO batches VALUES (?,?,?,?,?)',
                 (batch['batch_id'], batch['medicine_id'], batch['quantity'],
                  batch['expiry_date'], batch['qr_code']))
    
    for usage in data['usage_history']:
        c.execute('INSERT INTO usage_history VALUES (?,?,?,?,?)',
                 (usage['usage_id'], usage['medicine_id'], usage['batch_id'],
                  usage['date'], usage['quantity_used']))
    
    for prediction in data['predictions']:
        c.execute('INSERT INTO predictions VALUES (?,?,?,?,?)',
                 (prediction['prediction_id'], prediction['medicine_id'],
                  prediction['predicted_demand'], prediction['period'], prediction['created_at']))
    
    for user in data['users']:
        c.execute('INSERT INTO users VALUES (?,?,?,?)',
                 (user['user_id'], user['username'], user['password_hash'], user['role']))
    
    for threshold in data['thresholds']:
        c.execute('INSERT INTO thresholds VALUES (?,?,?)',
                 (threshold['threshold_id'], threshold['medicine_id'], threshold['reorder_level']))
    
    conn.commit()
    conn.close()

def main():
    # Generate all mock data
    medicines = generate_medicines()
    batches = generate_batches(medicines)
    usage_history = generate_usage_history(medicines, batches)
    predictions = generate_predictions(medicines)
    users = generate_users()
    thresholds = generate_thresholds(medicines)
    
    # Compile all data
    mock_data = {
        'medicines': medicines,
        'batches': batches,
        'usage_history': usage_history,
        'predictions': predictions,
        'users': users,
        'thresholds': thresholds
    }
    
    # Save to JSON files
    save_to_json(mock_data)
    
    # Save to SQLite database
    save_to_sqlite(mock_data)
    
    print("Mock data generated successfully!")
    print("Files generated:")
    print("- mock_database.db (SQLite database)")
    print("- mock_data_medicines.json")
    print("- mock_data_batches.json")
    print("- mock_data_usage_history.json")
    print("- mock_data_predictions.json")
    print("- mock_data_users.json")
    print("- mock_data_thresholds.json")

if __name__ == "__main__":
    main()
