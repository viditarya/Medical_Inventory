import axios from 'axios';
import { Prediction } from '../types';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const fetchMedicines = async () => {
  try {
    const response = await api.get('/medicines');
    return response.data;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

export const fetchBatches = async () => {
  try {
    const response = await api.get('/batches');
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw error;
  }
};

export const fetchUsageHistory = async () => {
  try {
    const response = await api.get('/usage_history');
    return response.data;
  } catch (error) {
    console.error('Error fetching usage history:', error);
    throw error;
  }
};

export const fetchPredictions = async (
  medicineId: number,
  region: string
): Promise<Prediction[]> => {
  try {
    const response = await axios.get(
      `/api/predictions/${medicineId}?region=${region}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateStock = async (batchId: number, quantityUsed: number) => {
  try {
    const response = await api.post('/update_stock', { batch_id: batchId, quantity_used: quantityUsed });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const scanQR = async (medicineId: number, quantity: number, expiryDate: string, qrCode: string) => {
  try {
    const response = await api.post('/scan_qr', {
      medicine_id: medicineId,
      quantity,
      expiry_date: expiryDate,
      qr_code: qrCode
    });
    return response.data;
  } catch (error) {
    console.error('Error scanning QR:', error);
    throw error;
  }
};

export const addUser = async (username: string, password: string, role: string) => {
  try {
    const response = await api.post('/add_user', { username, password, role });
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export default api;
