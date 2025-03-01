import { Medicine, Prediction, HistoricalUsage } from '../context/MedicineContext';

// Mock data for development
export const mockMedicines: Medicine[] = [
  { id: 1, name: 'Paracetamol', category: 'Pain Relief', stock_level: 250, threshold: 100, last_updated: '2023-11-01' },
  { id: 2, name: 'Amoxicillin', category: 'Antibiotics', stock_level: 120, threshold: 50, last_updated: '2023-11-02' },
  { id: 3, name: 'Ibuprofen', category: 'Pain Relief', stock_level: 180, threshold: 100, last_updated: '2023-11-01' },
  { id: 4, name: 'Loratadine', category: 'Antihistamine', stock_level: 45, threshold: 60, last_updated: '2023-11-03' },
  { id: 5, name: 'Omeprazole', category: 'Antacid', stock_level: 75, threshold: 40, last_updated: '2023-11-02' },
  { id: 6, name: 'Aspirin', category: 'Pain Relief', stock_level: 200, threshold: 150, last_updated: '2023-11-01' },
  { id: 7, name: 'Cetirizine', category: 'Antihistamine', stock_level: 30, threshold: 50, last_updated: '2023-11-03' },
  { id: 8, name: 'Metformin', category: 'Diabetes', stock_level: 90, threshold: 80, last_updated: '2023-11-02' },
];

export const mockPredictions: Prediction[] = [
  { medicine_id: 1, medicine_name: 'Paracetamol', predicted_demand: 300, date: '2023-12-01' },
  { medicine_id: 2, medicine_name: 'Amoxicillin', predicted_demand: 80, date: '2023-12-01' },
  { medicine_id: 3, medicine_name: 'Ibuprofen', predicted_demand: 220, date: '2023-12-01' },
  { medicine_id: 4, medicine_name: 'Loratadine', predicted_demand: 70, date: '2023-12-01' },
  { medicine_id: 5, medicine_name: 'Omeprazole', predicted_demand: 50, date: '2023-12-01' },
  { medicine_id: 6, medicine_name: 'Aspirin', predicted_demand: 180, date: '2023-12-01' },
  { medicine_id: 7, medicine_name: 'Cetirizine', predicted_demand: 60, date: '2023-12-01' },
  { medicine_id: 8, medicine_name: 'Metformin', predicted_demand: 100, date: '2023-12-01' },
];

export const mockHistoricalUsage: Record<number, HistoricalUsage[]> = {
  1: [
    { date: '2023-06-01', quantity_used: 120 },
    { date: '2023-07-01', quantity_used: 135 },
    { date: '2023-08-01', quantity_used: 150 },
    { date: '2023-09-01', quantity_used: 140 },
    { date: '2023-10-01', quantity_used: 160 },
    { date: '2023-11-01', quantity_used: 180 },
  ],
  2: [
    { date: '2023-06-01', quantity_used: 60 },
    { date: '2023-07-01', quantity_used: 55 },
    { date: '2023-08-01', quantity_used: 70 },
    { date: '2023-09-01', quantity_used: 65 },
    { date: '2023-10-01', quantity_used: 75 },
    { date: '2023-11-01', quantity_used: 70 },
  ],
  // Add more for other medicines as needed
};

// Mock API functions
export const fetchMedicines = async (): Promise<Medicine[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMedicines;
};

export const fetchPredictions = async (): Promise<Prediction[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPredictions;
};

export const fetchHistoricalUsage = async (medicineId: number): Promise<HistoricalUsage[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return specific data if available, or generate mock data
  if (mockHistoricalUsage[medicineId]) {
    return mockHistoricalUsage[medicineId];
  }
  
  // Generate random historical data if not predefined
  return Array.from({ length: 6 }, (_, i) => ({
    date: `2023-${String(6 + i).padStart(2, '0')}-01`,
    quantity_used: Math.floor(Math.random() * 100) + 50,
  }));
};

export const addMedicine = async (medicine: Omit<Medicine, 'id' | 'last_updated'>): Promise<Medicine> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMedicine: Medicine = {
    ...medicine,
    id: mockMedicines.length + 1,
    last_updated: new Date().toISOString().split('T')[0],
  };
  
  mockMedicines.push(newMedicine);
  return newMedicine;
};

export const sendChatbotQuery = async (query: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple keyword-based responses for demo
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('aspirin') && lowerQuery.includes('stock')) {
    return "We currently have 200 units of Aspirin in stock, which is above the threshold of 150 units.";
  } else if (lowerQuery.includes('paracetamol') && lowerQuery.includes('demand')) {
    return "The predicted demand for Paracetamol next month is 300 units, which is higher than our current stock of 250 units. I recommend ordering at least 50 more units.";
  } else if (lowerQuery.includes('low') && lowerQuery.includes('stock')) {
    return "We have 2 medicines with critically low stock: Loratadine (45 units) and Cetirizine (30 units). Both are antihistamines and should be restocked soon.";
  } else if (lowerQuery.includes('weather') && lowerQuery.includes('impact')) {
    return "Based on weather forecasts, we expect a 20% increase in demand for antihistamines due to the upcoming pollen season. The high humidity and temperature will likely trigger allergies.";
  } else if (lowerQuery.includes('order') || lowerQuery.includes('restock')) {
    return "I recommend restocking Cetirizine (30 units) and Loratadine (45 units) as they are below threshold levels. Would you like me to prepare an order request?";
  } else {
    return "I'm not sure I understand your query. You can ask me about current stock levels, predicted demand, or recommendations for restocking.";
  }
};