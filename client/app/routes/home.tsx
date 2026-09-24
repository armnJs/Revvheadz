import { useEffect, useState } from "react";
import { Link } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddVehicleModal from "../components/AddVehicleModal";
import AddServiceModal from "../components/AddServiceModal";
import AddFuelModal from "../components/AddFuelModal";
import { fetchVehicles, fetchAnalytics } from "../api";
import {
  Car,
  Bike,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
  AlertCircle
} from "lucide-react";

export function meta() {
  return [
    { title: "RevvHeadz | Virtual Personal Garage Dashboard" },
    { name: "description", content: "Manage your virtual vehicle garage, maintenance schedules, and fuel logs." },
  ];
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vData, aData] = await Promise.all([
        fetchVehicles(),
        fetchAnalytics()
      ]);
      setVehicles(vData);
      setAnalytics(aData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar onOpenAddVehicle={() => setIsVehicleModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title="Dashboard"
          onOpenAddVehicle={() => setIsVehicleModalOpen(true)}
          onOpenAddService={() => setIsServiceModalOpen(true)}
          onOpenAddFuel={() => setIsFuelModalOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Welcome back, Sophia! 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Here is your garage status and upcoming vehicle maintenance schedules.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFuelModalOpen(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <Fuel className="w-4 h-4 text-emerald-400" />
                <span>Log Fuel</span>
              </button>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Fleet</span>
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white">{analytics?.totalVehicles ?? vehicles.length}</span>
                <span className="text-xs text-slate-400 ml-2 font-medium">Vehicles Registered</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                <Car className="w-3.5 h-3.5" />
                <span>Ready for roadtrip</span>
              </div>
            </div>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Fuel Spend</span>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Fuel className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white">₹{analytics?.monthlyFuelCost?.toLocaleString() ?? 5600}</span>
                <span className="text-xs text-emerald-400 font-semibold ml-2">Estimated</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Tracked across all vehicles</span>
              </div>
            </div>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Maintenance Spent</span>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white">₹{analytics?.totalServiceSpent?.toLocaleString() ?? 18000}</span>
                <span className="text-xs text-slate-400 ml-2 font-medium">Total Lifetime</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Serviced regularly</span>
              </div>
            </div>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fleet Odometer</span>
                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                  <Gauge className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white">{analytics?.totalMileage?.toLocaleString() ?? 85000}</span>
                <span className="text-xs text-slate-400 ml-2 font-medium">km Total</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>{analytics?.totalDocuments ?? 2} Documents Uploaded</span>
              </div>
            </div>
          </div>

          {/* Active Vehicles Fleet */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-500" />
                <span>My Virtual Garage Fleet</span>
              </h2>
              <Link
                to="/vehicles"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>View All ({vehicles.length})</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 bg-[#111418] rounded-2xl border border-slate-800">
                Loading garage vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="p-12 text-center bg-[#111418] rounded-2xl border border-slate-800 space-y-3">
                <Car className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-white font-bold text-base">No Vehicles in Garage</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Start by adding your bike, car, or scooter to track maintenance, service records, and fuel logs.
                </p>
                <button
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Vehicle</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
                  >
                    <div className="h-44 relative bg-slate-900 overflow-hidden">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e: any) => {
                          e.target.src = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                        {v.type === "Bike" ? <Bike className="w-3.5 h-3.5 text-blue-400" /> : <Car className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{v.type}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-500/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {v.status || "Active"}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {v.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {v.year} {v.make} {v.model}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-semibold">Plate #</span>
                          <span className="text-slate-200 font-medium truncate block">{v.licensePlate || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-semibold">Odometer</span>
                          <span className="text-slate-200 font-medium block">{(v.mileage || 0).toLocaleString()} km</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {v.nextService || "Not set"}</span>
                        </div>
                        <Link
                          to={`/vehicles/${v.id}`}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg font-semibold text-xs transition-all flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance & Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Reminders */}
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>Maintenance Reminders</span>
                </h3>
                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  + Add Service Log
                </button>
              </div>

              <div className="space-y-3">
                {vehicles.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{v.name} Periodic Inspection</h4>
                        <p className="text-xs text-slate-400">Scheduled Date: {v.nextService || "2026-11-15"}</p>
                      </div>
                    </div>
                    <Link
                      to={`/vehicles/${v.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Fuel Logs Overview */}
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-emerald-400" />
                  <span>Garage Quick Log Vault</span>
                </h3>
                <button
                  onClick={() => setIsFuelModalOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  + Log Fuel Fill
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-left transition-all group"
                >
                  <Car className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-white">Add New Vehicle</h4>
                  <p className="text-xs text-slate-400 mt-1">Register cars or bikes</p>
                </button>

                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="p-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl text-left transition-all group"
                >
                  <Wrench className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-sm font-bold text-white">Log Maintenance</h4>
                  <p className="text-xs text-slate-400 mt-1">Oil change, repair, parts</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSuccess={loadData}
      />
      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={loadData}
        vehicles={vehicles}
      />
      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        onSuccess={loadData}
        vehicles={vehicles}
      />
    </div>
  );
}
