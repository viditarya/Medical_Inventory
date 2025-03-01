import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchPredictions } from '../../utils/api';
import { Medicine, Prediction } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';

const PredictiveAnalysis: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);

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
        
        // Mock predictions data
        const predictionsData: Prediction[] = [
          { prediction_id: 1, medicine_id: 1, predicted_demand: 300, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 2, medicine_id: 1, predicted_demand: 320, period: '2023-Q3', created_at: '2023-04-01' },
          { prediction_id: 3, medicine_id: 1, predicted_demand: 350, period: '2023-Q4', created_at: '2023-04-01' },
          { prediction_id: 4, medicine_id: 1, predicted_demand: 380, period: '2024-Q1', created_at: '2023-04-01' },
          { prediction_id: 5, medicine_id: 2, predicted_demand: 100, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 6, medicine_id: 2, predicted_demand: 110, period: '2023-Q3', created_at: '2023-04-01' },
          { prediction_id: 7, medicine_id: 2, predicted_demand: 120, period: '2023-Q4', created_at: '2023-04-01' },
          { prediction_id: 8, medicine_id: 2, predicted_demand: 130, period: '2024-Q1', created_at: '2023-04-01' },
          { prediction_id: 9, medicine_id: 3, predicted_demand: 150, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 10, medicine_id: 3, predicted_demand: 160, period: '2023-Q3', created_at: '2023-04-01' },
          { prediction_id: 11, medicine_id: 3, predicted_demand: 170, period: '2023-Q4', created_at: '2023-04-01' },
          { prediction_id: 12, medicine_id: 3, predicted_demand: 180, period: '2024-Q1', created_at: '2023-04-01' },
          { prediction_id: 13, medicine_id: 4, predicted_demand: 200, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 14, medicine_id: 4, predicted_demand: 210, period: '2023-Q3', created_at: '2023-04-01' },
          { prediction_id: 15, medicine_id: 4, predicted_demand: 220, period: '2023-Q4', created_at: '2023-04-01' },
          { prediction_id: 16, medicine_id: 4, predicted_demand: 230, period: '2024-Q1', created_at: '2023-04-01' },
          { prediction_id: 17, medicine_id: 5, predicted_demand: 50, period: '2023-Q2', created_at: '2023-04-01' },
          { prediction_id: 18, medicine_id: 5, predicted_demand: 55, period: '2023-Q3', created_at: '2023-04-01' },
          { prediction_id: 19, medicine_id: 5, predicted_demand: 60, period: '2023-Q4', created_at: '2023-04-01' },
          { prediction_id: 20, medicine_id: 5, predicted_demand: 65, period: '2024-Q1', created_at: '2023-04-01' },
        ];
        
        setMedicines(medicinesData);
        setPredictions(predictionsData);
        
        // Prepare chart data
        const periods = ['2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1'];
        const chartData = periods.map(period => {
          const dataPoint: any = { period };
          
          medicinesData.forEach(medicine => {
            const prediction = predictionsData.find(p => 
              p.medicine_id === medicine.medicine_id && p.period === period
            );
            
            if (prediction) {
              dataPoint[medicine.name] = prediction.predicted_demand;
            }
          });
          
          return dataPoint;
        });
        
        setChartData(chartData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prediction data:', err);
        setError('Failed to fetch prediction data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefreshPredictions = async () => {
    try {
      setRefreshing(true);
      
      // In a real app, this would call the API to refresh predictions
      // await fetchPredictions();
      
      // Mock refreshing predictions (just wait a bit)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRefreshing(false);
    } catch (err) {
      console.error('Error refreshing predictions:', err);
      setRefreshing(false);
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

  // Generate random colors for the chart
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Predictive Analysis</h1>
          <p className="text-gray-600">Medicine demand predictions for upcoming periods</p>
        </div>
        <button
          onClick={handleRefreshPredictions}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Predictions'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Predictions Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Demand Predictions</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted Demand
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {predictions.map((prediction) => (
                  <tr key={prediction.prediction_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getMedicineName(prediction.medicine_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.predicted_demand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Predictions Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Demand Forecast Chart</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                {medicines.map((medicine, index) => (
                  <Bar
                    key={medicine.medicine_id}
                    dataKey={medicine.name}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <ChatbotPlaceholder />
    </div>
  );
};

export default PredictiveAnalysis;
