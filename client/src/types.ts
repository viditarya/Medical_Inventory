// Medicine type
export interface Medicine {
  medicine_id: number;
  name: string;
  category: string;
  unit: string;
}

// Batch type
export interface Batch {
  batch_id: number;
  medicine_id: number;
  quantity: number;
  expiry_date: string;
  qr_code: string;
}

// Usage History type
export interface UsageHistory {
  usage_id: number;
  medicine_id: number;
  batch_id: number;
  date: string;
  quantity_used: number;
}

// Prediction type
export interface Prediction {
  prediction_id: number;
  medicine_id: number;
  predicted_demand: number;
  period: string;
  created_at: string;
}

// User type
export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: string;
}

// Threshold type
export interface Threshold {
  threshold_id: number;
  medicine_id: number;
  reorder_level: number;
}

// Dashboard data type
export interface DashboardData {
  medicine_id: number;
  name: string;
  totalStock: number;
  nextPrediction: Prediction | null;
  alerts: string;
}

// Chart data type
export interface ChartData {
  name: string;
  value: number;
}