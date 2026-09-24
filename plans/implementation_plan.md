# Personal Garage Full-Stack Web Application Implementation Plan

Bridge the old project archive (`personal-garage-website-code.md`) and the existing HTML designs in `revvheadz/` into a complete, fully functional full-stack web application powered by **Express (Backend)** and **React Router v7 + Vite + TailwindCSS (Frontend)**.

---

## User Review Required

> [!IMPORTANT]
> - **Database Strategy**: We will implement an Express storage engine that seamlessly connects to **SQL Server** if available (using `server/db.js`), with an automatic local file/in-memory fallback store (`server/data/store.json`). This ensures the app runs 100% reliably out of the box locally without failing when SQL Server is offline.
> - **File Upload Storage**: File uploads (RC, Insurance, Service Receipts) will be stored in `server/uploads/` via `multer` with proper file validation (PDF, JPG, PNG, WEBP) and served statically over `/uploads/...`.

---

## Proposed Changes

### Backend API Component (`server/`)

#### [MODIFY] [index.js](file:///d:/Armaan/personal%20garage%20web/server/index.js)
- Update main Express server to incorporate modular router endpoints for `/api/vehicles`, `/api/services`, `/api/fuel`, `/api/files`, and `/api/analytics`.
- Add static directory serving for `server/uploads`.
- Add `/health` check route.
- Ensure proper CORS configuration allowing requests from `http://localhost:5173`.

#### [NEW] [store.js](file:///d:/Armaan/personal%20garage%20web/server/store.js)
- Create a data persistence layer that manages vehicles, service records, fuel logs, document attachments, and analytics calculations, connecting to SQL Server when configured and falling back gracefully to local persistence.

#### [NEW] [routes/vehicles.js](file:///d:/Armaan/personal%20garage%20web/server/routes/vehicles.js)
- `GET /api/vehicles`: Get all vehicles with calculated next service date and total fuel cost.
- `GET /api/vehicles/:id`: Get detailed single vehicle data with service history, fuel records, and uploaded files.
- `POST /api/vehicles`: Add a new vehicle (make, model, year, VIN, type, license plate, color, image).
- `PUT /api/vehicles/:id`: Update vehicle details.
- `DELETE /api/vehicles/:id`: Delete a vehicle.

#### [NEW] [routes/services.js](file:///d:/Armaan/personal%20garage%20web/server/routes/services.js)
- `GET /api/services`: List all service records (filtered optional by `vehicleId`).
- `POST /api/services`: Add a service record (vehicleId, date, description, cost, provider, mileage, status, nextServiceDate).
- `DELETE /api/services/:id`: Remove service entry.

#### [NEW] [routes/fuel.js](file:///d:/Armaan/personal%20garage%20web/server/routes/fuel.js)
- `GET /api/fuel`: List all fuel logs.
- `POST /api/fuel`: Add a new fuel entry (vehicleId, date, liters, totalCost, pricePerLiter, odometerReading, fuelStation).

#### [NEW] [routes/files.js](file:///d:/Armaan/personal%20garage%20web/server/routes/files.js)
- `POST /api/files/upload`: Multer file upload for vehicle documents (insurance, RC, receipts, vehicle photos).
- `GET /api/files/vehicle/:vehicleId`: Retrieve all documents uploaded for a vehicle.
- `DELETE /api/files/:id`: Remove a document file.

#### [NEW] [routes/analytics.js](file:///d:/Armaan/personal%20garage%20web/server/routes/analytics.js)
- `GET /api/analytics`: Overview stats including total monthly fuel costs, mileage trends, total service expenditure, and upcoming service countdowns.

---

### Frontend Component (`client/`)

#### [MODIFY] [routes.ts](file:///d:/Armaan/personal%20garage%20web/client/app/routes.ts)
- Add route configurations for:
  - `/` -> Dashboard
  - `/vehicles` -> Vehicles Overview & Management
  - `/vehicles/:id` -> Single Vehicle Details (Specs, Services, Fuel, Documents)
  - `/service` -> Service History & Maintenance Tracker
  - `/fuel` -> Fuel Logs & Mileage Efficiency
  - `/analytics` -> Reports & Cost Analytics
  - `/profile` -> Profile & Settings

#### [NEW] [components/Sidebar.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/Sidebar.tsx)
- Sleek dark navigation sidebar matching the `revvheadz` theme (`#111418`) with navigation links, logo, user profile summary, and active tab highlights.

#### [NEW] [components/Navbar.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/Navbar.tsx)
- Top header with search bar, notifications icon, quick "Add Vehicle" / "Add Record" modal triggers.

#### [NEW] [components/AddVehicleModal.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/AddVehicleModal.tsx)
- Modal dialog to register cars/bikes with details (Make, Model, Year, VIN, Type, Mileage, Plate #).

#### [NEW] [components/AddServiceModal.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/AddServiceModal.tsx)
- Modal dialog to record maintenance / oil change / tire replacement with cost & next service due date.

#### [NEW] [components/AddFuelModal.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/AddFuelModal.tsx)
- Modal dialog to record fuel fill-ups with liters, price, odometer reading.

#### [NEW] [components/FileUploadModal.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/components/FileUploadModal.tsx)
- Upload documents (RC, Insurance, Receipts) linked to a specific vehicle.

#### [NEW] [routes/home.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/home.tsx) (Dashboard)
- Full dashboard displaying active vehicles, key statistics (Monthly Fuel Cost, Mileage Trend, Pending Services), and quick action cards.

#### [NEW] [routes/vehicles.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/vehicles.tsx)
- Vehicle fleet view with grid of vehicle cards, status filters (Car / Bike / Active / Maintenance), and action drawers.

#### [NEW] [routes/vehicle-detail.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/vehicle-detail.tsx)
- Comprehensive vehicle workspace showing specs, maintenance history table, fuel efficiency log, and document attachment vault.

#### [NEW] [routes/service.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/service.tsx)
- Dedicated service log view with filtering by date/vehicle and upcoming maintenance reminders.

#### [NEW] [routes/fuel.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/fuel.tsx)
- Dedicated fuel expense & distance tracker with efficiency calculation.

#### [NEW] [routes/analytics.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/analytics.tsx)
- Financial & vehicle performance reports with cost breakdowns.

#### [NEW] [routes/profile.tsx](file:///d:/Armaan/personal%20garage%20web/client/app/routes/profile.tsx)
- User profile & settings dashboard.

---

## Verification Plan

### Automated Verification
- Verify backend API endpoints with HTTP requests (`GET /health`, `GET /api/vehicles`, `POST /api/vehicles`, `POST /api/services`, `POST /api/fuel`, `POST /api/files/upload`).
- Run TypeScript type checks on `client/` using `npm run typecheck`.

### Manual Verification
- Verify full navigation in browser across Dashboard, Vehicles, Vehicle Details, Service, Fuel, Reports, and Settings.
- Test adding a vehicle, adding a service record, logging fuel, and uploading a document file.
