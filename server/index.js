import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import vehiclesRouter from "./routes/vehicles.js";
import servicesRouter from "./routes/services.js";
import fuelRouter from "./routes/fuel.js";
import filesRouter from "./routes/files.js";
import analyticsRouter from "./routes/analytics.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health Check Route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Virtual Garage API",
    timestamp: new Date().toISOString()
  });
});

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("🚗 Personal Garage Backend API is running on http://localhost:" + PORT);
});

// ✅ Modular API Routes
app.use("/vehicles", vehiclesRouter);
app.use("/services", servicesRouter);
app.use("/fuel", fuelRouter);
app.use("/files", filesRouter);
app.use("/analytics", analyticsRouter);

app.listen(PORT, () => {
  console.log(`✅ RevvHeadz API running on http://localhost:${PORT}`);
});
