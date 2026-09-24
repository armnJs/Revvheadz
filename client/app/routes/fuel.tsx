import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddFuelModal from "../components/AddFuelModal";
import { fetchFuelLogs, fetchVehicles } from "../api";
import { Fuel, Plus, Search, TrendingUp, DollarSign } from "lucide-react";

export function meta() {
  return [
    { title: "Fuel Tracker | Personal Garage" },
    { name: "description", content: "Track fuel fill-ups, petrol expenses, and mileage efficiency across your vehicles." },
  ];
}

export default function FuelPage() {
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVehicle, setFilterVehicle] = useState("ALL");
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fData, vData] = await Promise.all([fetchFuelLogs(), fetchVehicles()]);
      setFuelLogs(fData);
      setVehicles(vData);
    } catch (err) {
      console.error("Failed to load fuel logs:", err);
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

  const filteredLogs = fuelLogs.filter((f) => {
    if (filterVehicle !== "ALL" && f.vehicleId !== filterVehicle) return false;
    return true;
  });

  const totalLitres = filteredLogs.reduce((acc, f) => acc + (Number(f.liters) || 0), 0);
  const totalCost = filteredLogs.reduce((acc, f) => acc + (Number(f.totalCost) || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Fuel Fill & Expenses Tracker" onOpenAddFuel={() => setIsFuelModalOpen(true)} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header Banner & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Fuel className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold">Total Fuel Volume</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{totalLitres.toFixed(1)} Liters</h3>
              </div>
            </div>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-semibold">Total Fuel Expenditure</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">₹{totalCost.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold">Logged Fill-Ups</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{filteredLogs.length} Records</h3>
              </div>
              <button
                onClick={() => setIsFuelModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Fill</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-[#111418] p-4 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Filter by Vehicle:</span>
              <select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="ALL">All Vehicles ({vehicles.length})</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fuel Logs Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-[#111418] rounded-2xl border border-slate-800">
              Loading fuel logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center bg-[#111418] rounded-2xl border border-slate-800 space-y-3">
              <Fuel className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Fuel Fill-Ups Logged</h3>
              <p className="text-slate-400 text-xs">
                Log your gas fill-ups to track monthly expenses and calculate fuel mileage.
              </p>
            </div>
          ) : (
            <div className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60 font-semibold">
                      <th className="p-4">Date</th>
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Volume (Liters)</th>
                      <th className="p-4">Price / Liter</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Odometer Reading</th>
                      <th className="p-4">Gas Station</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLogs.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-semibold text-slate-300">{f.date}</td>
                        <td className="p-4 font-bold text-white">{getVehicleName(f.vehicleId)}</td>
                        <td className="p-4 text-emerald-400 font-medium">{f.liters} L</td>
                        <td className="p-4 text-slate-400">₹{f.pricePerLiter}</td>
                        <td className="p-4 text-emerald-400 font-bold">₹{(f.totalCost || 0).toLocaleString()}</td>
                        <td className="p-4 text-slate-300 font-mono">{(f.odometerReading || 0).toLocaleString()} km</td>
                        <td className="p-4 text-slate-400">{f.station}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddFuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        onSuccess={loadData}
        vehicles={vehicles}
      />
    </div>
  );
}
