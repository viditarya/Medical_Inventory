import React, { useEffect } from 'react';
import { useMedicineContext } from '../context/MedicineContext';
import StatsCard from '../components/StatsCard';
import { Package, AlertTriangle, TrendingUp, Thermometer } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { medicines, predictions, loading, error, fetchMedicines, fetchPredictions } = useMedicineContext();
  
  useEffect(() => {
    fetchMedicines();
    fetchPredictions();
  }, []);
  
  // Calculate dashboard statistics
  const totalStock = medicines.reduce((sum, medicine) => sum + medicine.stock_level, 0);
  const lowStockItems = medicines.filter(medicine => medicine.stock_level <= medicine.threshold);
  const criticalStockItems = medicines.filter(medicine => medicine.stock_level <= medicine.threshold * 0.5);
  
  // Prepare data for the chart
  const chartData = {
    labels: medicines.slice(0, 8).map(medicine => medicine.name),
    datasets: [
      {
        label: 'Current Stock',
        data: medicines.slice(0, 8).map(medicine => medicine.stock_level),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Predicted Demand',
        data: predictions.slice(0, 8).map(prediction => prediction.predicted_demand),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Threshold',
        data: medicines.slice(0, 8).map(medicine => medicine.threshold),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgb(255, 206, 86)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Current Stock vs Predicted Demand',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units',
        },
      },
    },
  };
  
  // Weather impact data (mock)
  const weatherImpact = {
    temperature: '32°C',
    humidity: '75%',
    impact: 'High temperatures and humidity may increase demand for antihistamines by 20%',
  };

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
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Inventory"
          value={`${totalStock} units`}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          change="+5% from last month"
          trend="up"
        />
        
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
          change={`${lowStockItems.length} items below threshold`}
          trend="neutral"
        />
        
        <StatsCard
          title="Critical Stock"
          value={criticalStockItems.length}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-red-500"
          change={`${criticalStockItems.length > 2 ? 'Increased' : 'Decreased'} since yesterday`}
          trend={criticalStockItems.length > 2 ? 'up' : 'down'}
        />
        
        <StatsCard
          title="Weather Impact"
          value={weatherImpact.temperature}
          icon={<Thermometer className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          change={`${weatherImpact.humidity} humidity`}
          trend="up"
        />
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {lowStockItems.length} items are below the recommended threshold. Consider restocking:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {lowStockItems.slice(0, 3).map(item => (
                    <li key={item.id}>
                      {item.name}: {item.stock_level} units (Threshold: {item.threshold})
                    </li>
                  ))}
                  {lowStockItems.length > 3 && (
                    <li>And {lowStockItems.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Weather Impact Alert */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Thermometer className="h-5 w-5 text-purple-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Weather Impact Alert</h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>{weatherImpact.impact}</p>
              <p className="mt-1">
                Recommendation: Increase stock of Loratadine and Cetirizine by 20% to meet expected demand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;