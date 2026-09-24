const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050';

const MOCK_DATA = {
  vehicles: [
    {
      id: "v1",
      name: "Pulsar NS200",
      make: "Bajaj",
      model: "Pulsar NS200",
      type: "Bike",
      year: 2015,
      vin: "NS200-2015-88492",
      licensePlate: "MH-12-AB-1234",
      color: "Pewter Grey",
      mileage: 24500,
      nextService: "2026-10-15",
      status: "Active",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v2",
      name: "Hyundai i20",
      make: "Hyundai",
      model: "i20 Asta",
      type: "Car",
      year: 2020,
      vin: "HYUN-I20-2020-55912",
      licensePlate: "MH-14-CD-5678",
      color: "Polar White",
      mileage: 42000,
      nextService: "2026-11-01",
      status: "Active",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v3",
      name: "BMW 3 Series",
      make: "BMW",
      model: "330i M Sport",
      type: "Car",
      year: 2022,
      vin: "WBA-BMW-2022-99120",
      licensePlate: "MH-12-EF-9999",
      color: "Portimao Blue",
      mileage: 18500,
      nextService: "2026-12-10",
      status: "Active",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "v4",
      name: "SX4",
      make: "Maruti Suzuki",
      model: "SX4 ZXi",
      type: "Car",
      year: 2013,
      vin: "MS-SX4-2013-10294",
      licensePlate: "MH-02-BZ-0453",
      color: "Azure Grey",
      mileage: 85010,
      nextService: "2027-03-14",
      status: "Active",
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80"
    }
  ],
  services: [
    {
      id: "s1",
      vehicleId: "v1",
      serviceDate: "2026-03-10",
      description: "Full Engine Oil Change & Chain Lubrication",
      cost: 1500,
      provider: "Bajaj Authorized Service",
      mileage: 23000,
      status: "Completed",
      nextServiceDate: "2026-10-15"
    },
    {
      id: "s2",
      vehicleId: "v2",
      serviceDate: "2026-05-20",
      description: "Brake Pad Replacement & Periodic Maintenance",
      cost: 4500,
      provider: "Hyundai Care Center",
      mileage: 40000,
      status: "Completed",
      nextServiceDate: "2026-11-01"
    },
    {
      id: "s3",
      vehicleId: "v3",
      serviceDate: "2026-06-15",
      description: "Annual Synthetic Oil Change & Wheel Alignment",
      cost: 12000,
      provider: "BMW Official Garage",
      mileage: 17000,
      status: "Completed",
      nextServiceDate: "2026-12-10"
    }
  ],
  fuel: [
    {
      id: "f1",
      vehicleId: "v1",
      date: "2026-09-01",
      liters: 12.5,
      totalCost: 1320,
      odometer: 24200,
      station: "HP Fuel Station"
    },
    {
      id: "f2",
      vehicleId: "v2",
      date: "2026-09-12",
      liters: 35.0,
      totalCost: 3715,
      odometer: 41800,
      station: "Indian Oil Petrol Pump"
    },
    {
      id: "f3",
      vehicleId: "v3",
      date: "2026-09-18",
      liters: 45.0,
      totalCost: 5000,
      odometer: 18400,
      station: "Shell Fuel Station"
    }
  ],
  analytics: {
    totalVehicles: 4,
    monthlyFuelSpend: 10035,
    lifetimeMaintenanceSpent: 18000,
    totalFleetOdometer: 85010,
    documentsCount: 2,
    breakdown: [
      { category: "Maintenance", cost: 18000, percentage: 64 },
      { category: "Fuel", cost: 10035, percentage: 36 }
    ]
  }
};

export async function fetchVehicles() {
  try {
    const res = await fetch(`${API_BASE}/vehicles`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (err) {
    console.warn("Using offline/fallback data for fetchVehicles");
    return MOCK_DATA.vehicles;
  }
}

export async function fetchVehicleById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    if (!res.ok) throw new Error('Failed to fetch vehicle');
    return await res.json();
  } catch (err) {
    console.warn("Using offline/fallback data for fetchVehicleById");
    const vehicle = MOCK_DATA.vehicles.find(v => v.id === id) || MOCK_DATA.vehicles[0];
    const services = MOCK_DATA.services.filter(s => s.vehicleId === vehicle.id);
    const fuel = MOCK_DATA.fuel.filter(f => f.vehicleId === vehicle.id);
    return { ...vehicle, services, fuel, files: [] };
  }
}

export async function createVehicle(data: any) {
  try {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create vehicle');
    return await res.json();
  } catch (err) {
    const newVehicle = { id: `v_${Date.now()}`, ...data, status: 'Active' };
    MOCK_DATA.vehicles.unshift(newVehicle);
    return newVehicle;
  }
}

export async function deleteVehicle(id: string) {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete vehicle');
    return await res.json();
  } catch (err) {
    MOCK_DATA.vehicles = MOCK_DATA.vehicles.filter(v => v.id !== id);
    return { message: 'Vehicle deleted', id };
  }
}

export async function fetchServices(vehicleId?: string) {
  try {
    const url = vehicleId ? `${API_BASE}/services?vehicleId=${vehicleId}` : `${API_BASE}/services`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch services');
    return await res.json();
  } catch (err) {
    if (vehicleId) {
      return MOCK_DATA.services.filter(s => s.vehicleId === vehicleId);
    }
    return MOCK_DATA.services;
  }
}

export async function createService(data: any) {
  try {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to record service');
    return await res.json();
  } catch (err) {
    const newService = { id: `s_${Date.now()}`, ...data, status: 'Completed' };
    MOCK_DATA.services.unshift(newService);
    return newService;
  }
}

export async function fetchFuelLogs(vehicleId?: string) {
  try {
    const url = vehicleId ? `${API_BASE}/fuel?vehicleId=${vehicleId}` : `${API_BASE}/fuel`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch fuel logs');
    return await res.json();
  } catch (err) {
    if (vehicleId) {
      return MOCK_DATA.fuel.filter(f => f.vehicleId === vehicleId);
    }
    return MOCK_DATA.fuel;
  }
}

export async function createFuelLog(data: any) {
  try {
    const res = await fetch(`${API_BASE}/fuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to log fuel');
    return await res.json();
  } catch (err) {
    const newFuel = { id: `f_${Date.now()}`, ...data };
    MOCK_DATA.fuel.unshift(newFuel);
    return newFuel;
  }
}

export async function uploadDocument(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return await res.json();
  } catch (err) {
    return { id: `file_${Date.now()}`, filename: "uploaded_doc.pdf", url: "#" };
  }
}

export async function deleteDocument(id: string) {
  try {
    const res = await fetch(`${API_BASE}/files/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return await res.json();
  } catch (err) {
    return { message: 'Document deleted', id };
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    return MOCK_DATA.analytics;
  }
}

export { API_BASE };

