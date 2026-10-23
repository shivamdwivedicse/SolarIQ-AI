import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Thermometer,
  Clock,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Filter,
  Info,
} from 'lucide-react';
import { HealthStatus, HistoricalAlert, HourlyDataPoint, SolarInstallation } from '../types/solar';

interface AnalyticsChartsProps {
  hourlyData: HourlyDataPoint[];
  installation: SolarInstallation;
  alerts: HistoricalAlert[];
  scenarioName: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  hourlyData,
  installation,
  alerts,
  scenarioName,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'generation' | 'temperature' | 'delta'>('generation');
  const [hoveredHour, setHoveredHour] = useState<HourlyDataPoint | null>(null);
  const [alertFilter, setAlertFilter] = useState<'ALL' | HealthStatus>('ALL');

  // Filter alerts
  const filteredAlerts = alerts.filter((a) => {
    if (alertFilter === 'ALL') return true;
    return a.severity === alertFilter;
  });

  // Calculate maximum values for SVG scaling
  const maxKw = Math.max(...hourlyData.map((d) => Math.max(d.expectedOutputKw, d.measuredOutputKw, 1)));
  const maxTemp = Math.max(...hourlyData.map((d) => Math.max(d.panelTemp, d.ambientTemp, 40)));

  return (
    <section aria-labelledby="analytics-section-title" className="space-y-4">
      {/* Header bar with DEMO DATA Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="analytics-section-title" className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Diurnal Analytics &amp; Generation Modeling
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
              DEMO DATA · SIMULATED 24H LOG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Diurnal curve reflects STC-adjusted PV irradiance model, dynamic thermal derating, and scenario parameters.
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveChartTab('generation')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeChartTab === 'generation'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Generation (Expected vs Measured)
          </button>
          <button
            onClick={() => setActiveChartTab('temperature')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeChartTab === 'temperature'
                ? 'bg-slate-800 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal Curve (Panel vs Ambient)
          </button>
          <button
            onClick={() => setActiveChartTab('delta')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeChartTab === 'delta'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Loss Delta (kW Gap)
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-lg relative">
        
        {/* Chart Legend & Live Inspector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-2 border-b border-slate-800/80 text-xs text-slate-300 gap-2">
          {activeChartTab === 'generation' && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" />
                <span className="text-slate-300 font-medium">Model Expected Output (kW)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                <span className="text-slate-300 font-medium">Measured Generation (kW)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-dashed border-t-2 border-dashed border-amber-400/80 inline-block" />
                <span className="text-slate-400">Building Demand Load (kW)</span>
              </span>
            </div>
          )}

          {activeChartTab === 'temperature' && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                <span className="text-slate-300 font-medium">Panel Cell Temperature (°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />
                <span className="text-slate-300 font-medium">Ambient Temperature (°C)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-rose-400/80 inline-block" />
                <span className="text-rose-400">Critical Limit (75°C)</span>
              </span>
            </div>
          )}

          {activeChartTab === 'delta' && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                <span className="text-slate-300 font-medium">Hourly Performance Deficit (kW Gap)</span>
              </span>
              <span className="text-slate-400">
                Peak deficit occurs during peak solar insolation
              </span>
            </div>
          )}

          {/* Hover readout indicator */}
          <div className="text-right font-mono text-xs text-slate-300">
            {hoveredHour ? (
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                Time: <strong className="text-white">{hoveredHour.timeLabel}</strong> · Meas: <strong className="text-emerald-400">{hoveredHour.measuredOutputKw} kW</strong> · Exp: <strong className="text-cyan-400">{hoveredHour.expectedOutputKw} kW</strong> · Temp: <strong className="text-rose-400">{hoveredHour.panelTemp}°C</strong>
              </span>
            ) : (
              <span className="text-slate-500 italic">Hover over any bar to inspect hourly telemetry</span>
            )}
          </div>
        </div>

        {/* SVG Visualization Area */}
        <div className="w-full h-64 sm:h-72 relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 280"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="measuredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = 240 - ratio * 200;
              return (
                <g key={idx}>
                  <line
                    x1="40"
                    y1={y}
                    x2="980"
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 ? 'none' : '4 4'}
                  />
                  <text
                    x="10"
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {activeChartTab === 'temperature'
                      ? `${(ratio * maxTemp).toFixed(0)}°`
                      : `${(ratio * maxKw).toFixed(1)}k`}
                  </text>
                </g>
              );
            })}

            {/* Peak solar window band (10:00 to 15:00) */}
            <rect
              x={40 + (10 / 24) * 940}
              y="40"
              width={(5 / 24) * 940}
              height="200"
              fill="#0ea5e9"
              fillOpacity="0.04"
            />
            <text
              x={40 + (12.5 / 24) * 940}
              y="55"
              fill="#38bdf8"
              fillOpacity="0.6"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Peak Solar Window (10:00 - 15:00)
            </text>

            {/* Generation View Rendering */}
            {activeChartTab === 'generation' && (
              <>
                {/* Area under Expected Curve */}
                <path
                  d={
                    hourlyData.reduce((path, d, i) => {
                      const x = 40 + (i / 23) * 940;
                      const y = 240 - (d.expectedOutputKw / (maxKw || 1)) * 200;
                      return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '') + ' L 980 240 L 40 240 Z'
                  }
                  fill="url(#expectedGrad)"
                />

                {/* Expected Line */}
                <path
                  d={hourlyData.reduce((path, d, i) => {
                    const x = 40 + (i / 23) * 940;
                    const y = 240 - (d.expectedOutputKw / (maxKw || 1)) * 200;
                    return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                {/* Measured Generation Bars / Area */}
                {hourlyData.map((d, i) => {
                  const x = 40 + (i / 23) * 940;
                  const barWidth = 18;
                  const barHeight = (d.measuredOutputKw / (maxKw || 1)) * 200;
                  const y = 240 - barHeight;
                  const isHovered = hoveredHour?.hour === d.hour;

                  return (
                    <g
                      key={d.hour}
                      onMouseEnter={() => setHoveredHour(d)}
                      onMouseLeave={() => setHoveredHour(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x - barWidth / 2}
                        y={y}
                        width={barWidth}
                        height={Math.max(1, barHeight)}
                        rx="3"
                        fill={isHovered ? '#34d399' : '#10b981'}
                        fillOpacity={d.measuredOutputKw > 0 ? 0.85 : 0}
                      />
                      {/* Transparent wider target for easy hover */}
                      <rect
                        x={x - 20}
                        y="40"
                        width="40"
                        height="200"
                        fill="transparent"
                      />
                    </g>
                  );
                })}

                {/* Building Load Line */}
                <path
                  d={hourlyData.reduce((path, d, i) => {
                    const x = 40 + (i / 23) * 940;
                    const y = 240 - (d.loadKw / (maxKw || 1)) * 200;
                    return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                />
              </>
            )}

            {/* Temperature View Rendering */}
            {activeChartTab === 'temperature' && (
              <>
                {/* 75°C Critical Threshold Line */}
                <line
                  x1="40"
                  y1={240 - (75 / (maxTemp || 1)) * 200}
                  x2="980"
                  y2={240 - (75 / (maxTemp || 1)) * 200}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Ambient Temp Line */}
                <path
                  d={hourlyData.reduce((path, d, i) => {
                    const x = 40 + (i / 23) * 940;
                    const y = 240 - (d.ambientTemp / (maxTemp || 1)) * 200;
                    return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />

                {/* Panel Temp Area */}
                <path
                  d={
                    hourlyData.reduce((path, d, i) => {
                      const x = 40 + (i / 23) * 940;
                      const y = 240 - (d.panelTemp / (maxTemp || 1)) * 200;
                      return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '') + ' L 980 240 L 40 240 Z'
                  }
                  fill="url(#tempGrad)"
                />

                {/* Panel Temp Line */}
                <path
                  d={hourlyData.reduce((path, d, i) => {
                    const x = 40 + (i / 23) * 940;
                    const y = 240 - (d.panelTemp / (maxTemp || 1)) * 200;
                    return `${path} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />

                {/* Temperature points */}
                {hourlyData.map((d, i) => {
                  const x = 40 + (i / 23) * 940;
                  const y = 240 - (d.panelTemp / (maxTemp || 1)) * 200;
                  const isHovered = hoveredHour?.hour === d.hour;

                  return (
                    <circle
                      key={d.hour}
                      cx={x}
                      cy={y}
                      r={isHovered ? 5 : 3}
                      fill={d.panelTemp >= 65 ? '#f43f5e' : '#fb7185'}
                      onMouseEnter={() => setHoveredHour(d)}
                      onMouseLeave={() => setHoveredHour(null)}
                      className="cursor-pointer"
                    />
                  );
                })}
              </>
            )}

            {/* Delta View (Loss Gap) */}
            {activeChartTab === 'delta' && (
              <>
                {hourlyData.map((d, i) => {
                  const x = 40 + (i / 23) * 940;
                  const deltaKw = Math.max(0, d.expectedOutputKw - d.measuredOutputKw);
                  const barHeight = (deltaKw / (maxKw || 1)) * 200;
                  const y = 240 - barHeight;
                  const isHovered = hoveredHour?.hour === d.hour;

                  return (
                    <g
                      key={d.hour}
                      onMouseEnter={() => setHoveredHour(d)}
                      onMouseLeave={() => setHoveredHour(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x - 8}
                        y={y}
                        width={16}
                        height={Math.max(1, barHeight)}
                        rx="3"
                        fill={isHovered ? '#fbbf24' : '#f59e0b'}
                        fillOpacity={deltaKw > 0 ? 0.85 : 0}
                      />
                      <rect
                        x={x - 15}
                        y="40"
                        width="30"
                        height="200"
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </>
            )}

            {/* X-Axis Hour Labels */}
            {hourlyData
              .filter((_, i) => i % 3 === 0)
              .map((d) => {
                const x = 40 + (d.hour / 23) * 940;
                return (
                  <text
                    key={d.hour}
                    x={x}
                    y="262"
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {d.timeLabel}
                  </text>
                );
              })}
          </svg>
        </div>

      </div>

      {/* Historical Health Alerts & Event Log */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Historical Health Alerts &amp; Diagnostic Event Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of automated electrical discrepancy triggers and resolution records
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start sm:self-auto">
            <span className="text-slate-500 text-[11px] px-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {(['ALL', 'Critical', 'Warning', 'Healthy'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setAlertFilter(filter)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  alertFilter === filter
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Discrepancy Event</th>
                <th className="py-2.5 px-3">Telemetry Gap</th>
                <th className="py-2.5 px-3">Suggested Remediation</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    }`}>
                      {alert.severity === 'Critical' ? (
                        <AlertOctagon className="w-3 h-3" />
                      ) : alert.severity === 'Warning' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                    {alert.timestamp}
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-slate-200">{alert.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {alert.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-amber-400 font-semibold">
                      -{alert.gapPercent}%
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {alert.measuredPowerW}W / {alert.expectedPowerW}W
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-sm">
                    {alert.suggestedRemediation}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      alert.status === 'Resolved'
                        ? 'bg-slate-800 text-slate-400'
                        : alert.status === 'Investigating'
                        ? 'bg-cyan-950/60 text-cyan-300'
                        : 'bg-amber-950/60 text-amber-300'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
