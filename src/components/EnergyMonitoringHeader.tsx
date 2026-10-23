import React from 'react';
import { Zap, SunMedium, Gauge, TrendingDown, DollarSign, MapPin, Layers } from 'lucide-react';
import { InstallationSummary, SolarInstallation } from '../types/solar';

interface EnergyMonitoringHeaderProps {
  installation: SolarInstallation;
  summary: InstallationSummary;
  scenarioName: string;
}

export const EnergyMonitoringHeader: React.FC<EnergyMonitoringHeaderProps> = ({
  installation,
  summary,
  scenarioName,
}) => {
  // Determine color coding for performance ratio
  const getPrColor = (pr: number) => {
    if (pr >= 90) return 'text-emerald-400';
    if (pr >= 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getPrBg = (pr: number) => {
    if (pr >= 90) return 'bg-emerald-500/10 border-emerald-500/30';
    if (pr >= 75) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-rose-500/10 border-rose-500/30';
  };

  return (
    <section aria-labelledby="energy-monitoring-title" className="space-y-3">
      {/* Installation meta banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 bg-slate-900/50 border border-slate-800/80 rounded-lg px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {installation.name}
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            {installation.location}
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span>{installation.panelCount} × {installation.panelRatingW}W Panels ({installation.capacityKwp} kWp Total)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-500">Active Profile:</span>
          <span className="text-slate-200 font-medium">{scenarioName}</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Inv. Efficiency: {(installation.inverterEfficiency * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Metric 1: Current Power Output in kW */}
        <div className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Current Power</span>
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
              <span>{summary.currentPowerKw}</span>
              <span className="text-xs font-medium text-slate-400">kW</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instantaneous AC feed-in
            </p>
          </div>
        </div>

        {/* Metric 2: Today's Energy Production in kWh */}
        <div className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Today's Generation</span>
            <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <SunMedium className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
              <span>{summary.todayEnergyKwh}</span>
              <span className="text-xs font-medium text-slate-400">kWh</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Accumulated diurnal total
            </p>
          </div>
        </div>

        {/* Metric 3: Expected Energy Production in kWh */}
        <div className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Expected Production</span>
            <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
              <span>{summary.expectedEnergyKwh}</span>
              <span className="text-xs font-medium text-slate-400">kWh</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard irradiance baseline
            </p>
          </div>
        </div>

        {/* Metric 4: Performance Ratio */}
        <div className={`bg-[#0c1222] border rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between ${getPrBg(summary.performanceRatio)}`}>
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Performance Ratio</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">IEC 61724</span>
          </div>
          <div>
            <div className={`text-2xl font-bold tracking-tight flex items-baseline gap-1 ${getPrColor(summary.performanceRatio)}`}>
              <span>{summary.performanceRatio}%</span>
              <span className="text-xs font-normal text-slate-400">PR</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {summary.performanceRatio >= 90 ? 'Operating at high yield' : summary.performanceRatio >= 75 ? 'Yield slightly degraded' : 'Severe deficit detected'}
            </p>
          </div>
        </div>

        {/* Metric 5: Estimated Performance Loss */}
        <div className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-3.5 hover:border-slate-700 transition-all col-span-2 md:col-span-3 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Estimated Loss</span>
            <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-rose-300 flex items-baseline gap-2">
              <span>-{summary.estimatedLossKwh}</span>
              <span className="text-xs font-medium text-slate-400">kWh</span>
              <span className="text-xs text-rose-400 font-semibold flex items-center">
                (-${summary.estimatedLossCost})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Diurnal yield deficit vs model
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
