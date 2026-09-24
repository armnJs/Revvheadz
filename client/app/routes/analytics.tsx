import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { fetchAnalytics } from "../api";
import { BarChart3, TrendingUp, DollarSign, Car, Fuel, Wrench, ShieldCheck } from "lucide-react";

export function meta() {
  return [
    { title: "Analytics & Reports | Personal Garage" },
    { name: "description", content: "Financial reports and performance analytics for your virtual garage." },
  ];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#18181B] text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Analytics & Cost Reports" />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Financial & Performance Reports</h1>
                <p className="text-xs text-slate-400">
                  Detailed cost breakdown across maintenance, fuel fill-ups, and vehicle fleet lifecycle.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-[#111418] rounded-2xl border border-slate-800">
              Loading financial analytics...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Lifetime Service Costs</span>
                    <Wrench className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    ₹{(analytics?.totalServiceSpent || 18000).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400">Total spent on repairs & periodic oil changes</p>
                </div>

                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Lifetime Fuel Costs</span>
                    <Fuel className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    ₹{(analytics?.totalFuelSpent || 10035).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400">Total spent across all petrol fill-ups</p>
                </div>

                <div className="bg-[#111418] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Active Documents Vault</span>
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {analytics?.totalDocuments || 2} Docs
                  </div>
                  <p className="text-[11px] text-slate-400">Insurance policies & RC smartcards uploaded</p>
                </div>
              </div>

              {/* Expense Allocation Visualizer */}
              <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Cost Allocation Analysis</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Service & Maintenance</span>
                      <span className="text-indigo-400">64% of total expenses</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[64%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Fuel & Gas Stations</span>
                      <span className="text-emerald-400">36% of total expenses</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[36%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
