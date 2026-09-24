import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Initial Seed Data based on archive document & revvheadz UI templates
const INITIAL_DATA = {
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
      pricePerLiter: 105.6,
      odometerReading: 24200,
      station: "Shell Fuel Station"
    },
    {
      id: "f2",
      vehicleId: "v2",
      date: "2026-09-05",
      liters: 35.0,
      totalCost: 3675,
      pricePerLiter: 105.0,
      odometerReading: 41800,
      station: "Indian Oil Petrol Pump"
    },
    {
      id: "f3",
      vehicleId: "v3",
      date: "2026-09-10",
      liters: 45.0,
      totalCost: 5040,
      pricePerLiter: 112.0,
      odometerReading: 18450,
      station: "HP Petrol Pump"
    }
  ],
  files: [
    {
      id: "doc1",
      vehicleId: "v1",
      fileName: "ns200_insurance_2026.pdf",
      originalName: "Pulsar_NS200_Insurance_Policy.pdf",
      fileUrl: "/uploads/sample_insurance.pdf",
      docType: "Insurance Policy",
      fileSize: "1.2 MB",
      uploadDate: "2026-01-15"
    },
    {
      id: "doc2",
      vehicleId: "v2",
      fileName: "i20_registration_certificate.pdf",
      originalName: "Hyundai_i20_RC_SmartCard.pdf",
      fileUrl: "/uploads/sample_rc.pdf",
      docType: "Registration Certificate (RC)",
      fileSize: "850 KB",
      uploadDate: "2026-02-10"
    }
  ]
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure store.json exists
if (!fs.existsSync(STORE_FILE)) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
}

export function readStore() {
  try {
    const data = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading store.json, using fallback initial data:", err);
    return INITIAL_DATA;
  }
}

export function writeStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing store.json:", err);
  }
}
