import { useState, useEffect } from "react";
import { Gauge, Zap, Play } from "lucide-react";

interface IgnitionOverlayProps {
  onStart: () => void;
}

export default function IgnitionOverlay({ onStart }: IgnitionOverlayProps) {
  const [panelReady, setPanelReady] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [igniting, setIgniting] = useState(false);
  const [cranking, setCranking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Diagnostic sweep sequence on load
    const timer1 = setTimeout(() => {
      setSweeping(true);
    }, 400);

    const timer2 = setTimeout(() => {
      setSweeping(false);
      setPanelReady(true);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleStartIgnition = () => {
    if (!panelReady || igniting) return;

    setIgniting(true);
    setCranking(true);

    // Audio synth effect using Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch (e) {
      console.log("Audio feedback skipped");
    }

    setTimeout(() => {
      setCranking(false);
      setDismissed(true);
      if (onStart) onStart();
    }, 1200);
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-b from-[#0e1014] via-[#08090b] to-[#040405] text-white flex flex-col items-center justify-center transition-all duration-700 select-none ${
        cranking ? "cranking-shake" : ""
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,204,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Speedometer Gauge Container */}
      <div className="relative w-72 h-72 mb-8 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-slate-800/80 border-t-[#00ffcc] shadow-[0_0_30px_rgba(0,255,204,0.25)] transition-all duration-500" />
        <div className="absolute inset-3 rounded-full border border-slate-700/40 border-dashed animate-spin-slow" />

        {/* Speedometer Tick Marks */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-1">
            <span className="block text-3xl font-black tracking-wider text-white font-mono">
              {sweeping ? "240" : panelReady ? "READY" : "DIAG"}
            </span>
            <span className="block text-[10px] uppercase font-semibold text-emerald-400 tracking-widest">
              KM/H • VIRTUAL OS
            </span>
          </div>
        </div>

        {/* Gauge Needle */}
        <div
          className={`absolute bottom-1/2 left-1/2 w-1.5 h-28 bg-gradient-to-t from-red-600 to-red-500 origin-bottom -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.9)] transition-transform duration-75 ${
            sweeping ? "needle-sweep-active" : "rotate-[-120deg]"
          }`}
        />

        {/* Center Node */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-slate-900 border-4 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,51,51,0.6)]" />
      </div>

      {/* Automotive Push Start Button Panel */}
      <div
        className={`relative w-48 h-48 rounded-full bg-gradient-to-b from-[#2a2d32] to-[#121315] p-5 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.08),inset_0_-5px_15px_rgba(0,0,0,0.9)] transition-all duration-500 ${
          panelReady ? "opacity-100 scale-100 cursor-pointer" : "opacity-40 scale-95 pointer-events-none"
        }`}
      >
        {/* Chrome Trim Ring */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-200 via-slate-600 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_5px_15px_rgba(0,0,0,0.6)]" />

        {/* Button Housing */}
        <div className="relative w-36 h-36 bg-[#0c0d0f] rounded-full flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.95)]">
          {/* LED Backlit Ring */}
          <div
            className={`absolute inset-2 rounded-full border-4 transition-all duration-300 ${
              igniting
                ? "border-red-500 shadow-[0_0_25px_#ff2a2a,inset_0_0_25px_#ff2a2a] animate-pulse"
                : panelReady
                ? "border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,204,0.2)]"
                : "border-slate-800"
            }`}
          />

          {/* Physics Engine Button */}
          <button
            onClick={handleStartIgnition}
            disabled={!panelReady}
            className={`relative w-28 h-28 rounded-full bg-gradient-to-b from-[#242629] to-[#141517] border border-slate-800 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 active:translate-y-0.5 ${
              igniting ? "text-red-500 shadow-[inset_0_0_20px_rgba(255,42,42,0.6)]" : "text-slate-300 hover:text-white"
            }`}
          >
            <span className="text-[9px] font-extrabold tracking-[3px] text-slate-400 mb-0.5">ENGINE</span>
            <span className={`text-xl font-black tracking-wider transition-colors ${igniting ? "text-red-500 drop-shadow-[0_0_10px_rgba(255,42,42,0.8)]" : "text-slate-100"}`}>
              START
            </span>
            <span className="text-[8px] font-extrabold tracking-[2px] text-slate-500 mt-0.5">STOP</span>
          </button>
        </div>
      </div>

      {/* Instruction subtitle */}
      <div className="mt-8 text-center space-y-1">
        <p className="text-xs font-semibold tracking-wider text-slate-400">
          {panelReady ? "PRESS ENGINE START TO IGNITE GARAGE OS" : "RUNNING VEHICLE DIAGNOSTICS..."}
        </p>
        <p className="text-[10px] text-slate-500">RevvHeadz Virtual Automotive Experience</p>
      </div>

      {/* Skip Button for quick access */}
      <button
        onClick={() => {
          setDismissed(true);
          if (onStart) onStart();
        }}
        className="absolute bottom-6 right-6 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
      >
        Skip Ignition →
      </button>
    </div>
  );
}
