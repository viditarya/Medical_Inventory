import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import Chatbot from './components/Chatbot';
import { MedicineProvider } from './context/MedicineContext';

function App() {
  return (
    <MedicineProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/analytics" element={<PredictiveAnalytics />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </MedicineProvider>
  );
}

export default App;