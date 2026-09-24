import { useState } from "react";
import { X, Upload, FileText, CheckCircle } from "lucide-react";
import { uploadDocument } from "../api";

interface VehicleOption {
  id: string;
  name: string;
  make: string;
  model: string;
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicles: VehicleOption[];
  defaultVehicleId?: string;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onSuccess,
  vehicles,
  defaultVehicleId = ""
}: FileUploadModalProps) {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?.id || ""));
  const [docType, setDocType] = useState("Insurance Policy");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !file) {
      setError("Please select a vehicle and a document file to upload.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("vehicleId", vehicleId);
      formData.append("docType", docType);
      formData.append("file", file);

      await uploadDocument(formData);
      onSuccess();
      onClose();
      // Reset form
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18181B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111418]">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Upload className="w-5 h-5 text-sky-400" />
            <span>Upload Vehicle Document / Receipt</span>
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
              Document Type *
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-[#111418] border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Insurance Policy">Insurance Policy</option>
              <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
              <option value="Service Receipt">Service Receipt / Invoice</option>
              <option value="Pollution Under Control (PUC)">Pollution Under Control (PUC)</option>
              <option value="Vehicle Inspection Report">Vehicle Inspection Report</option>
              <option value="Other Document">Other Document</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Choose File (PDF, DOC, JPG, PNG - Max 10MB) *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl bg-[#111418] hover:border-sky-500 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-8 w-8 text-sky-400" />
                <div className="flex text-xs text-slate-400">
                  <span className="relative font-medium text-sky-400 hover:underline">
                    {file ? file.name : "Click to select a file"}
                  </span>
                  {!file && <p className="pl-1">or drag and drop</p>}
                </div>
                {file && (
                  <p className="text-xs text-emerald-400 font-medium">
                    Selected: {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
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
              disabled={loading || !file}
              className="px-5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{loading ? "Uploading..." : "Upload Document"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
