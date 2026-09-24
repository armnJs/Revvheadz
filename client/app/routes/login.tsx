import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Car, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function meta() {
  return [
    { title: "Login | RevvHeadz Virtual Garage" },
    { name: "description", content: "Log in to your virtual garage account." },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sophia@revvheadz.garage");
  const [password, setPassword] = useState("password123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#111418] text-slate-200 flex flex-col justify-center items-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#18181B] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Branding Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-3xl shadow-xl shadow-blue-500/20">
            R
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">RevvHeadz Garage</h1>
          <p className="text-xs text-slate-400">Sign in to manage your vehicle fleet</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111418] border border-slate-700/70 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 accent-blue-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Log In to Garage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-400 font-semibold hover:underline">
              Enter Demo Mode
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
