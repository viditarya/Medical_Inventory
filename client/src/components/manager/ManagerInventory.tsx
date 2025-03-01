import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchBatches, scanQR, updateStock } from '../../utils/api';
import { Medicine, Batch } from '../../types';
import { isNearExpiry, sortByProperty } from '../../utils/helpers';
import { AlertCircle, ArrowUpDown } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';

const ManagerInventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Batch>('expiry_date');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  
  // Form states
  const [selectedMedicineId, setSelectedMedicineId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<number>(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
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
        console.error('Error fetching inventory data:', err);
        setError('Failed to fetch inventory data. Please try again later.');
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

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicineId || quantity <= 0 || !expiryDate || !qrCode) return;
    
    try {
      const newBatch: Batch = {
        batch_id: batches.length + 1,
        medicine_id: selectedMedicineId,
        quantity,
        expiry_date: expiryDate,
        qr_code: qrCode
      };
      
      setBatches(prev => sortByProperty([...prev, newBatch], sortField, sortAscending));
      setSelectedMedicineId(0);
      setQuantity(0);
      setExpiryDate('');
      setQrCode('');
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding batch:', err);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId || quantityUsed <= 0) return;
    
    try {
      setBatches(prev => 
        prev.map(batch => 
          batch.batch_id === selectedBatchId 
            ? { ...batch, quantity: Math.max(0, batch.quantity - quantityUsed) }
            : batch
        )
      );
      setSelectedBatchId(0);
      setQuantityUsed(0);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setLoading(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600">Manage medicine batches and stock levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Batch Inventory</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('expiry_date')}
                  >
                    <div className="flex items-center">
                      Expiry Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch.batch_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medicines.find(m => m.medicine_id === batch.medicine_id)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.expiry_date}
                      {isNearExpiry(batch.expiry_date) && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Near Expiry
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.qr_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forms Section */}
        <div className="space-y-6">
          {/* Add Batch Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Batch</h2>
            
            {addSuccess && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                Batch added successfully!
              </div>
            )}

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine
                </label>
                <select
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={0}>Select Medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.medicine_id} value={medicine.medicine_id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code
                </label>
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter QR code"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Batch
              </button>
            </form>
          </div>

          {/* Update Stock Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Update Stock</h2>
            
            {updateSuccess && (
              <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                Stock updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value={0}>Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.batch_id} value={batch.batch_id}>
                      {medicines.find(m => m.medicine_id === batch.medicine_id)?.name} - {batch.qr_code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Used
                </label>
                <input
                  type="number"
                  value={quantityUsed}
                  onChange={(e) => setQuantityUsed(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="1"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Stock
              </button>
            </form>
          </div>
        </div>
      </div>

      <ChatbotPlaceholder />
    </div>
  );
};

export default ManagerInventory;
