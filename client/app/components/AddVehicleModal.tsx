import { useState } from "react";
import { X, Car, Bike, Sparkles } from "lucide-react";
import { createVehicle } from "../api";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  onSuccess
}: AddVehicleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    make: "",
    model: "",
    type: "Car",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    color: "Silver",
    mileage: 0,
    nextService: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.make || !formData.model) {
      setError("Name, Make, and Model are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createVehicle(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: "",
        make: "",
        model: "",
        type: "Car",
        year: new Date().getFullYear(),
        vin: "",
        licensePlate: "",
        color: "Silver",
        mileage: 0,
        nextService: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        image: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18181B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111418]">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Car className="w-5 h-5 text-blue-500" />
            <span>Add New Vehicle to Garage</span>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Vehicle Name / Nickname *
              </label>
              <input
                type="text"
                placeholder="e.g. Pulsar NS200 or Daily Cruiser"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Car" })}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                    formData.type === "Car"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-[#111418] border-slate-700 text-slate-400"
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Bike" })}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                    formData.type === "Bike"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-[#111418] border-slate-700 text-slate-400"
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Bike</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Make (Brand) *
              </label>
              <input
                type="text"
                placeholder="e.g. Honda, BMW, Bajaj"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Model *
              </label>
              <input
                type="text"
                placeholder="e.g. Civic, 330i, i20"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2020 })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">License Plate</label>
              <input
                type="text"
                placeholder="e.g. MH-12-AB-1234"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
              <input
                type="text"
                placeholder="e.g. Black"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Mileage (km/mi)</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Next Service Due</label>
              <input
                type="date"
                value={formData.nextService}
                onChange={(e) => setFormData({ ...formData, nextService: e.target.value })}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">VIN Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 1HGCR2F83HA000000"
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
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
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? "Adding..." : "Save Vehicle"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
