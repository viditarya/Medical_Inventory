import React, { useState, useEffect } from 'react';
import { useMedicineContext, Medicine, Prediction } from '../context/MedicineContext';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, addMonths, subMonths } from 'date-fns';
import { TrendingUp, CloudRain, Thermometer, Wind } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PredictiveAnalytics: React.FC = () => {
  const { medicines, predictions, loading, error, fetchMedicines, fetchPredictions, fetchHistoricalUsage } = useMedicineContext();
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  // Weather data (mock)
  const weatherData = {
    temperature: '32°C',
    humidity: '75%',
    forecast: 'Hot and humid for the next 3 months',
    season: 'Summer',
  };
  
  // Insights (mock)
  const insights = [
    { 
      title: 'Seasonal Trend', 
      description: 'Antihistamine demand increases by 30% during summer months due to allergies',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    },
    { 
      title: 'Weather Impact', 
      description: 'High humidity (75%) correlates with 20% higher demand for respiratory medications',
      icon: <CloudRain className="h-5 w-5 text-blue-500" />
    },
    { 
      title: 'Temperature Effect', 
      description: 'Each 5°C increase in temperature leads to 15% more heat-related medication needs',
      icon: <Thermometer className="h-5 w-5 text-blue-500" />
    },
    { 
      title: 'Pollen Index', 
      description: 'High pollen count expected next month, prepare for 25% increase in allergy medications',
      icon: <Wind className="h-5 w-5 text-blue-500" />
    }
  ];
  
  useEffect(() => {
    fetchMedicines();
    fetchPredictions();
    
    // Set default selected medicine
    if (medicines.length > 0 && !selectedMedicine) {
      setSelectedMedicine(medicines[0].id);
    }
  }, []);
  
  useEffect(() => {
    if (selectedMedicine) {
      loadChartData(selectedMedicine);
    }
  }, [selectedMedicine, medicines, predictions]);
  
  const loadChartData = async (medicineId: number) => {
    try {
      const historicalData = await fetchHistoricalUsage(medicineId);
      const selectedMedicineData = medicines.find(m => m.id === medicineId);
      const predictionData = predictions.find(p => p.medicine_id === medicineId);
      
      if (!selectedMedicineData || !predictionData) return;
      
      // Generate dates for the past 6 months and future 3 months
      const today = new Date();
      const pastDates = Array.from({ length: 6 }, (_, i) => format(subMonths(today, 6 - i), 'MMM yyyy'));
      const futureDates = Array.from({ length: 3 }, (_, i) => format(addMonths(today, i + 1), 'MMM yyyy'));
      const allDates = [...pastDates, format(today, 'MMM yyyy'), ...futureDates];
      
      // Historical usage data
      const historicalUsage = historicalData.map(item => item.quantity_used);
      
      // Generate some future predictions with slight variations
      const currentUsage = historicalUsage[historicalUsage.length - 1] || 100;
      const predictedUsage = [
        currentUsage * 1.05, // Current month (slight increase)
        predictionData.predicted_demand * 0.9, // Next month
        predictionData.predicted_demand, // 2 months ahead
        predictionData.predicted_demand * 1.1, // 3 months ahead
      ];
      
      // Combine historical and predicted data
      const usageData = [...historicalUsage, ...predictedUsage];
      
      // Generate threshold line data
      const thresholdData = Array(allDates.length).fill(selectedMedicineData.threshold);
      
      setChartData({
        labels: allDates,
        datasets: [
          {
            label: 'Historical Usage',
            data: [...historicalUsage, null, null, null, null],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'Predicted Usage',
            data: [null, null, null, null, null, null, ...predictedUsage],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'Threshold',
            data: thresholdData,
            borderColor: 'rgb(255, 206, 86)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderDash: [3, 3],
            fill: false,
            tension: 0,
            pointRadius: 0,
          },
        ],
      });
      
      // Generate recommendations based on the selected medicine
      generateRecommendations(selectedMedicineData, predictionData);
      
    } catch (err) {
      console.error('Error loading chart data:', err);
    }
  };
  
  const generateRecommendations = (medicine: Medicine, prediction: Prediction) => {
    const recommendations: string[] = [];
    
    // Check if stock is below predicted demand
    if (medicine.stock_level < prediction.predicted_demand) {
      const deficit = prediction.predicted_demand - medicine.stock_level;
      recommendations.push(`Order ${deficit} more units of ${medicine.name} to meet predicted demand of ${prediction.predicted_demand} units.`);
    }
    
    // Weather-based recommendations
    if (medicine.category === 'Antihistamine' && weatherData.season === 'Summer') {
      recommendations.push(`Increase ${medicine.name} stock by 30% due to summer allergy season and high pollen forecast.`);
    }
    
    if (medicine.category === 'Pain Relief' && parseInt(weatherData.temperature) > 30) {
      recommendations.push(`Consider stocking 15% more ${medicine.name} due to high temperatures (${weatherData.temperature}) increasing heat-related issues.`);
    }
    
    // Add a general recommendation if none specific
    if (recommendations.length === 0) {
      recommendations.push(`Current stock of ${medicine.name} (${medicine.stock_level} units) appears sufficient for predicted demand (${prediction.predicted_demand} units).`);
    }
    
    setRecommendations(recommendations);
  };
  
  const handleMedicineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMedicine(parseInt(e.target.value));
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
      <h1 className="text-2xl font-bold text-gray-800">Predictive Analytics</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {insight.icon}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">{insight.title}</h3>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weather Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Temperature</span>
              </div>
              <p className="text-2xl font-bold mt-2">{weatherData.temperature}</p>
              <p className="text-xs text-gray-500 mt-1">5°C above average</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <CloudRain className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Humidity</span>
              </div>
              <p className="text-2xl font-bold mt-2">{weatherData.humidity}</p>
              <p className="text-xs text-gray-500 mt-1">15% above average</p>
            </div>
            
            <div className="col-span-2 bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Forecast</span>
              </div>
              <p className="text-sm mt-2">{weatherData.forecast}</p>
              <p className="text-xs text-gray-500 mt-1">
                Impact: High temperatures and humidity will increase demand for antihistamines and hydration products
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medicine Selector and Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">Usage Trends & Predictions</h2>
          <div className="w-full sm:w-64">
            <select
              value={selectedMedicine || ''}
              onChange={handleMedicineChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a medicine</option>
              {medicines.map(medicine => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {chartData ? (
          <div className="h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
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
                  x: {
                    title: {
                      display: true,
                      text: 'Month',
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
            <p className="text-gray-500">Select a medicine to view usage trends</p>
          </div>
        )}
      </div>
      
      {/* Recommendations */}
      {selectedMedicine && recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h2>
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalytics;