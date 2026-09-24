import { useState } from "react";
import { X, Fuel, Sparkles } from "lucide-react";
import { createFuelLog } from "../api";

interface VehicleOption {
  id: string;
  name: string;
  make: string;
  model: string;
}

interface AddFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicles: VehicleOption[];
  defaultVehicleId?: string;
}

export default function AddFuelModal({
  isOpen,
  onClose,
  onSuccess,
  vehicles,
  defaultVehicleId = ""
}: AddFuelModalProps) {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ""));
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [liters, setLiters] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [station, setStation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !liters || !totalCost) {
      setError("Vehicle, Liters, and Total Cost are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createFuelLog({
        vehicleId,
        date,
        liters: parseFloat(liters),
        totalCost: parseFloat(totalCost),
        odometerReading: parseInt(odometerReading) || 0,
        station: station || "Fuel Pump"
      });
      onSuccess();
      onClose();
      // Reset form
      setLiters("");
      setTotalCost("");
      setOdometerReading("");
      setStation("");
    } catch (err: any) {
      setError(err.message || "Failed to log fuel entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18181B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111418]">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Fuel className="w-5 h-5 text-emerald-400" />
            <span>Log Fuel Fill-Up</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Select Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled>Choose a vehicle...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.make} {v.model})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Fuel Volume (Liters / Gal) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 35.5"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Total Amount Paid ($ / ₹) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 3700"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Fill-Up Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Odometer Reading (km/mi)</label>
              <input
                type="number"
                placeholder="e.g. 42150"
                value={odometerReading}
                onChange={(e) => setOdometerReading(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Gas / Petrol Station (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Shell Station, Indian Oil"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? "Logging..." : "Log Fuel Fill"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
