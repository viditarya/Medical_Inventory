# MediSmart - Regional Medicine Inventory Management System

A sophisticated web-based inventory management system designed for multi-regional pharmaceutical inventory tracking with predictive analytics capabilities.

## Features

- 🏥 Multi-Regional Inventory Management (Delhi & Kolkata)
- 📊 Real-time Stock Tracking & Analytics
- 🔮 ML-powered Demand Prediction
- 🔄 Automated Reorder Management
- 📱 Responsive Web Interface
- 🔐 Role-based Access Control
- 📋 Batch Management with QR Tracking
- 📈 Pandemic Impact Analysis
- ⚡ Real-time Stock Alerts

## Tech Stack

### Backend
- FastAPI (Python 3.8+)
- SQLAlchemy + Alembic
- PostgreSQL
- Prophet (ML predictions)
- JWT Authentication
- Pandas (Data Processing)

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Vite
- Recharts
- Axios

## Prerequisites

- Python 3.8+
- Node.js (^18.0.0 || >=20.0.0)
- PostgreSQL 14+
- Git

## Project Structure
```
medismart/
├── client/                  # React Frontend
│   ├── src/                # Source files
│   ├── public/             # Static files
│   └── vite.config.ts      # Vite configuration
└── server/                 # FastAPI Backend
    ├── src/               # Source code
    │   ├── routes/       # API endpoints
    │   ├── models.py     # Database models
    │   ├── schemas.py    # Pydantic schemas
    │   └── utils/        # Utility functions
    ├── analysis/         # ML models & notebooks
    ├── dataset/          # Data generation scripts
    ├── alembic/          # Database migrations
    └── tests/            # Test suite
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/medismart.git
cd medismart
```

### 2. Database Setup
```bash
# Navigate to dataset directory
cd server/dataset

# Windows
setup.bat

# Linux/MacOS
chmod +x setup.sh
./setup.sh
```

### 3. Backend Setup
```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/MacOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Run migrations
alembic upgrade head

# Start the server
python -m uvicorn src.main:app --reload
```

### 4. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medismart

# Regional Databases
DELHI_DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medismart_delhi
KOLKATA_DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medismart_kolkata

# JWT Configuration
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Running Tests
```bash
cd server
pytest
```

### Database Migrations
```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

### ML Model Training
```bash
cd server/analysis/notebooks
jupyter notebook
```

## Deployment

### Backend
```bash
# Production server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main:app
```

### Frontend
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
