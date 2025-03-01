import { Medicine, Batch, Prediction } from '../types';

// Calculate total stock for a medicine from batches
export const calculateTotalStock = (medicineId: number, batches: Batch[]): number => {
  return batches
    .filter(batch => batch.medicine_id === medicineId)
    .reduce((total, batch) => total + batch.quantity, 0);
};

// Get the next prediction for a medicine
export const getNextPrediction = (medicineId: number, predictions: Prediction[]): Prediction | null => {
  const medicinePredictions = predictions
    .filter(prediction => prediction.medicine_id === medicineId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  return medicinePredictions.length > 0 ? medicinePredictions[0] : null;
};

// Check if a medicine is low on stock
export const isLowStock = (totalStock: number, threshold: number): boolean => {
  return totalStock < threshold;
};

// Check if a batch is near expiry (less than 30 days)
export const isNearExpiry = (expiryDate: string): boolean => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays < 30 && diffDays >= 0;
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate alert message for medicine
export const generateAlertMessage = (
  totalStock: number, 
  threshold: number, 
  batches: Batch[], 
  medicineId: number
): string => {
  const alerts = [];
  
  if (isLowStock(totalStock, threshold)) {
    alerts.push("Low Stock");
  }
  
  const nearExpiryBatch = batches
    .filter(batch => batch.medicine_id === medicineId)
    .find(batch => isNearExpiry(batch.expiry_date));
  
  if (nearExpiryBatch) {
    alerts.push("Near Expiry");
  }
  
  return alerts.join(", ");
};

// Sort function for table columns
export const sortByProperty = <T>(array: T[], property: keyof T, ascending: boolean): T[] => {
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return ascending ? -1 : 1;
    if (a[property] > b[property]) return ascending ? 1 : -1;
    return 0;
  });
};