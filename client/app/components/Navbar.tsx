import { useEffect, useState, useRef } from "react";
import { Search, Bell, Plus, Wrench, Calendar, ChevronRight, X, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { fetchVehicles } from "../api";

interface NavbarProps {
  title?: string;
  onOpenAddVehicle?: () => void;
  onOpenAddService?: () => void;
  onOpenAddFuel?: () => void;
}

export default function Navbar({
  title = "Garage Overview",
  onOpenAddVehicle,
  onOpenAddService,
  onOpenAddFuel
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReminders() {
      try {
        const vehicles = await fetchVehicles();
        const rems = vehicles.map((v: any) => ({
          id: v.id,
          name: v.name,
          make: v.make,
          model: v.model,
          nextService: v.nextService || '2026-10-15',
          licensePlate: v.licensePlate,
          type: v.type
        }));
        setReminders(rems);
      } catch (err) {
        console.error("Failed to load maintenance reminders", err);
      }
    }
    loadReminders();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-[#111418] px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1.5 w-64 text-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicles, VIN, logs..."
            className="bg-transparent border-none outline-none text-white text-xs placeholder-slate-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onOpenAddService && (
          <button
            onClick={onOpenAddService}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Service Record</span>
          </button>
        )}

        {onOpenAddFuel && (
          <button
            onClick={onOpenAddFuel}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fuel Fill</span>
          </button>
        )}

        {onOpenAddVehicle && (
          <button
            onClick={onOpenAddVehicle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vehicle</span>
          </button>
        )}

        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#111418] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#18181B] border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Wrench className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Maintenance Reminders</h4>
                    <p className="text-[11px] text-slate-400">Upcoming vehicle service schedules</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {reminders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No upcoming maintenance reminders.</p>
                ) : (
                  reminders.map((rem) => (
                    <Link
                      key={rem.id}
                      to={`/vehicles/${rem.id}`}
                      onClick={() => setShowNotifications(false)}
                      className="group flex items-start justify-between p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            {rem.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {rem.licensePlate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>Due: <strong className="text-slate-200">{rem.nextService}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 text-xs font-medium pt-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-center">
                <Link
                  to="/service"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All Service Logs →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

