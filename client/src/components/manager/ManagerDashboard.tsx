import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchBatches, fetchPredictions } from '../../utils/api';
import { calculateTotalStock, getNextPrediction, generateAlertMessage } from '../../utils/helpers';
import { Medicine, Batch, Prediction, DashboardData } from '../../types';
import { AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import PredictionChart from './PredictionChart';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';
import { Link } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicineSpecificPredictions, setMedicineSpecificPredictions] = useState<Prediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState<boolean>(false);

  // Mock threshold data (in a real app, this would come from the API)
  const thresholds = [
    { medicine_id: 1, reorder_level: 100 },
    { medicine_id: 2, reorder_level: 50 },
    { medicine_id: 3, reorder_level: 75 },
    { medicine_id: 4, reorder_level: 120 },
    { medicine_id: 5, reorder_level: 30 },
  ];

  // Default region - in a real app, this would come from user settings or context
  const DEFAULT_REGION = 'central';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [medicinesData, batchesData, predictionsData] = await Promise.all([
        fetchMedicines(),
        fetchBatches(),
        fetchPredictions(1, DEFAULT_REGION), // Initial predictions for first medicine
      ]);

      setMedicines(medicinesData);
      setBatches(batchesData);
      setPredictions(predictionsData);

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

  const handleMedicineSelect = async (medicine: Medicine) => {
    try {
      setSelectedMedicine(medicine);
      setLoadingPredictions(true);
      const predictions = await fetchPredictions(medicine.medicine_id, DEFAULT_REGION);
      setMedicineSpecificPredictions(predictions);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    } finally {
      setLoadingPredictions(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Manager Dashboard</h1>
        <p className="text-gray-600">Overview of medicine inventory and predictions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Status Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Medicine Inventory Status</h2>
            <div className="flex space-x-4">
              <Link to="/inventory" className="flex items-center text-blue-600 hover:text-blue-800">
                View Inventory
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.map((item) => (
                  <tr 
                    key={item.medicine_id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMedicineSelect(medicines.find(m => m.medicine_id === item.medicine_id)!)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalStock}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMedicineSelect(medicines.find(m => m.medicine_id === item.medicine_id)!);
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        View Predictions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Predictions Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {selectedMedicine ? (
            loadingPredictions ? (
              <div className="h-[400px] flex items-center justify-center">
                <LoadingState />
              </div>
            ) : (
              <PredictionChart
                predictions={medicineSpecificPredictions}
                medicineName={selectedMedicine.name}
              />
            )
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              Select a medicine to view predictions
            </div>
          )}
        </div>
      </div>

      <ChatbotPlaceholder />
    </div>
  );
};

export default ManagerDashboard;
