import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchBatches, updateStock } from '../../utils/api';
import { Medicine, Batch } from '../../types';
import { isNearExpiry, sortByProperty } from '../../utils/helpers';
import { AlertCircle, ArrowUpDown } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';

const StockUpdate: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Batch>('quantity');
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  
  // Form states
  const [selectedBatchId, setSelectedBatchId] = useState<number>(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock medicines data
        const medicinesData: Medicine[] = [
          { medicine_id: 1, name: 'Paracetamol', category: 'Pain Relief', unit: 'Tablet' },
          { medicine_id: 2, name: 'Amoxicillin', category: 'Antibiotic', unit: 'Capsule' },
          { medicine_id: 3, name: 'Ibuprofen', category: 'Anti-inflammatory', unit: 'Tablet' },
          { medicine_id: 4, name: 'Omeprazole', category: 'Antacid', unit: 'Capsule' },
          { medicine_id: 5, name: 'Metformin', category: 'Antidiabetic', unit: 'Tablet' },
        ];
        
        // Mock batches data
        const batchesData: Batch[] = [
          { batch_id: 1, medicine_id: 1, quantity: 200, expiry_date: '2025-12-01', qr_code: 'QR-0001-1' },
          { batch_id: 2, medicine_id: 1, quantity: 150, expiry_date: '2025-06-15', qr_code: 'QR-0001-2' },
          { batch_id: 3, medicine_id: 2, quantity: 30, expiry_date: '2025-08-20', qr_code: 'QR-0002-1' },
          { batch_id: 4, medicine_id: 3, quantity: 80, expiry_date: '2025-10-10', qr_code: 'QR-0003-1' },
          { batch_id: 5, medicine_id: 4, quantity: 100, expiry_date: '2025-07-05', qr_code: 'QR-0004-1' },
          { batch_id: 6, medicine_id: 5, quantity: 20, expiry_date: '2025-05-30', qr_code: 'QR-0005-1' },
          { batch_id: 7, medicine_id: 2, quantity: 10, expiry_date: '2023-06-01', qr_code: 'QR-0002-2' }, // Near expiry
        ];
        
        setMedicines(medicinesData);
        setBatches(sortByProperty(batchesData, sortField, sortAscending));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to fetch stock data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [sortField, sortAscending]);

  const handleSort = (field: keyof Batch) => {
    if (field === sortField) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatchId || quantityUsed <= 0) {
      return;
    }
    
    try {
      // In a real app, this would call the API
      // await updateStock(selectedBatchId, quantityUsed);
      
      // Mock updating a batch
      setBatches(prev => 
        prev.map(batch => 
          batch.batch_id === selectedBatchId 
            ? { ...batch, quantity: Math.max(0, batch.quantity - quantityUsed) } 
            : batch
        )
      );
      
      // Reset form
      setSelectedBatchId(0);
      setQuantityUsed(0);
      
      // Show success message
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const getMedicineName = (medicineId: number): string => {
    return medicines.find(m => m.medicine_id === medicineId)?.name || 'Unknown';
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setLoading(true)} />;
  }

  // Mock threshold data (in a real app, this would come from the API)
  const thresholds = [
    { medicine_id: 1, reorder_level: 100 },
    { medicine_id: 2, reorder_level: 50 },
    { medicine_id: 3, reorder_level: 75 },
    { medicine_id: 4, reorder_level: 120 },
    { medicine_id: 5, reorder_level: 30 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stock Update</h1>
        <p className="text-gray-600">Update medicine stock levels</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Current Stock</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      Quantity
                      {sortField === 'quantity' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('expiry_date')}
                  >
                    <div className="flex items-center">
                      Expiry Date
                      {sortField === 'expiry_date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => {
                  const medicine = medicines.find(m => m.medicine_id === batch.medicine_id);
                  const threshold = thresholds.find(t => t.medicine_id === batch.medicine_id)?.reorder_level || 0;
                  const isLow = batch.quantity < threshold;
                  const isExpiring = isNearExpiry(batch.expiry_date);
                  
                  return (
                    <tr key={batch.batch_id} className={isExpiring ? 'bg-red-50' : isLow ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {batch.batch_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getMedicineName(batch.medicine_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.expiry_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isExpiring && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Near Expiry
                          </span>
                        )}
                        {isLow && !isExpiring && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Low Stock
                          </span>
                        )}
                        {!isLow && !isExpiring && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Update Stock Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Deduct Stock</h2>
          
          {updateSuccess && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              Stock updated successfully!
            </div>
          )}
          
          <form onSubmit={handleUpdateStock}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Batch</label>
                <select
                  id="batch"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                  required
                >
                  <option value={0}>Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_id} - {getMedicineName(batch.medicine_id)} ({batch.quantity} units)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantityUsed" className="block text-sm font-medium text-gray-700">Quantity Used</label>
                <input
                  type="number"
                  id="quantityUsed"
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={quantityUsed || ''}
                  onChange={(e) => setQuantityUsed(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Alerts</h3>
            <div className="space-y-2">
              {batches.some(batch => isNearExpiry(batch.expiry_date)) && (
                <div className="flex items-start text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <p>Some batches are near expiry. Please prioritize using these batches first.</p>
                </div>
              )}
              
              {medicines.map(medicine => {
                const totalStock = batches
                  .filter(batch => batch.medicine_id === medicine.medicine_id)
                  .reduce((sum, batch) => sum + batch.quantity, 0);
                const threshold = thresholds.find(t => t.medicine_id === medicine.medicine_id)?.reorder_level || 0;
                
                if (totalStock < threshold) {
                  return (
                    <div key={medicine.medicine_id} className="flex items-start text-sm text-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                      <p>{medicine.name} is running low on stock ({totalStock} units). Please notify inventory manager.</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
      
      <ChatbotPlaceholder />
    </div>
  );
};

export default StockUpdate;