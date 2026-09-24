import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { User, Settings, Shield, Bell, Key, Sparkles } from "lucide-react";

export function meta() {
  return [
    { title: "Garage Settings & Profile | Personal Garage" },
    { name: "description", content: "Manage your garage owner profile and application preferences." },
  ];
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Profile & Garage Settings" />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-4xl">
          {/* Profile Card */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-800 ring-4 ring-blue-500/30 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Sophia Carter"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Sophia Carter</h1>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-full shadow-md w-max mx-auto sm:mx-0">
                  Premium Garage License
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">sophia.carter@revvheadz.garage</p>
              <p className="text-xs text-blue-400 font-medium pt-1">
                Virtual Garage Owner since Jan 2024 • 3 Active Vehicles
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              <span>Application Preferences</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Service Maintenance Reminders</h4>
                    <p className="text-slate-400">Receive email alerts 14 days before vehicle service is due.</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="toggle-checkbox accent-blue-600 w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Document Expiry Alerts</h4>
                    <p className="text-slate-400">Alert when vehicle Insurance Policy or PUC renewal date approaches.</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="toggle-checkbox accent-blue-600 w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Local API Backend Connection</h4>
                    <p className="text-slate-400">Connected to http://localhost:5050 with JSON persistence layer.</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
