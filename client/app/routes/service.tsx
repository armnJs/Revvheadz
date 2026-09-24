import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddServiceModal from "../components/AddServiceModal";
import { fetchServices, fetchVehicles } from "../api";
import { Wrench, Plus, Calendar, Search, Filter } from "lucide-react";

export function meta() {
  return [
    { title: "Service History & Maintenance | Personal Garage" },
    { name: "description", content: "Track maintenance history, repair logs, and upcoming service schedules." },
  ];
}

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVehicle, setFilterVehicle] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, vData] = await Promise.all([fetchServices(), fetchVehicles()]);
      setServices(sData);
      setVehicles(vData);
    } catch (err) {
      console.error("Failed to load service logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getVehicleName = (vId: string) => {
    const v = vehicles.find((item) => item.id === vId);
    return v ? `${v.name} (${v.make} ${v.model})` : "Vehicle";
  };

  const filteredServices = services.filter((s) => {
    if (filterVehicle !== "ALL" && s.vehicleId !== filterVehicle) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      return (
        s.description.toLowerCase().includes(q) ||
        (s.provider && s.provider.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Service & Maintenance History" onOpenAddService={() => setIsServiceModalOpen(true)} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header Bar & Action Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111418] p-5 border border-slate-800 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Maintenance Logs</h1>
                <p className="text-xs text-slate-400">
                  {services.length} Service Entries Logged
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="ALL">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-32"
                />
              </div>

              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Service</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-[#111418] rounded-2xl border border-slate-800">
              Loading service logs...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center bg-[#111418] rounded-2xl border border-slate-800 space-y-3">
              <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Service Entries Found</h3>
              <p className="text-slate-400 text-xs">
                Log regular oil changes, tire replacements, or mechanical inspections to keep your garage updated.
              </p>
            </div>
          ) : (
            <div className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60 font-semibold">
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Service Date</th>
                      <th className="p-4">Service Description</th>
                      <th className="p-4">Provider / Workshop</th>
                      <th className="p-4">Odometer</th>
                      <th className="p-4">Cost</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredServices.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-bold text-white">{getVehicleName(s.vehicleId)}</td>
                        <td className="p-4 text-slate-300 font-medium">{s.serviceDate}</td>
                        <td className="p-4 text-slate-200">{s.description}</td>
                        <td className="p-4 text-slate-400">{s.provider || "Garage Workshop"}</td>
                        <td className="p-4 text-slate-300 font-mono">{(s.mileage || 0).toLocaleString()} km</td>
                        <td className="p-4 text-emerald-400 font-bold">₹{(s.cost || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                            {s.status || "Completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={loadData}
        vehicles={vehicles}
      />
    </div>
  );
}
