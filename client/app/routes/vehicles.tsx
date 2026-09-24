import { useEffect, useState } from "react";
import { Link } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddVehicleModal from "../components/AddVehicleModal";
import { fetchVehicles, deleteVehicle } from "../api";
import { Car, Bike, Plus, Search, Calendar, Wrench, Trash2, ArrowUpRight } from "lucide-react";

export function meta() {
  return [
    { title: "My Vehicles | Personal Garage" },
    { name: "description", content: "View and manage all registered vehicles in your personal garage." },
  ];
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    let result = vehicles;

    if (typeFilter !== "All") {
      result = result.filter((v) => v.type === typeFilter);
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.licensePlate && v.licensePlate.toLowerCase().includes(q))
      );
    }

    setFilteredVehicles(result);
  }, [search, typeFilter, vehicles]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from your garage?`)) {
      try {
        await deleteVehicle(id);
        loadVehicles();
      } catch (err) {
        alert("Failed to delete vehicle.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar onOpenAddVehicle={() => setIsVehicleModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="My Vehicles" onOpenAddVehicle={() => setIsVehicleModalOpen(true)} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111418] p-5 border border-slate-800 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Vehicles Workspace</h1>
                <p className="text-xs text-slate-400">
                  {vehicles.length} Total Registered Vehicles
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Type Filter Buttons */}
              <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                {["All", "Car", "Bike"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      typeFilter === t
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vehicle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                />
              </div>

              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 ml-auto sm:ml-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>

          {/* Vehicles List / Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-[#111418] rounded-2xl border border-slate-800">
              Loading garage fleet...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-12 text-center bg-[#111418] rounded-2xl border border-slate-800 space-y-3">
              <Car className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Matching Vehicles Found</h3>
              <p className="text-slate-400 text-xs">
                Try clearing your search query or add a new vehicle to your garage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
                >
                  <div className="h-48 relative bg-slate-900 overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                      {v.type === "Bike" ? (
                        <Bike className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Car className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>{v.type}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(v.id, v.name)}
                      className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {v.name}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {v.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {v.make} {v.model}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-500">License Plate:</span>
                        <span className="text-slate-200 font-semibold">{v.licensePlate || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Odometer:</span>
                        <span className="text-slate-200 font-semibold">{(v.mileage || 0).toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Color:</span>
                        <span className="text-slate-200 font-semibold">{v.color || "Silver"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {v.nextService || "N/A"}</span>
                      </div>
                      <Link
                        to={`/vehicles/${v.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg font-semibold text-xs shadow-md transition-all flex items-center gap-1"
                      >
                        <span>Manage Vehicle</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSuccess={loadVehicles}
      />
    </div>
  );
}
