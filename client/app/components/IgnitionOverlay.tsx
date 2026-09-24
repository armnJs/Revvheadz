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
      className={`fixed inset-0 z-[9999] bg-[#050608] text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden transition-all duration-700 ${cranking ? "cranking-shake" : ""
        }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)] pointer-events-none" />

      {/* CLUSTER CONTAINER FRAME */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1c1e24] via-[#111317] to-[#08090b] border-[3px] border-slate-600/60 rounded-[50px] p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.95),inset_0_2px_6px_rgba(255,255,255,0.25)] flex flex-col items-center">

        {/* Top Hood Ridge */}
        <div className="absolute -top-3 w-56 h-3 bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600 rounded-t-xl shadow-lg" />

        {/* TOP CENTER ENGINE PUSH START BUTTON */}
        <div className="relative -mt-2 mb-4 z-20 flex flex-col items-center">
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-[#2d3036] via-[#1b1d22] to-[#0f1013] p-1.5 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.25)] transition-all duration-300 ${panelReady ? "scale-100 opacity-100 cursor-pointer" : "scale-95 opacity-50 pointer-events-none"
              }`}
          >
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-800 p-0.5 shadow-inner">
              <div className="w-full h-full bg-[#0a0b0d] rounded-full flex items-center justify-center">
                <div
                  className={`absolute inset-1.5 rounded-full border-2 transition-all duration-300 ${igniting
                    ? "border-red-500 shadow-[0_0_25px_#ff2a2a,inset_0_0_25px_#ff2a2a] animate-pulse"
                    : panelReady
                      ? "border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                      : "border-slate-800"
                    }`}
                />

                <button
                  onClick={handleStartIgnition}
                  disabled={!panelReady}
                  className={`relative w-full h-full rounded-full bg-gradient-to-b from-[#26282e] via-[#16181c] to-[#0c0d10] border border-slate-700 flex flex-col items-center justify-center transition-all duration-100 active:scale-95 active:translate-y-0.5 ${igniting ? "text-red-500" : "text-slate-200 hover:text-white"
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
              {/* Metallic Silver Chrome Gradients */}
              <linearGradient id="silverTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f1f5f9" />
                <stop offset="75%" stopColor="#334155" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <linearGradient id="innerBezel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#282c34" />
                <stop offset="100%" stopColor="#0b0c0e" />
              </linearGradient>
            </defs>

            {/* 1. LEFT AUXILIARY FUEL GAUGE (Fuel Icon on Left, E/F Arc on Right) */}
            <g transform="translate(110, 170)">
              <circle r="60" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="6" />
              <circle r="52" fill="none" stroke="#333842" strokeWidth="1" />

              {/* Right Fuel Arc Line */}
              <path d="M 44 -15 A 48 48 0 0 1 44 25" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="3,3" />
              <path d="M 44 20 A 48 48 0 0 1 42 28" fill="none" stroke="#ef4444" strokeWidth="3" />

              {/* Labels */}
              <text x="-30" y="2" fill="#e2e8f0" fontSize="16" fontFamily="sans-serif">⛽</text>
              <text x="26" y="-12" fill="#cbd5e1" fontSize="13" fontFamily="sans-serif" italic="true">F</text>
              <text x="26" y="24" fill="#cbd5e1" fontSize="13" fontFamily="sans-serif" italic="true">E</text>

              {/* Fuel Needle */}
              <g transform={`rotate(${sweeping ? 120 : 70})`}>
                <line x1="0" y1="12" x2="0" y2="-44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                <circle r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              </g>
            </g>

            {/* 2. LEFT MAIN SPEEDOMETER DIAL (0 to 200 MPH - Clockwise layout) */}
            <g transform="translate(310, 170)">
              <circle r="125" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="8" />
              <circle r="114" fill="none" stroke="#475569" strokeWidth="1.5" />

              {/* Major Tick Marks & Numbers */}
              {/* 0 */} <line x1="-68" y1="84" x2="-57" y2="70" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 20 */} <line x1="-92" y1="52" x2="-78" y2="44" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 40 */} <line x1="-106" y1="12" x2="-90" y2="10" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 60 */} <line x1="-102" y1="-32" x2="-86" y2="-27" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 80 */} <line x1="-78" y1="-72" x2="-66" y2="-60" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 100 */} <line x1="-40" y1="-98" x2="-34" y2="-82" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 120 */} <line x1="0" y1="-106" x2="0" y2="-90" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 140 */} <line x1="40" y1="-98" x2="34" y2="-82" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 160 */} <line x1="78" y1="-72" x2="66" y2="-60" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 180 */} <line x1="102" y1="-32" x2="86" y2="-27" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 200 */} <line x1="106" y1="12" x2="90" y2="10" stroke="#cbd5e1" strokeWidth="2.5" />

              {/* Numbers */}
              <g textAnchor="middle" dominantBaseline="central" fill="#f8fafc" fontSize="13" fontFamily="sans-serif">
                <text x="-46" y="60">0</text>
                <text x="-66" y="36">20</text>
                <text x="-76" y="8">40</text>
                <text x="-72" y="-22">60</text>
                <text x="-52" y="-52">80</text>
                <text x="-26" y="-72">100</text>
                <text x="0" y="-78">120</text>
                <text x="26" y="-72">140</text>
                <text x="52" y="-52">160</text>
                <text x="72" y="-22">180</text>
                <text x="76" y="8">200</text>
              </g>

              {/* Right Side Digital LCD Window */}
              <text x="-36" y="52" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontStyle="italic">
                MPH
              </text>

              {/* Speedometer Needle (Resting at 0 MPH) */}
              <g transform={`rotate(${sweeping ? 115 : -142})`} className="transition-transform duration-75">
                <line x1="0" y1="16" x2="0" y2="-102" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <circle r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              </g>
            </g>

            {/* 3. RIGHT MAIN TACHOMETER DIAL (0 to 8 RPM / Counter-clockwise layout) */}
            <g transform="translate(590, 170)">
              <circle r="125" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="8" />
              <circle r="114" fill="none" stroke="#475569" strokeWidth="1.5" />

              {/* Major Ticks in Counter-Clockwise Order */}
              {/* 0 */} <line x1="-52" y1="94" x2="-44" y2="79" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 1 */} <line x1="0" y1="106" x2="0" y2="90" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 2 */} <line x1="52" y1="94" x2="44" y2="79" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 3 */} <line x1="88" y1="62" x2="74" y2="52" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 4 */} <line x1="106" y1="18" x2="90" y2="15" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 5 */} <line x1="102" y1="-28" x2="88" y2="-24" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 6 */} <line x1="78" y1="-70" x2="66" y2="-60" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 7 */} <line x1="38" y1="-98" x2="32" y2="-84" stroke="#cbd5e1" strokeWidth="2.5" />
              {/* 8 */} <line x1="-18" y1="-104" x2="-15" y2="-88" stroke="#cbd5e1" strokeWidth="2.5" />

              {/* Numbers */}
              <g textAnchor="middle" dominantBaseline="central" fill="#f8fafc" fontSize="14" fontFamily="sans-serif">
                <text x="-36" y="68">0</text>
                <text x="0" y="76">1</text>
                <text x="36" y="68">2</text>
                <text x="62" y="45">3</text>
                <text x="76" y="12">4</text>
                <text x="74" y="-20">5</text>
                <text x="56" y="-52">6</text>
                <text x="26" y="-72">7</text>
                <text x="-12" y="-76">8</text>
              </g>

              <text x="-60" y="48" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontStyle="italic">
                RPM
              </text>
              <text x="-60" y="60" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                X 1000
              </text>

              {/* Tachometer Needle (Resting at 0 RPM at bottom-left) */}
              <g transform={`rotate(${sweeping ? -351 : 9})`} className="transition-transform duration-75">
                <line x1="0" y1="16" x2="0" y2="-102" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                <circle r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              </g>
            </g>

            {/* 4. RIGHT AUXILIARY ENGINE TEMP GAUGE (Resting in Middle) */}
            <g transform="translate(790, 170)">
              <circle r="60" fill="url(#innerBezel)" stroke="url(#silverTrim)" strokeWidth="6" />
              <circle r="52" fill="none" stroke="#333842" strokeWidth="1" />

              {/* Left Temp Arc Line */}
              <path d="M -44 -15 A 48 48 0 0 0 -44 25" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="3,3" />
              <path d="M -44 -15 A 48 48 0 0 1 -42 -22" fill="none" stroke="#ef4444" strokeWidth="3" />

              {/* Labels */}
              <text x="26" y="2" fill="#e2e8f0" fontSize="16" fontFamily="sans-serif">🌡️</text>
              <text x="-26" y="-12" fill="#cbd5e1" fontSize="13" fontFamily="sans-serif" italic="true">H</text>
              <text x="-26" y="24" fill="#cbd5e1" fontSize="13" fontFamily="sans-serif" italic="true">C</text>

              {/* Temp Needle (Resting in Middle) */}
              <g transform={`rotate(${sweeping ? 240 : -95})`}>
                <line x1="0" y1="12" x2="0" y2="-44" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                <circle r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              </g>
            </g>

            {/* REVVHEADZ BRANDING & WING EMBLEM CENTER BOTTOM */}
            <g transform="translate(450, 305)">
              <path d="M-40 -12 Q-15 -18 0 -12 Q15 -18 40 -12 Q15 -13.5 -40 -12 Z" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
              <circle cx="0" cy="-12" r="5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
              <text x="0" y="6" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="serif" fontWeight="bold" letterSpacing="5">
                REVVHEADZ
              </text>
              <text x="0" y="18" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace" letterSpacing="2">
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



