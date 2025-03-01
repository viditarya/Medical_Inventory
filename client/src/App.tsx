import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import InventoryManagement from './components/admin/InventoryManagement';
import UserManagement from './components/admin/UserManagement';
import Analytics from './components/admin/Analytics';

// Inventory Manager Components
import ManagerDashboard from './components/manager/ManagerDashboard';
import ManagerInventory from './components/manager/ManagerInventory';
import PredictiveAnalysis from './components/manager/PredictiveAnalysis';

// Cashier Components
import StockUpdate from './components/cashier/StockUpdate';

function App() {
  // In a real app, this would come from authentication
  const [role, setRole] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = (userRole: string) => {
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setRole("");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar role={role} onLogout={handleLogout} />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            {/* Admin Routes */}
            {role === "admin" && (
              <>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}

            {/* Inventory Manager Routes */}
            {role === "manager" && (
              <>
                <Route path="/dashboard" element={<ManagerDashboard />} />
                <Route path="/inventory" element={<ManagerInventory />} />
                <Route path="/predictions" element={<PredictiveAnalysis />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}

            {/* Cashier Routes */}
            {role === "cashier" && (
              <>
                <Route path="/stock" element={<StockUpdate />} />
                <Route path="*" element={<Navigate to="/stock" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;