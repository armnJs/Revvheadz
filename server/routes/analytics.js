import express from 'express';
import { readStore } from '../store.js';

const router = express.Router();

// GET analytics overview
router.get('/', (req, res) => {
  const store = readStore();
  const vehicles = store.vehicles || [];
  const services = store.services || [];
  const fuel = store.fuel || [];
  const files = store.files || [];

  // Total calculations
  const totalVehicles = vehicles.length;
  const totalServiceSpent = services.reduce((acc, s) => acc + (Number(s.cost) || 0), 0);
  const totalFuelSpent = fuel.reduce((acc, f) => acc + (Number(f.totalCost) || 0), 0);
  const totalDocuments = files.length;

  // Monthly fuel cost calculation (fuel entries in the last 30 days or current month)
  const currentMonth = new Date().getMonth();
  const monthlyFuelCost = fuel.reduce((acc, f) => {
    const d = new Date(f.date);
    if (!isNaN(d.getTime()) && d.getMonth() === currentMonth) {
      return acc + (Number(f.totalCost) || 0);
    }
    return acc;
  }, 0) || totalFuelSpent;

  // Upcoming maintenance count
  const today = new Date().toISOString().split('T')[0];
  const upcomingServices = vehicles.filter(v => v.nextService && v.nextService >= today);

  // Mileage trend (sum of all current vehicle mileages)
  const totalMileage = vehicles.reduce((acc, v) => acc + (Number(v.mileage) || 0), 0);

  res.json({
    totalVehicles,
    totalServiceSpent,
    totalFuelSpent,
    totalDocuments,
    monthlyFuelCost,
    totalMileage,
    upcomingServicesCount: upcomingServices.length,
    recentServices: services.slice(0, 5),
    recentFuelLogs: fuel.slice(0, 5)
  });
});

export default router;
