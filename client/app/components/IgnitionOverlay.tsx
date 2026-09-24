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
    const timer1 = setTimeout(() => setSweeping(true), 300);
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
      className={`fixed inset-0 z-[9999] bg-[#050608] text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden transition-all duration-700 ${
        cranking ? "cranking-shake" : ""
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)] pointer-events-none" />

      {/* CLUSTER CONTAINER FRAME */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1c1e24] via-[#111317] to-[#08090b] border-[3px] border-slate-600/60 rounded-[50px] p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.95),inset_0_2px_6px_rgba(255,255,255,0.25)] flex flex-col items-center">
        
        {/* Top Hood Ridge */}
        <div className="absolute -top-3 w-56 h-3 bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600 rounded-t-xl shadow-lg" />

        {/* TOP CENTER ENGINE PUSH START BUTTON */}
        <div className="relative -mt-2 mb-4 z-20 flex flex-col items-center">
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#2d3036] via-[#1b1d22] to-[#0f1013] p-1.5 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.25)] transition-all duration-300 ${
              panelReady ? "scale-100 opacity-100 cursor-pointer" : "scale-95 opacity-50 pointer-events-none"
            }`}
          >
            {/* Chrome Outer Ring */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-800 p-0.5 shadow-inner">
              <div className="w-full h-full bg-[#0a0b0d] rounded-full flex items-center justify-center">
                {/* Backlit Status Ring */}
                <div
                  className={`absolute inset-1.5 rounded-full border-2 transition-all duration-300 ${
                    igniting
                      ? "border-red-500 shadow-[0_0_25px_#ff2a2a,inset_0_0_25px_#ff2a2a] animate-pulse"
                      : panelReady
                      ? "border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                      : "border-slate-800"
                  }`}
                />

                {/* Physical Push Button */}
                <button
                  onClick={handleStartIgnition}
                  disabled={!panelReady}
                  className={`relative w-full h-full rounded-full bg-gradient-to-b from-[#26282e] via-[#16181c] to-[#0c0d10] border border-slate-700 flex flex-col items-center justify-center transition-all duration-100 active:scale-95 active:translate-y-0.5 ${
                    igniting ? "text-red-500" : "text-slate-200 hover:text-white"
                  }`}
                >
                  <span className="text-[8px] sm:text-[9px] font-extrabold tracking-[2px] text-amber-400 mb-0.5">ENGINE</span>
                  <span className={`text-xs sm:text-sm font-black tracking-widest ${igniting ? "text-red-500 drop-shadow-[0_0_8px_rgba(255,42,42,0.9)]" : "text-white"}`}>
                    START
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-extrabold tracking-[1px] text-slate-400 mt-0.5">STOP</span>
                </button>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-extrabold tracking-[3px] text-slate-400 mt-1.5 uppercase">
            {panelReady ? "PRESS TO START" : "DIAGNOSTICS..."}
          </span>
        </div>

        {/* ASTON MARTIN SVG CLUSTER INSTRUMENTATION */}
        <div className="w-full flex items-center justify-center">
          <svg viewBox="0 0 900 340" className="w-full h-auto drop-shadow-2xl">
            <defs>
              {/* Silver Metallic Chrome Gradients */}
              <linearGradient id="silverTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f3f7" />
                <stop offset="30%" stopColor="#8a929e" />
                <stop offset="55%" stopColor="#dbe1e8" />
                <stop offset="80%" stopColor="#414752" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              <linearGradient id="innerBezel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c3038" />
                <stop offset="100%" stopColor="#0a0b0d" />
              </linearGradient>
            </defs>

            {/* 1. LEFT AUXILIARY FUEL GAUGE */}
            <g transform="translate(110, 170)">
              {/* Silver Ring */}
              <circle r="60" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="6" />
              <circle r="52" fill="none" stroke="#333842" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Fuel Dial Labels */}
              <text x="-32" y="10" fill="#cbd5e1" fontSize="12" fontFamily="monospace" fontWeight="bold">E</text>
              <text x="22" y="10" fill="#cbd5e1" fontSize="12" fontFamily="monospace" fontWeight="bold">F</text>
              
              {/* Fuel Icon */}
              <path d="M-4 22 h8 v10 h-8 z M2 22 v-4 a2 2 0 0 0 -4 0 v4" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              
              {/* Fuel Needle */}
              <g transform={`rotate(${sweeping ? 35 : 15})`}>
                <line x1="0" y1="0" x2="0" y2="-42" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                <circle r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              </g>
            </g>

            {/* 2. LEFT MAIN SPEEDOMETER DIAL (20 to 200 MPH / Counter-clockwise layout matching Aston Martin spec) */}
            <g transform="translate(310, 170)">
              {/* Outer Silver Chrome Bezel */}
              <circle r="125" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="8" />
              <circle r="114" fill="none" stroke="#475569" strokeWidth="1.5" />
              <circle r="108" fill="none" stroke="#333842" strokeWidth="1" strokeDasharray="2,4" />

              {/* Speedometer Scale Numbers */}
              <g textAnchor="middle" dominantBaseline="central" fill="#f8fafc" fontSize="13" fontFamily="monospace" fontWeight="bold">
                <text x="-75" y="65">20</text>
                <text x="-95" y="25">40</text>
                <text x="-98" y="-20">60</text>
                <text x="-80" y="-62">80</text>
                <text x="-48" y="-90">100</text>
                <text x="0" y="-98">120</text>
                <text x="48" y="-90">140</text>
                <text x="80" y="-62">160</text>
                <text x="95" y="-20">180</text>
                <text x="80" y="25">200</text>
              </g>

              {/* Center Digital LCD Screen */}
              <rect x="-45" y="-18" width="90" height="36" rx="4" fill="#040507" stroke="#334155" strokeWidth="1.5" />
              <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {sweeping ? "185 MPH" : panelReady ? "SYS OK" : "DIAG"}
              </text>

              <text x="0" y="62" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
                MPH <tspan fontSize="8" fill="#64748b">km/h</tspan>
              </text>

              {/* Speedometer Needle (Left to Right Sweep) */}
              <g transform={`rotate(${sweeping ? 110 : -130})`} className="transition-transform duration-75">
                <line x1="0" y1="12" x2="0" y2="-102" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0px 0px 4px rgba(255,255,255,0.8))" />
                <circle r="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
              </g>
            </g>

            {/* 3. RIGHT MAIN TACHOMETER DIAL (0 to 8 RPM / Counter-clockwise orientation right to left) */}
            <g transform="translate(590, 170)">
              {/* Outer Silver Chrome Bezel */}
              <circle r="125" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="8" />
              <circle r="114" fill="none" stroke="#475569" strokeWidth="1.5" />
              <circle r="108" fill="none" stroke="#333842" strokeWidth="1" strokeDasharray="2,4" />

              {/* Tachometer Numbers (Counter-clockwise layout: 0 bottom left -> 8 bottom right) */}
              <g textAnchor="middle" dominantBaseline="central" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">
                <text x="-75" y="65">0</text>
                <text x="-95" y="25">1</text>
                <text x="-98" y="-20">2</text>
                <text x="-80" y="-62">3</text>
                <text x="-48" y="-90">4</text>
                <text x="0" y="-98">5</text>
                <text x="48" y="-90" fill="#f87171">6</text>
                <text x="80" y="-62" fill="#ef4444">7</text>
                <text x="95" y="-20" fill="#dc2626">8</text>
              </g>

              {/* Center Digital LCD Screen */}
              <rect x="-45" y="-18" width="90" height="36" rx="4" fill="#040507" stroke="#334155" strokeWidth="1.5" />
              <text x="0" y="2" textAnchor="middle" dominantBaseline="central" fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {sweeping ? "7200 RPM" : panelReady ? "READY" : "DIAG"}
              </text>

              <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                RPM
              </text>
              <text x="0" y="70" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                X 1000
              </text>

              {/* Tachometer Needle (Right to Left Counter Sweep) */}
              <g transform={`rotate(${sweeping ? 110 : -130})`} className="transition-transform duration-75">
                <line x1="0" y1="12" x2="0" y2="-102" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0px 0px 4px rgba(255,255,255,0.8))" />
                <circle r="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
              </g>
            </g>

            {/* 4. RIGHT AUXILIARY ENGINE TEMP GAUGE */}
            <g transform="translate(790, 170)">
              {/* Silver Ring */}
              <circle r="60" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="6" />
              <circle r="52" fill="none" stroke="#333842" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Temp Dial Labels */}
              <text x="-32" y="10" fill="#cbd5e1" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
              <text x="22" y="10" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
              
              {/* Temp Icon */}
              <path d="M0 20 v10 M-4 28 h8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              
              {/* Temp Needle */}
              <g transform={`rotate(${sweeping ? 10 : -20})`}>
                <line x1="0" y1="0" x2="0" y2="-42" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                <circle r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              </g>
            </g>

            {/* WINGED LOGO IN CENTER BOTTOM */}
            <g transform="translate(450, 305)">
              <path d="M-60 0 Q-20 -8 0 0 Q20 -8 60 0 Q20 -2 -60 0 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <circle r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
              <text x="0" y="18" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="serif" fontWeight="bold" letterSpacing="4">
                REVVHEADZ
              </text>
              <text x="0" y="28" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace" letterSpacing="2">
                VIRTUAL AUTOMOTIVE OS
              </text>
            </g>
          </svg>
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


