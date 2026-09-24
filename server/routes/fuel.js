import express from 'express';
import { readStore, writeStore } from '../store.js';

const router = express.Router();

// GET all fuel logs (optional ?vehicleId= query param)
router.get('/', (req, res) => {
  const store = readStore();
  let fuel = store.fuel || [];
  if (req.query.vehicleId) {
    fuel = fuel.filter(f => f.vehicleId === req.query.vehicleId);
  }
  res.json(fuel);
});

// POST add fuel entry
router.post('/', (req, res) => {
  const store = readStore();
  const { vehicleId, date, liters, totalCost, pricePerLiter, odometerReading, station } = req.body;

  if (!vehicleId || !liters || !totalCost) {
    return res.status(400).json({ error: 'Vehicle ID, Liters, and Total Cost are required' });
  }

  const numLiters = Number(liters);
  const numTotalCost = Number(totalCost);
  const calculatedPPL = pricePerLiter ? Number(pricePerLiter) : (numTotalCost / numLiters).toFixed(2);

  const newFuelEntry = {
    id: `f_${Date.now()}`,
    vehicleId,
    date: date || new Date().toISOString().split('T')[0],
    liters: numLiters,
    totalCost: numTotalCost,
    pricePerLiter: Number(calculatedPPL),
    odometerReading: Number(odometerReading) || 0,
    station: station || 'Petrol Station'
  };

  store.fuel = [newFuelEntry, ...(store.fuel || [])];

  // Update vehicle mileage if higher
  const vIndex = (store.vehicles || []).findIndex(v => v.id === vehicleId);
  if (vIndex !== -1 && odometerReading && Number(odometerReading) > store.vehicles[vIndex].mileage) {
    store.vehicles[vIndex].mileage = Number(odometerReading);
  }

  writeStore(store);
  res.status(201).json(newFuelEntry);
});

// DELETE fuel entry
router.delete('/:id', (req, res) => {
  const store = readStore();
  const initialLength = (store.fuel || []).length;
  store.fuel = (store.fuel || []).filter(f => f.id !== req.params.id);

  if (store.fuel.length === initialLength) {
    return res.status(404).json({ error: 'Fuel entry not found' });
  }

  writeStore(store);
  res.json({ message: 'Fuel entry deleted', id: req.params.id });
});

export default router;
