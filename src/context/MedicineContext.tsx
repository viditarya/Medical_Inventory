import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define types
export interface Medicine {
  id: number;
  name: string;
  category: string;
  stock_level: number;
  threshold: number;
  last_updated: string;
}

export interface Prediction {
  medicine_id: number;
  medicine_name: string;
  predicted_demand: number;
  date: string;
}

export interface HistoricalUsage {
  date: string;
  quantity_used: number;
}

interface MedicineContextType {
  medicines: Medicine[];
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  fetchMedicines: () => Promise<void>;
  fetchPredictions: () => Promise<void>;
  fetchHistoricalUsage: (medicineId: number) => Promise<HistoricalUsage[]>;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'last_updated'>) => Promise<void>;
  searchMedicines: (query: string) => Medicine[];
}

// Create context
const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

// Mock API functions (replace with actual API calls in production)
const API_BASE_URL = 'http://localhost:5000';

// Provider component
export const MedicineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockMedicines: Medicine[] = [
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', stock_level: 250, threshold: 100, last_updated: '2023-11-01' },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', stock_level: 120, threshold: 50, last_updated: '2023-11-02' },
    { id: 3, name: 'Ibuprofen', category: 'Pain Relief', stock_level: 180, threshold: 100, last_updated: '2023-11-01' },
    { id: 4, name: 'Loratadine', category: 'Antihistamine', stock_level: 45, threshold: 60, last_updated: '2023-11-03' },
    { id: 5, name: 'Omeprazole', category: 'Antacid', stock_level: 75, threshold: 40, last_updated: '2023-11-02' },
    { id: 6, name: 'Aspirin', category: 'Pain Relief', stock_level: 200, threshold: 150, last_updated: '2023-11-01' },
    { id: 7, name: 'Cetirizine', category: 'Antihistamine', stock_level: 30, threshold: 50, last_updated: '2023-11-03' },
    { id: 8, name: 'Metformin', category: 'Diabetes', stock_level: 90, threshold: 80, last_updated: '2023-11-02' },
  ];

  const mockPredictions: Prediction[] = [
    { medicine_id: 1, medicine_name: 'Paracetamol', predicted_demand: 300, date: '2023-12-01' },
    { medicine_id: 2, medicine_name: 'Amoxicillin', predicted_demand: 80, date: '2023-12-01' },
    { medicine_id: 3, medicine_name: 'Ibuprofen', predicted_demand: 220, date: '2023-12-01' },
    { medicine_id: 4, medicine_name: 'Loratadine', predicted_demand: 70, date: '2023-12-01' },
    { medicine_id: 5, medicine_name: 'Omeprazole', predicted_demand: 50, date: '2023-12-01' },
    { medicine_id: 6, medicine_name: 'Aspirin', predicted_demand: 180, date: '2023-12-01' },
    { medicine_id: 7, medicine_name: 'Cetirizine', predicted_demand: 60, date: '2023-12-01' },
    { medicine_id: 8, medicine_name: 'Metformin', predicted_demand: 100, date: '2023-12-01' },
  ];

  // Fetch medicines from API
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_BASE_URL}/current_stock`);
      // setMedicines(response.data);
      
      // Using mock data for development
      setMedicines(mockMedicines);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch medicines');
      setLoading(false);
      console.error('Error fetching medicines:', err);
    }
  };

  // Fetch predictions from API
  const fetchPredictions = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_BASE_URL}/predictions`);
      // setPredictions(response.data);
      
      // Using mock data for development
      setPredictions(mockPredictions);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch predictions');
      setLoading(false);
      console.error('Error fetching predictions:', err);
    }
  };

  // Fetch historical usage for a specific medicine
  const fetchHistoricalUsage = async (medicineId: number): Promise<HistoricalUsage[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_BASE_URL}/historical_usage?medicine_id=${medicineId}`);
      // return response.data;
      
      // Using mock data for development
      const mockHistoricalData: HistoricalUsage[] = [
        { date: '2023-06-01', quantity_used: 120 },
        { date: '2023-07-01', quantity_used: 135 },
        { date: '2023-08-01', quantity_used: 150 },
        { date: '2023-09-01', quantity_used: 140 },
        { date: '2023-10-01', quantity_used: 160 },
        { date: '2023-11-01', quantity_used: 180 },
      ];
      return mockHistoricalData;
    } catch (err) {
      console.error('Error fetching historical usage:', err);
      return [];
    }
  };

  // Add a new medicine
  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'last_updated'>) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(`${API_BASE_URL}/add_item`, medicine);
      // const newMedicine = response.data;
      
      // Using mock data for development
      const newMedicine: Medicine = {
        ...medicine,
        id: medicines.length + 1,
        last_updated: new Date().toISOString().split('T')[0],
      };
      
      setMedicines([...medicines, newMedicine]);
    } catch (err) {
      setError('Failed to add medicine');
      console.error('Error adding medicine:', err);
    }
  };

  // Search medicines by name or category
  const searchMedicines = (query: string): Medicine[] => {
    if (!query) return medicines;
    
    const lowerCaseQuery = query.toLowerCase();
    return medicines.filter(
      medicine => 
        medicine.name.toLowerCase().includes(lowerCaseQuery) || 
        medicine.category.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Load initial data
  useEffect(() => {
    fetchMedicines();
    fetchPredictions();
  }, []);

  const value = {
    medicines,
    predictions,
    loading,
    error,
    fetchMedicines,
    fetchPredictions,
    fetchHistoricalUsage,
    addMedicine,
    searchMedicines,
  };

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

// Custom hook to use the medicine context
export const useMedicineContext = () => {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error('useMedicineContext must be used within a MedicineProvider');
  }
  return context;
};