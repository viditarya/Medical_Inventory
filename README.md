# MediSmart - Medicine Inventory Management System

A modern web-based inventory management system built with React, TypeScript, and Tailwind CSS. MediSmart helps healthcare facilities manage their medicine inventory efficiently with role-based access control and predictive analytics.

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

## Prerequisites

- Node.js (^18.0.0 || >=20.0.0)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd medismart-inventory-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Starts development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/
│   ├── admin/         # Admin-specific components
│   ├── manager/       # Inventory manager components
│   ├── cashier/       # Cashier components
│   └── common/        # Shared components
├── utils/             # Helper functions and utilities
├── types.ts           # TypeScript interfaces
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## User Roles

### Admin
- Full system access
- User management
- Analytics dashboard
- Inventory management

### Inventory Manager
- Inventory monitoring
- Stock predictions
- Batch management

### Cashier
- Stock updates
- Basic inventory operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Your chosen license]

## Contact

[Your contact information]