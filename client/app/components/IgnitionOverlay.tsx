import { useState, useEffect } from "react";

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
    // Diagnostic gauge sweep on load
    const timer1 = setTimeout(() => {
      setSweeping(true);
    }, 300);

    const timer2 = setTimeout(() => {
      setSweeping(false);
      setPanelReady(true);
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleStartIgnition = () => {
    if (!panelReady || igniting) return;

    setIgniting(true);
    setCranking(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.9);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
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
    }, 1100);
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#07080a] text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden transition-all duration-700 ${
        cranking ? "cranking-shake" : ""
      }`}
    >
      {/* Ambient Lighting & Carbon Weave Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a1d24_0%,#07080a_80%)] pointer-events-none" />

      {/* ASTON MARTIN DUAL INSTRUMENT CLUSTER CASING */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#21242a] via-[#14161a] to-[#0c0d10] border-4 border-slate-700/60 rounded-[48px] p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_2px_8px_rgba(255,255,255,0.15)] flex flex-col items-center">
        
        {/* Top Metallic Crown Bezel */}
        <div className="absolute -top-3 w-48 h-3 bg-gradient-to-r from-slate-700 via-slate-300 to-slate-700 rounded-t-lg shadow-md" />

        {/* TOP-CENTER CIRCULAR ENGINE PUSH START BUTTON (Integrated into top recessed pod) */}
        <div className="relative mb-6 z-20 flex flex-col items-center">
          <div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#2d3036] to-[#121316] p-2 flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-all duration-300 ${
              panelReady ? "scale-100 opacity-100 cursor-pointer" : "scale-95 opacity-50 pointer-events-none"
            }`}
          >
            {/* Chrome Ring */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-200 via-slate-600 to-slate-900 shadow-inner" />

            {/* Inner Backlit LED Housing */}
            <div className="relative w-full h-full bg-[#0a0b0d] rounded-full flex items-center justify-center p-1">
              <div
                className={`absolute inset-1.5 rounded-full border-2 transition-all duration-300 ${
                  igniting
                    ? "border-red-500 shadow-[0_0_20px_#ff2a2a,inset_0_0_20px_#ff2a2a] animate-pulse"
                    : panelReady
                    ? "border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                    : "border-slate-800"
                }`}
              />

              {/* Physical Push Button */}
              <button
                onClick={handleStartIgnition}
                disabled={!panelReady}
                className={`relative w-full h-full rounded-full bg-gradient-to-b from-[#24272c] via-[#17191d] to-[#0d0e10] border border-slate-700/80 flex flex-col items-center justify-center transition-all duration-100 active:scale-95 active:translate-y-0.5 ${
                  igniting ? "text-red-500" : "text-slate-200 hover:text-white"
                }`}
              >
                <span className="text-[8px] sm:text-[9px] font-extrabold tracking-[2px] text-amber-400/90 mb-0.5">ENGINE</span>
                <span className={`text-sm sm:text-base font-black tracking-widest ${igniting ? "text-red-500 drop-shadow-[0_0_8px_rgba(255,42,42,0.9)]" : "text-white"}`}>
                  START
                </span>
                <span className="text-[7px] sm:text-[8px] font-extrabold tracking-[1px] text-slate-400 mt-0.5">STOP</span>
              </button>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 mt-2 uppercase">
            {panelReady ? "PULL POWER • IGNITE" : "SYSTEM DIAGNOSTICS"}
          </span>
        </div>

        {/* MAIN CLUSTER GAUGES ROW */}
        <div className="w-full flex items-center justify-between gap-2 sm:gap-6 relative">
          
          {/* 1. LEFT AUXILIARY GAUGES: FUEL GAUGE */}
          <div className="hidden md:flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full border-4 border-slate-600 bg-gradient-to-b from-[#16181d] to-[#0a0b0d] p-2 flex items-center justify-center shadow-inner">
              <div className="absolute inset-1 rounded-full border border-slate-500/30" />
              <div className="text-center font-mono text-[10px] font-bold text-slate-400 space-y-3">
                <div className="flex justify-between w-14 px-1 text-[9px]">
                  <span>E</span>
                  <span>F</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto" />
                <span className="text-xs">⛽</span>
              </div>
              {/* Gauge Needle */}
              <div
                className={`absolute bottom-1/2 left-1/2 w-0.5 h-10 bg-amber-400 origin-bottom -translate-x-1/2 transition-transform duration-1000 ${
                  sweeping ? "rotate-[45deg]" : "rotate-[20deg]"
                }`}
              />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-slate-800 border border-slate-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 2. LEFT MAIN DIAL: SPEEDOMETER (MPH / KM/H) */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-slate-600/90 bg-gradient-to-b from-[#181a1f] via-[#101114] to-[#07080a] flex items-center justify-center shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-2 rounded-full border border-slate-500/40" />
            
            {/* Speedometer Numbers (Aston Martin Spec Tick Layout) */}
            <div className="absolute inset-4 rounded-full flex items-center justify-center">
              <span className="absolute top-6 left-12 text-xs font-mono font-bold text-slate-300">60</span>
              <span className="absolute top-4 left-20 text-xs font-mono font-bold text-slate-300">80</span>
              <span className="absolute top-4 left-28 text-sm font-mono font-black text-white">100</span>
              <span className="absolute top-6 right-20 text-xs font-mono font-bold text-slate-300">120</span>
              <span className="absolute top-12 right-12 text-xs font-mono font-bold text-slate-300">140</span>
              <span className="absolute top-20 right-8 text-xs font-mono font-bold text-slate-300">160</span>
              <span className="absolute top-28 right-6 text-xs font-mono font-bold text-slate-300">180</span>
              <span className="absolute top-36 right-8 text-xs font-mono font-bold text-slate-300">200</span>
            </div>

            {/* LCD Center Display Screen */}
            <div className="absolute top-24 w-24 h-8 bg-[#090b0e] border border-slate-700/80 rounded flex items-center justify-center shadow-inner">
              <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                {sweeping ? "185 MPH" : panelReady ? "SYS OK" : "CHECK"}
              </span>
            </div>

            <div className="absolute bottom-12 font-mono text-[10px] font-extrabold text-slate-400 tracking-widest">
              MPH <span className="text-[8px] text-slate-500">km/h</span>
            </div>

            {/* Left Needle Sweep */}
            <div
              className={`absolute bottom-1/2 left-1/2 w-1 h-24 sm:h-28 bg-gradient-to-t from-slate-200 to-white origin-bottom -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform duration-75 ${
                sweeping ? "needle-sweep-aston-left" : "rotate-[-110deg]"
              }`}
            />
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-slate-900 border-2 border-slate-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* 3. RIGHT MAIN DIAL: TACHOMETER (RPM x1000) */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-slate-600/90 bg-gradient-to-b from-[#181a1f] via-[#101114] to-[#07080a] flex items-center justify-center shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-2 rounded-full border border-slate-500/40" />

            {/* RPM Ticks (Counter-Clockwise Sweep layout) */}
            <div className="absolute inset-4 rounded-full flex items-center justify-center font-mono text-xs font-bold text-slate-300">
              <span className="absolute bottom-10 left-12">0</span>
              <span className="absolute bottom-16 left-8">1</span>
              <span className="absolute top-28 left-6">2</span>
              <span className="absolute top-16 left-8">3</span>
              <span className="absolute top-8 left-16">4</span>
              <span className="absolute top-4 left-28">5</span>
              <span className="absolute top-8 right-16 text-red-400 font-extrabold">6</span>
              <span className="absolute top-16 right-8 text-red-500 font-extrabold">7</span>
              <span className="absolute top-28 right-6 text-red-600 font-extrabold">8</span>
            </div>

            {/* LCD Right Window */}
            <div className="absolute top-24 w-24 h-8 bg-[#090b0e] border border-slate-700/80 rounded flex items-center justify-center shadow-inner">
              <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                {sweeping ? "7200 RPM" : panelReady ? "READY" : "DIAG"}
              </span>
            </div>

            <div className="absolute bottom-12 font-mono text-[9px] font-bold text-slate-400 tracking-widest text-center">
              RPM<br /><span className="text-[7px] text-slate-500">X 1000</span>
            </div>

            {/* Right Tachometer Needle */}
            <div
              className={`absolute bottom-1/2 left-1/2 w-1 h-24 sm:h-28 bg-gradient-to-t from-amber-300 to-white origin-bottom -translate-x-1/2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform duration-75 ${
                sweeping ? "needle-sweep-aston-right" : "rotate-[-130deg]"
              }`}
            />
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-slate-900 border-2 border-slate-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* 4. RIGHT AUXILIARY GAUGES: ENGINE TEMP GAUGE */}
          <div className="hidden md:flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full border-4 border-slate-600 bg-gradient-to-b from-[#16181d] to-[#0a0b0d] p-2 flex items-center justify-center shadow-inner">
              <div className="absolute inset-1 rounded-full border border-slate-500/30" />
              <div className="text-center font-mono text-[10px] font-bold text-slate-400 space-y-3">
                <div className="flex justify-between w-14 px-1 text-[9px]">
                  <span>C</span>
                  <span className="text-red-400">H</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mx-auto" />
                <span className="text-xs">🌡️</span>
              </div>
              {/* Temp Needle */}
              <div
                className={`absolute bottom-1/2 left-1/2 w-0.5 h-10 bg-amber-400 origin-bottom -translate-x-1/2 transition-transform duration-1000 ${
                  sweeping ? "rotate-[20deg]" : "rotate-[-10deg]"
                }`}
              />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-slate-800 border border-slate-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>

        {/* ASTON MARTIN / VIRTUAL WING EMBLEM IN CENTER BOTTOM */}
        <div className="mt-6 flex flex-col items-center opacity-80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-slate-200 rounded" />
            <span className="font-serif tracking-[4px] text-xs font-bold text-slate-300 uppercase">
              REVVHEADZ
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-slate-400 to-slate-200 rounded" />
          </div>
          <span className="text-[9px] tracking-widest text-slate-500 mt-1 uppercase font-mono">
            VIRTUAL AUTOMOTIVE OS
          </span>
        </div>

      </div>

      {/* Skip Button */}
      <button
        onClick={() => {
          setDismissed(true);
          if (onStart) onStart();
        }}
        className="mt-6 px-4 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-700/80 transition-colors shadow-lg"
      >
        Skip Ignition →
      </button>
    </div>
  );
}

