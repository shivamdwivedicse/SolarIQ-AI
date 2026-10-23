import React from 'react';

export const SolarPanelIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background glow halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/15 to-transparent rounded-3xl blur-2xl -z-10" />

      <svg
        viewBox="0 0 600 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="sunGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="panelGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f1f38" />
            <stop offset="50%" stopColor="#081426" />
            <stop offset="100%" stopColor="#030812" />
          </linearGradient>
          <linearGradient id="cellHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Ambient Sunlight Rays */}
        <polygon points="120,40 180,240 220,240 160,40" fill="url(#beamGrad)" />
        <polygon points="170,30 260,250 310,250 210,30" fill="url(#beamGrad)" opacity="0.7" />
        <polygon points="220,40 370,250 420,250 260,40" fill="url(#beamGrad)" opacity="0.5" />

        {/* Bright Glowing Sun */}
        <g transform="translate(140, 70)">
          <circle cx="0" cy="0" r="46" fill="#fef08a" fillOpacity="0.15" />
          <circle cx="0" cy="0" r="36" fill="#f59e0b" fillOpacity="0.3" />
          <circle cx="0" cy="0" r="26" fill="url(#sunGlow)" />
          {/* Subtle sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="42"
              y2="0"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${angle})`}
              opacity="0.8"
            />
          ))}
        </g>

        {/* Ground / Roof Platform */}
        <ellipse cx="300" cy="360" rx="240" ry="24" fill="#0b1322" />
        <line x1="120" y1="360" x2="480" y2="360" stroke="#1e293b" strokeWidth="2" />

        {/* Mounting Racks */}
        <line x1="210" y1="280" x2="210" y2="350" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="390" y1="280" x2="390" y2="350" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        <line x1="190" y1="340" x2="230" y2="350" stroke="#334155" strokeWidth="4" />
        <line x1="370" y1="340" x2="410" y2="350" stroke="#334155" strokeWidth="4" />

        {/* Main Tilted Solar Panel Assembly */}
        <g>
          {/* Panel Aluminum Outer Frame */}
          <polygon
            points="140,240 460,240 420,130 180,130"
            fill="url(#frameGrad)"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Panel Tempered Glass Surface */}
          <polygon
            points="146,236 454,236 416,134 184,134"
            fill="url(#panelGlass)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
          />

          {/* Silicon Solar Cells Grid (4x3 cells perspective) */}
          {/* Vertical Busbars */}
          <line x1="250" y1="134" x2="220" y2="236" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
          <line x1="300" y1="134" x2="300" y2="236" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
          <line x1="350" y1="134" x2="380" y2="236" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />

          {/* Horizontal Cell Lines */}
          <line x1="172" y1="168" x2="428" y2="168" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
          <line x1="158" y1="202" x2="442" y2="202" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />

          {/* Photovoltaic Cells Active Glow Highlight */}
          <polygon
            points="186,136 298,136 298,166 174,166"
            fill="url(#cellHighlight)"
          />
          <polygon
            points="302,136 414,136 426,166 302,166"
            fill="url(#cellHighlight)"
            opacity="0.7"
          />
          <polygon
            points="160,204 298,204 298,234 148,234"
            fill="url(#cellHighlight)"
            opacity="0.8"
          />
          <polygon
            points="302,204 440,204 452,234 302,234"
            fill="url(#cellHighlight)"
            opacity="0.9"
          />
        </g>

        {/* Energy Output Pulse Indicator */}
        <g transform="translate(300, 270)">
          <circle cx="0" cy="0" r="16" fill="#10b981" fillOpacity="0.2" />
          <circle cx="0" cy="0" r="10" fill="#10b981" fillOpacity="0.4" />
          <circle cx="0" cy="0" r="6" fill="#34d399" />
          <path d="M-2 -3 L2 0 L-2 3" stroke="#064e3b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Clean Energy Metric Floaters */}
        <g transform="translate(430, 90)">
          <rect x="0" y="0" width="130" height="42" rx="10" fill="#0c172b" stroke="#10b981" strokeWidth="1" />
          <circle cx="16" cy="21" r="5" fill="#10b981" />
          <text x="28" y="19" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Clean Yield</text>
          <text x="28" y="32" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">98.2% Optimal</text>
        </g>

        <g transform="translate(60, 260)">
          <rect x="0" y="0" width="125" height="42" rx="10" fill="#0c172b" stroke="#06b6d4" strokeWidth="1" />
          <circle cx="16" cy="21" r="5" fill="#06b6d4" />
          <text x="28" y="19" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Power Output</text>
          <text x="28" y="32" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">3.8 kW Live</text>
        </g>
      </svg>
    </div>
  );
};
