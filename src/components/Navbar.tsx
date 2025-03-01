import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Package, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Stethoscope className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Medin</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/')}`}
              >
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Dashboard
                </div>
              </Link>
              
              <Link 
                to="/inventory" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/inventory')}`}
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Inventory
                </div>
              </Link>
              
              <Link 
                to="/analytics" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/analytics')}`}
              >
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Analytics
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="flex justify-around px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/')}`}
          >
            <div className="flex flex-col items-center">
              <Stethoscope className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          
          <Link 
            to="/inventory" 
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/inventory')}`}
          >
            <div className="flex flex-col items-center">
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </div>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/analytics')}`}
          >
            <div className="flex flex-col items-center">
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;