import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  BatteryCharging,
  Car,
  Flame,
  WashingMachine,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  FlexibleLoad,
  OptimizationRecommendation,
  PanelTelemetry,
  SolarInstallation,
} from '../types/solar';

interface OptimizationSectionProps {
  telemetry: PanelTelemetry;
  installation: SolarInstallation;
  recommendations: OptimizationRecommendation[];
  flexibleLoads: FlexibleLoad[];
  onToggleLoadShift: (loadId: string) => void;
}

export const OptimizationSection: React.FC<OptimizationSectionProps> = ({
  telemetry,
  installation,
  recommendations,
  flexibleLoads,
  onToggleLoadShift,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'maintenance' | 'loads'>('all');

  // Compute total shifted power and savings
  const totalShiftedKw = flexibleLoads
    .filter((l) => l.isShifted)
    .reduce((sum, l) => sum + l.powerKw, 0);

  const totalShiftedSavings = flexibleLoads
    .filter((l) => l.isShifted)
    .reduce((sum, l) => sum + l.estimatedSavings, 0);

  const filteredRecs = recommendations.filter((r) => {
    if (activeTab === 'maintenance') return r.type === 'General Maintenance' || r.type === 'Diagnostic Inspection';
    if (activeTab === 'loads') return r.category === 'load_shifting';
    return true;
  });

  const getLoadIcon = (id: string) => {
    switch (id) {
      case 'load-ev':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'load-heatpump':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'load-battery':
        return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
      default:
        return <WashingMachine className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section aria-labelledby="optimization-section-title" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 id="optimization-section-title" className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Solar Energy Optimization &amp; Yield Maximization
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational recommendations and smart dispatching to minimize export losses and restore nominal efficiency
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Insights ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Maintenance &amp; Inspection
          </button>
          <button
            onClick={() => setActiveTab('loads')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'loads'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Load Shifting
          </button>
        </div>
      </div>

      {/* Distinction Banner: General Recommendations vs Confirmed Faults */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl px-4 py-3 text-xs flex items-center gap-2.5 text-slate-300">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="leading-relaxed">
          <strong className="text-cyan-300">Analytical Distinction:</strong> Recommendations listed below represent optimization opportunities and diagnostic test proposals derived from telemetry modeling. They are <strong>not confirmed hardware failures</strong> until verified by field inspection.
        </span>
      </div>

      {/* Main Grid: Left side recommendations, Right side Interactive Load Shifter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column (2 cols): Recommendations Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#0c1222] border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-100">{rec.title}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      rec.type === 'Diagnostic Inspection'
                        ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                        : rec.type === 'Operational Optimization'
                        ? 'bg-cyan-950/60 border-cyan-600/40 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {rec.type}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      rec.impact === 'High'
                        ? 'text-rose-400 bg-rose-950/40'
                        : rec.impact === 'Medium'
                        ? 'text-amber-400 bg-amber-950/40'
                        : 'text-slate-400 bg-slate-800/50'
                    }`}>
                      {rec.impact} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
                {rec.estimatedKwhGainWeekly && (
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      +{rec.estimatedKwhGainWeekly} kWh/wk
                    </span>
                    <span className="block text-[10px] text-slate-500">Est. recovery</span>
                  </div>
                )}
              </div>

              {/* Action Steps Checklist */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Actionable Next Steps:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {rec.actionableSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (1 col): Interactive Smart Load Shifter */}
        <div className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Peak Solar Load Shifter
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dispatch flexible loads into the 11:00 AM – 2:30 PM solar window
                </p>
              </div>
            </div>

            {/* Savings summary */}
            <div className="my-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Active Dispatch Savings
                </span>
                <div className="text-lg font-bold text-emerald-300">
                  +${totalShiftedSavings.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">/ day</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Solar Absorbed:</span>
                <div className="text-sm font-semibold text-slate-200">
                  {totalShiftedKw.toFixed(1)} kW
                </div>
              </div>
            </div>

            {/* Loads List with Interactive Toggle */}
            <div className="space-y-2.5">
              {flexibleLoads.map((load) => (
                <div
                  key={load.id}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    load.isShifted
                      ? 'bg-slate-900/80 border-cyan-500/40 text-slate-100'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-slate-800/80 shrink-0">
                      {getLoadIcon(load.id)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{load.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>{load.powerKw} kW</span>
                        <span>·</span>
                        <span>{load.durationHours} hrs</span>
                        <span>·</span>
                        <span className="text-cyan-400">Opt: {load.recommendedWindow}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleLoadShift(load.id)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      load.isShifted
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {load.isShifted ? (
                      <>
                        <Check className="w-3 h-3" /> Shifted
                      </>
                    ) : (
                      'Shift'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2.5 leading-tight">
            Self-consumption calculation uses standard time-of-use (TOU) tariff delta ($0.28 peak import vs $0.06 export credit).
          </div>
        </div>

      </div>
    </section>
  );
};
