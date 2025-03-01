import React, { useState, useEffect } from 'react';
import { fetchUsageHistory, fetchMedicines, fetchPredictions } from '../../utils/api';
import { UsageHistory, Medicine, Prediction } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';

const Analytics: React.FC = () => {
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        
        // Mock usage history data
        const usageHistoryData: UsageHistory[] = [
          { usage_id: 1, medicine_id: 1, batch_id: 1, date: '2023-01-15', quantity_used: 50 },
          { usage_id: 2, medicine_id: 2, batch_id: 3, date: '2023-01-20', quantity_used: 20 },
          { usage_id: 3, medicine_id: 3, batch_id: 4, date: '2023-01-25', quantity_used: 30 },
          { usage_id: 4, medicine_id: 1, batch_id: 2, date: '2023-02-05', quantity_used: 40 },
          { usage_id: 5, medicine_id: 4, batch_id: 5, date: '2023-02-10', quantity_used: 25 },
          { usage_id: 6, medicine_id: 5, batch_id: 6, date: '2023-02-15', quantity_used: 15 },
          { usage_id: 7, medicine_id: 2, batch_id: 7, date: '2023-02-20', quantity_used: 10 },
          { usage_id: 8, medicine_id: 1, batch_id: 1, date: '2023-03-01', quantity_used: 30 },
          { usage_id: 9, medicine_id: 3, batch_id: 4, date: '2023-03-05', quantity_used: 20 },
          { usage_id: 10, medicine_id: 4, batch_id: 5, date: '2023-03-10', quantity_used: 15 },
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
        setUsageHistory(usageHistoryData);
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
        console.error('Error fetching analytics data:', err);
        setError('Failed to fetch analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600">Usage history and demand predictions</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Usage History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Usage History</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usageHistory.map((usage) => (
                  <tr key={usage.usage_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usage.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMedicineName(usage.medicine_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.batch_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.quantity_used}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Predictions Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Predicted Demand</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                {medicines.map((medicine, index) => (
                  <Line
                    key={medicine.medicine_id}
                    type="monotone"
                    dataKey={medicine.name}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <ChatbotPlaceholder />
    </div>
  );
};

export default Analytics;