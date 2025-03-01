import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchBatches, fetchPredictions } from '../../utils/api';
import { calculateTotalStock, getNextPrediction, generateAlertMessage } from '../../utils/helpers';
import { Medicine, Batch, Prediction, DashboardData } from '../../types';
import { AlertCircle, ArrowRight } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);

  // Mock threshold data (in a real app, this would come from the API)
  const thresholds = [
    { medicine_id: 1, reorder_level: 100 },
    { medicine_id: 2, reorder_level: 50 },
    { medicine_id: 3, reorder_level: 75 },
    { medicine_id: 4, reorder_level: 120 },
    { medicine_id: 5, reorder_level: 30 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For demo purposes, we'll use mock data
        
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
        
        // Mock predictions data
        const predictionsData: Prediction[] = [
          { prediction_id: 1, medicine_id: 1, predicted_demand: 300, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 2, medicine_id: 2, predicted_demand: 100, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 3, medicine_id: 3, predicted_demand: 150, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 4, medicine_id: 4, predicted_demand: 200, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 5, medicine_id: 5, predicted_demand: 50, period: '2023-Q2', created_at: '2023-04-01' },
        ];
        
        setMedicines(medicinesData);
        setBatches(batchesData);
        setPredictions(predictionsData);
        
        // Process data for dashboard
        const dashboardItems = medicinesData.map(medicine => {
          const totalStock = calculateTotalStock(medicine.medicine_id, batchesData);
          const nextPrediction = getNextPrediction(medicine.medicine_id, predictionsData);
          const threshold = thresholds.find(t => t.medicine_id === medicine.medicine_id)?.reorder_level || 0;
          const alerts = generateAlertMessage(totalStock, threshold, batchesData, medicine.medicine_id);
          
          return {
            medicine_id: medicine.medicine_id,
            name: medicine.name,
            totalStock,
            nextPrediction,
            alerts
          };
        });
        
        setDashboardData(dashboardItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError('');
    // Re-fetch data
    // In a real app, this would call the fetchData function again
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of medicine inventory and alerts</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Medicine Inventory Status</h2>
          <Link 
            to="/inventory" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            View Inventory
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Prediction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.map((item) => (
                <tr key={item.medicine_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.totalStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nextPrediction ? `${item.nextPrediction.predicted_demand} (${item.nextPrediction.period})` : 'No prediction'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.alerts ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {item.alerts}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ChatbotPlaceholder />
    </div>
  );
};

export default AdminDashboard;