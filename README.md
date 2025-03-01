# MediSmart - Medicine Inventory Management System

A modern web-based inventory management system with predictive analytics and regional inventory management.

## Project Structure

```
medismart/
├── client/          # React Frontend
└── server/          # FastAPI Backend
```

## Prerequisites

- Node.js (^18.0.0 || >=20.0.0)
- Python 3.8+
- PostgreSQL

## Quick Start

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.app:app --reload
```

### Database

Make sure PostgreSQL is running and create a database named 'medismart':

```sql
CREATE DATABASE medismart;
```

## Environment Setup

1. Copy `.env.example` to `.env` in both client and server directories
2. Update the environment variables with your configuration

## Development

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:8000
- API docs available at: http://localhost:8000/docs

## Features

- 🔐 Role-based access control (Admin, Inventory Manager, Cashier)
- 📊 Real-time inventory tracking
- 📈 Predictive analysis for inventory demands
- 🏥 Medicine batch management with expiry tracking
- 📱 Responsive design with modern UI
- 🔍 QR code support for batch tracking

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Recharts (for analytics)
- Lucide React (for icons)
- Axios (for API calls)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

