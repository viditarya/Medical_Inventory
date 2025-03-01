import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchBatches, scanQR, updateStock } from '../../utils/api';
import { Medicine, Batch } from '../../types';
import { isNearExpiry, sortByProperty } from '../../utils/helpers';
import { AlertCircle, ArrowUpDown } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import ChatbotPlaceholder from '../common/ChatbotPlaceholder';

const ManagerInventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Batch>('expiry_date');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  
  // Form states
  const [selectedMedicineId, setSelectedMedicineId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<number>(0);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

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
        
        // Mock batches data
        const batchesData: Batch[] = [
          { batch_id: 1, medicine_id: 1, quantity: 200, expiry_date: '2025-12-01', qr_code: 'QR-0001-1' },
          { batch_id: 2, medicine_id: 1, quantity: 150, expiry_date: '2025-06-15', qr_code: 'QR-0001-2' },
          { batch_id: 3, medicine_id: 2, quantity: 30, expiry_date: '2025-08-20', qr_code: 'QR-0002-1' },
          { batch_id: 4, medicine_id: 3, quantity: 80, expiry_date: '2025-10-10', qr_code: 'QR-0003-1' },
          { batch_id: 5, medicine_id: 4, quantity: 100, expiry_date: '2025-07-05', qr_code: 'QR-0004-1' },
          { batch_id: 6, medicine_id: 5, quantity: 20, expiry_date: '2025-05-30', qr_code: 'QR-0005-1' },
          { batch_id: 7, medicine_id: 2, quantity: 10, expiry_date: '2023-06-01', qr_code: 'QR-0002-2' }, // Near expiry
        ];
        
        setMedicines(medicinesData);
        setBatches(sortByProperty(batchesData, sortField, sortAscending));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError('Failed to fetch inventory data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [sortField, sortAscending]);

  const handleSort = (field: keyof Batch) => {
    if (field === sortField) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicineId || quantity <= 0 || !expiryDate || !qrCode) return;
    
    try {
      const newBatch: Batch = {
        batch_id: batches.length + 1,
        medicine_id: selectedMedicineId,
        quantity,
        expiry_date: expiryDate,
        qr_code: qrCode
      };
      
      setBatches(prev => sortByProperty([...prev, newBatch], sortField, sortAscending));
      setSelectedMedicineId(0);
      setQuantity(0);
      setExpiryDate('');
      setQrCode('');
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding batch:', err);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId || quantityUsed <= 0) return;
    
    try {
      setBatches(prev => 
        prev.map(batch => 
          batch.batch_id === selectedBatchId 
            ? { ...batch, quantity: Math.max(0, batch.quantity - quantityUsed) }
            : batch
        )
      );
      setSelectedBatchId(0);
      setQuantityUsed(0);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  return <div> {/* UI implementation goes here */} </div>;
};

export default ManagerInventory;
