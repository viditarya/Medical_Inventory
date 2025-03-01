import React, { useState, useEffect } from 'react';
import { useMedicineContext } from '../context/MedicineContext';
import InventoryTable from '../components/InventoryTable';
import AddMedicineForm from '../components/AddMedicineForm';

const InventoryManagement: React.FC = () => {
  const { medicines, loading, error, fetchMedicines, searchMedicines } = useMedicineContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);
  
  useEffect(() => {
    fetchMedicines();
  }, []);
  
  useEffect(() => {
    setFilteredMedicines(searchMedicines(searchQuery));
  }, [searchQuery, medicines]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Inventory Management</h1>
        <AddMedicineForm />
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <InventoryTable 
          medicines={filteredMedicines} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Inventory Management Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Set appropriate threshold levels based on usage patterns</li>
                <li>Regularly review and update inventory to maintain accuracy</li>
                <li>Consider seasonal variations when planning stock levels</li>
                <li>Monitor expiration dates to minimize waste</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;