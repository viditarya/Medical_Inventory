import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Prediction } from '../../types';

interface PredictionChartProps {
  predictions: Prediction[];
  medicineName: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions, medicineName }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const data = predictions.map(pred => ({
    date: formatDate(pred.date),
    demand: Math.round(pred.predicted_demand),
    confidence: pred.confidence_interval,
  }));

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4">
        Demand Predictions for {medicineName}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [
              `${value} units`,
              'Predicted Demand'
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Predicted Demand"
          />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#82ca9d"
            strokeDasharray="3 3"
            name="Confidence Interval"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
