import express from 'express';
import { readStore, writeStore } from '../store.js';

const router = express.Router();

// GET all vehicles
router.get('/', (req, res) => {
  const store = readStore();
  res.json(store.vehicles || []);
});

// GET single vehicle by ID
router.get('/:id', (req, res) => {
  const store = readStore();
  const vehicle = (store.vehicles || []).find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // Attach related services, fuel logs, and files
  const services = (store.services || []).filter(s => s.vehicleId === vehicle.id);
  const fuel = (store.fuel || []).filter(f => f.vehicleId === vehicle.id);
  const files = (store.files || []).filter(f => f.vehicleId === vehicle.id);

  res.json({
    ...vehicle,
    services,
    fuel,
    files
  });
});

// POST create vehicle
router.post('/', (req, res) => {
  const store = readStore();
  const { name, make, model, type, year, vin, licensePlate, color, mileage, nextService, image } = req.body;

  if (!name || !make || !model) {
    return res.status(400).json({ error: 'Name, Make, and Model are required' });
  }

  const newVehicle = {
    id: `v_${Date.now()}`,
    name,
    make,
    model,
    type: type || 'Car',
    year: Number(year) || new Date().getFullYear(),
    vin: vin || `VIN-${Date.now()}`,
    licensePlate: licensePlate || 'N/A',
    color: color || 'Silver',
    mileage: Number(mileage) || 0,
    nextService: nextService || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    image: image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'
  };

  store.vehicles = [newVehicle, ...(store.vehicles || [])];
  writeStore(store);

  res.status(201).json(newVehicle);
});

// PUT update vehicle
router.put('/:id', (req, res) => {
  const store = readStore();
  const index = (store.vehicles || []).findIndex(v => v.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  store.vehicles[index] = {
    ...store.vehicles[index],
    ...req.body,
    id: req.params.id
  };

  writeStore(store);
  res.json(store.vehicles[index]);
});

// DELETE vehicle
router.delete('/:id', (req, res) => {
  const store = readStore();
  const initialLength = (store.vehicles || []).length;
  store.vehicles = (store.vehicles || []).filter(v => v.id !== req.params.id);

  if (store.vehicles.length === initialLength) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // Cleanup associated records
  store.services = (store.services || []).filter(s => s.vehicleId !== req.params.id);
  store.fuel = (store.fuel || []).filter(f => f.vehicleId !== req.params.id);
  store.files = (store.files || []).filter(f => f.vehicleId !== req.params.id);

  writeStore(store);
  res.json({ message: 'Vehicle deleted successfully', id: req.params.id });
});

export default router;