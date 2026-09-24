import { useState } from "react";
import { X, Wrench, CheckCircle } from "lucide-react";
import { createService } from "../api";

interface VehicleOption {
  id: string;
  name: string;
  make: string;
  model: string;
}

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicles: VehicleOption[];
  defaultVehicleId?: string;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  onSuccess,
  vehicles,
  defaultVehicleId = ""
}: AddServiceModalProps) {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ""));
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [provider, setProvider] = useState("");
  const [mileage, setMileage] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState(
    new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !description) {
      setError("Vehicle selection and service description are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createService({
        vehicleId,
        serviceDate,
        description,
        cost: parseFloat(cost) || 0,
        provider: provider || "Service Garage",
        mileage: parseInt(mileage) || 0,
        status: "Completed",
        nextServiceDate
      });
      onSuccess();
      onClose();
      // Reset form
      setDescription("");
      setCost("");
      setProvider("");
      setMileage("");
    } catch (err: any) {
      setError(err.message || "Failed to record service entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18181B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111418]">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Wrench className="w-5 h-5 text-indigo-400" />
            <span>Record Maintenance & Service</span>
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Service Description / Tasks Performed *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Engine synthetic oil change, air filter replacement, wheel balancing"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Total Cost ($ / ₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Service Provider / Mechanic
              </label>
              <input
                type="text"
                placeholder="e.g. Authorized Dealership"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Service Date</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Odometer (km/mi)</label>
              <input
                type="number"
                placeholder="Current odometer"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Next Service Due</label>
              <input
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
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
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{loading ? "Recording..." : "Save Service Record"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
