import express from 'express';
import { readStore, writeStore } from '../store.js';

const router = express.Router();

// GET all service records (optional ?vehicleId= query param)
router.get('/', (req, res) => {
  const store = readStore();
  let services = store.services || [];
  if (req.query.vehicleId) {
    services = services.filter(s => s.vehicleId === req.query.vehicleId);
  }
  res.json(services);
});

// POST add service record
router.post('/', (req, res) => {
  const store = readStore();
  const { vehicleId, serviceDate, description, cost, provider, mileage, status, nextServiceDate } = req.body;

  if (!vehicleId || !description) {
    return res.status(400).json({ error: 'Vehicle ID and Description are required' });
  }

  const newService = {
    id: `s_${Date.now()}`,
    vehicleId,
    serviceDate: serviceDate || new Date().toISOString().split('T')[0],
    description,
    cost: Number(cost) || 0,
    provider: provider || 'Garage Center',
    mileage: Number(mileage) || 0,
    status: status || 'Completed',
    nextServiceDate: nextServiceDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  store.services = [newService, ...(store.services || [])];

  // Update vehicle's next service date & mileage if provided
  const vIndex = (store.vehicles || []).findIndex(v => v.id === vehicleId);
  if (vIndex !== -1) {
    if (nextServiceDate) store.vehicles[vIndex].nextService = nextServiceDate;
    if (mileage && Number(mileage) > store.vehicles[vIndex].mileage) {
      store.vehicles[vIndex].mileage = Number(mileage);
    }
  }

  writeStore(store);
  res.status(201).json(newService);
});

// DELETE service record
router.delete('/:id', (req, res) => {
  const store = readStore();
  const initialLength = (store.services || []).length;
  store.services = (store.services || []).filter(s => s.id !== req.params.id);

  if (store.services.length === initialLength) {
    return res.status(404).json({ error: 'Service record not found' });
  }

  writeStore(store);
  res.json({ message: 'Service record deleted', id: req.params.id });
});

export default router;