import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Car,
  Fuel,
  Wrench,
  BarChart3,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Plus
} from "lucide-react";

interface SidebarProps {
  onOpenAddVehicle?: () => void;
}

export default function Sidebar({ onOpenAddVehicle }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Vehicles", path: "/vehicles", icon: Car },
    { name: "Service Logs", path: "/service", icon: Wrench },
    { name: "Fuel Tracker", path: "/fuel", icon: Fuel },
    { name: "Analytics & Reports", path: "/analytics", icon: BarChart3 },
    { name: "Profile & Garage Settings", path: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#111418] border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none">
      <div className="p-5 flex flex-col gap-6">
        {/* Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20">
            R
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">RevvHeadz</h1>
            <p className="text-xs text-blue-400 font-medium">Virtual Garage OS</p>
          </div>
        </div>

        {/* Quick Add Vehicle Action */}
        {onOpenAddVehicle && (
          <button
            onClick={onOpenAddVehicle}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden ring-2 ring-blue-500/30">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-sm font-semibold truncate">Sophia Carter</span>
              <span className="text-xs text-blue-400 font-medium">Garage Owner</span>
            </div>
          </div>
          <Link
            to="/login"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
