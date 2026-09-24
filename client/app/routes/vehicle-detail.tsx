import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddServiceModal from "../components/AddServiceModal";
import AddFuelModal from "../components/AddFuelModal";
import FileUploadModal from "../components/FileUploadModal";
import { fetchVehicleById, deleteDocument, API_BASE } from "../api";
import {
  Car,
  Bike,
  Wrench,
  Fuel,
  FileText,
  Calendar,
  Gauge,
  Plus,
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  ShieldCheck
} from "lucide-react";

export function meta() {
  return [{ title: "Vehicle Workspace | Personal Garage" }];
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "fuel" | "documents">("overview");

  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const loadVehicleDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchVehicleById(id);
      setVehicle(data);
    } catch (err) {
      console.error("Failed to fetch vehicle details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicleDetails();
  }, [id]);

  const handleDeleteDoc = async (fileId: string, name: string) => {
    if (confirm(`Delete document "${name}"?`)) {
      try {
        await deleteDocument(fileId);
        loadVehicleDetails();
      } catch (err) {
        alert("Failed to delete file.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#18181B] text-slate-200">
        <Sidebar />
        <div className="flex-1 p-8 text-center text-slate-400">Loading vehicle details...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen bg-[#18181B] text-slate-200">
        <Sidebar />
        <div className="flex-1 p-8 text-center text-slate-400 space-y-4">
          <p>Vehicle not found.</p>
          <Link to="/vehicles" className="text-blue-400 font-semibold hover:underline">
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={`${vehicle.name} Workspace`}
          onOpenAddService={() => setIsServiceModalOpen(true)}
          onOpenAddFuel={() => setIsFuelModalOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Back Navigation & Header Banner */}
          <div>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Garage Vehicles</span>
            </Link>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{vehicle.name}</h1>
                    <span className="px-3 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                      {vehicle.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.color}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                    <span>Plate: {vehicle.licensePlate || "N/A"}</span>
                    <span>•</span>
                    <span>VIN: {vehicle.vin || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsFuelModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Fuel className="w-4 h-4 text-emerald-400" />
                  <span>Log Fuel</span>
                </button>
                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Record Service</span>
                </button>
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Doc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: "overview", label: "Overview & Specs", icon: Car },
              { id: "services", label: `Service Records (${vehicle.services?.length || 0})`, icon: Wrench },
              { id: "fuel", label: `Fuel Logs (${vehicle.fuel?.length || 0})`, icon: Fuel },
              { id: "documents", label: `Documents Vault (${vehicle.files?.length || 0})`, icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                    isActive
                      ? "border-blue-500 text-blue-400 bg-slate-900/40"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Current Odometer</span>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {(vehicle.mileage || 0).toLocaleString()} km
                    </span>
                  </div>
                </div>

                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Next Service Due</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span className="text-2xl font-bold text-white">
                      {vehicle.nextService || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Documents On File</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-2xl font-bold text-white">
                      {vehicle.files?.length || 0} Vault Docs
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white">Technical Specs & Identification</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block font-semibold mb-1">Make / Brand</span>
                    <span className="text-white font-bold text-sm">{vehicle.make}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block font-semibold mb-1">Model Variant</span>
                    <span className="text-white font-bold text-sm">{vehicle.model}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block font-semibold mb-1">Year of Manufacture</span>
                    <span className="text-white font-bold text-sm">{vehicle.year}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block font-semibold mb-1">Exterior Color</span>
                    <span className="text-white font-bold text-sm">{vehicle.color || "Silver"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Service Records */}
          {activeTab === "services" && (
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Service History</h3>
                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service Entry</span>
                </button>
              </div>

              {vehicle.services?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No service records logged yet for {vehicle.name}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Provider</th>
                        <th className="p-3">Odometer</th>
                        <th className="p-3">Cost</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {vehicle.services.map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-semibold text-slate-300">{s.serviceDate}</td>
                          <td className="p-3 text-white font-medium">{s.description}</td>
                          <td className="p-3 text-slate-400">{s.provider}</td>
                          <td className="p-3 text-slate-300">{(s.mileage || 0).toLocaleString()} km</td>
                          <td className="p-3 text-emerald-400 font-bold">₹{(s.cost || 0).toLocaleString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Fuel Logs */}
          {activeTab === "fuel" && (
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Fuel Fill-Up History</h3>
                <button
                  onClick={() => setIsFuelModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Fuel Fill</span>
                </button>
              </div>

              {vehicle.fuel?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No fuel logs recorded yet for {vehicle.name}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="p-3">Date</th>
                        <th className="p-3">Volume (Liters)</th>
                        <th className="p-3">Price / Liter</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Odometer</th>
                        <th className="p-3">Station</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {vehicle.fuel.map((f: any) => (
                        <tr key={f.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-semibold text-slate-300">{f.date}</td>
                          <td className="p-3 text-white font-medium">{f.liters} L</td>
                          <td className="p-3 text-slate-400">₹{f.pricePerLiter}</td>
                          <td className="p-3 text-emerald-400 font-bold">₹{(f.totalCost || 0).toLocaleString()}</td>
                          <td className="p-3 text-slate-300">{(f.odometerReading || 0).toLocaleString()} km</td>
                          <td className="p-3 text-slate-400">{f.station}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Documents Vault */}
          {activeTab === "documents" && (
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Document Vault & Certificates</h3>
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              {vehicle.files?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No documents uploaded yet for this vehicle.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.files.map((file: any) => (
                    <div
                      key={file.id}
                      className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-lg shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate">{file.originalName}</h4>
                          <p className="text-[11px] text-sky-400 font-medium">{file.docType}</p>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Uploaded {file.uploadDate} • {file.fileSize}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`${API_BASE}${file.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                          title="View / Download File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteDoc(file.id, file.originalName)}
                          className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={loadVehicleDetails}
        vehicles={[vehicle]}
        defaultVehicleId={vehicle.id}
      />
      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        onSuccess={loadVehicleDetails}
        vehicles={[vehicle]}
        defaultVehicleId={vehicle.id}
      />
      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSuccess={loadVehicleDetails}
        vehicles={[vehicle]}
        defaultVehicleId={vehicle.id}
      />
    </div>
  );
}
