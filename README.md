# MediSmart - Medicine Inventory Management System

A modern web-based inventory management system with predictive analytics and regional inventory management.

## Project Structure

```
medismart/
├── client/          # React Frontend
└── server/          # FastAPI Backend
    ├── src/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── auth.py
    │   ├── models.py
    │   ├── schemas.py
    │   └── database.py
    ├── alembic/      # Database migrations
    ├── tests/        # Test files
    ├── requirements.txt
    └── .env
```

## Prerequisites

- Node.js (^18.0.0 || >=20.0.0)
- Python 3.8+
- PostgreSQL 14+

## Quick Start

### Database Setup

1. Install PostgreSQL and ensure it's running
2. Create a new database:
```sql
CREATE DATABASE medismart;
```

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medismart

# JWT Configuration
SECRET_KEY=your-generated-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

5. Run the server:
```bash
python -m uvicorn src.main:app --reload
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Development

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Admin Interface: http://localhost:8000/admin

## API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/register - User registration

### Users
- GET /api/users/me - Get current user
- PUT /api/users/me - Update current user
- GET /api/users/ - List all users (Admin only)

### Medicines
- GET /api/medicines/ - List all medicines
- POST /api/medicines/ - Create new medicine
- GET /api/medicines/{id} - Get medicine details
- PUT /api/medicines/{id} - Update medicine
- DELETE /api/medicines/{id} - Delete medicine

### Batches
- GET /api/batches/ - List all batches
- POST /api/batches/ - Create new batch
- GET /api/batches/{id} - Get batch details
- PUT /api/batches/{id} - Update batch
- DELETE /api/batches/{id} - Delete batch

## Features

- 🔐 Role-based access control (Admin, Inventory Manager, Cashier)
- 📊 Real-time inventory tracking
- 📈 Predictive analysis for inventory demands
- 🏥 Medicine batch management with expiry tracking
- 📱 Responsive design with modern UI
- �� QR code support for batch tracking

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Recharts (for analytics)
- Lucide React (for icons)
- Axios (for API calls)

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Alembic (migrations)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

