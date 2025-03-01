import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart, 
  TrendingUp, 
  ShoppingCart, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  role: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">MediSmart</h1>
        <p className="text-sm text-gray-600">Medicine Inventory System</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {/* Admin Links */}
          {role === 'admin' && (
            <>
              <Link to="/dashboard" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/dashboard')}`}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link to="/inventory" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/inventory')}`}>
                <Package className="mr-3 h-5 w-5" />
                Inventory Management
              </Link>
              <Link to="/users" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/users')}`}>
                <Users className="mr-3 h-5 w-5" />
                User Management
              </Link>
              <Link to="/analytics" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/analytics')}`}>
                <BarChart className="mr-3 h-5 w-5" />
                Analytics
              </Link>
            </>
          )}

          {/* Inventory Manager Links */}
          {role === 'manager' && (
            <>
              <Link to="/dashboard" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/dashboard')}`}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link to="/inventory" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/inventory')}`}>
                <Package className="mr-3 h-5 w-5" />
                Inventory Management
              </Link>
              <Link to="/predictions" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/predictions')}`}>
                <TrendingUp className="mr-3 h-5 w-5" />
                Predictive Analysis
              </Link>
            </>
          )}

          {/* Cashier Links */}
          {role === 'cashier' && (
            <Link to="/stock" className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/stock')}`}>
              <ShoppingCart className="mr-3 h-5 w-5" />
              Stock Update
            </Link>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;