import React, { useState } from 'react';
import {
  Thermometer,
  Zap,
  Activity,
  Sun,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  HelpCircle,
  Settings2,
  RefreshCw,
} from 'lucide-react';
import { HealthStatus, PanelTelemetry, SolarInstallation, SystemThresholds } from '../types/solar';

interface PanelHealthMonitorProps {
  telemetry: PanelTelemetry;
  installation: SolarInstallation;
  thresholds: SystemThresholds;
  onUpdateThresholds: (thresholds: SystemThresholds) => void;
  onUpdateInput: (field: keyof PanelTelemetry, value: number) => void;
  onResetToScenario: (scenario: 'healthy' | 'underperforming' | 'high_temp') => void;
  activeScenario: 'healthy' | 'underperforming' | 'high_temp';
  onTriggerAiAnalysis: () => void;
}

export const PanelHealthMonitor: React.FC<PanelHealthMonitorProps> = ({
  telemetry,
  installation,
  thresholds,
  onUpdateThresholds,
  onUpdateInput,
  onResetToScenario,
  activeScenario,
  onTriggerAiAnalysis,
}) => {
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'Healthy':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Healthy',
          badgeClass: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          dotClass: 'bg-emerald-400',
        };
      case 'Warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'Warning Detected',
          badgeClass: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          dotClass: 'bg-amber-400',
        };
      case 'Critical':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
          label: 'Critical Alert',
          badgeClass: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
          dotClass: 'bg-rose-400',
        };
    }
  };

  const statusBadge = getStatusBadge(telemetry.healthStatus);

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Panel Health Monitoring &amp; Electrical Telemetry
            </h2>
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${statusBadge.badgeClass}`}>
              {statusBadge.icon}
              <span>{statusBadge.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time DC measurement (P = V × I) vs STC temperature-compensated irradiance baseline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showThresholdConfig
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Thresholds</span>
          </button>
          
          <button
            onClick={onTriggerAiAnalysis}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-cyan-900/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze with AI</span>
          </button>
        </div>
      </div>

      {/* Threshold Config Collapsible Panel */}
      {showThresholdConfig && (
        <div className="my-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Configurable Classification Thresholds (Engineering Parameters)
            </span>
            <button
              onClick={() =>
                onUpdateThresholds({
                  warningGapPercent: 10,
                  criticalGapPercent: 25,
                  warningTempC: 60,
                  criticalTempC: 75,
                  voltageSagWarningPercent: 15,
                })
              }
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>
          <p className="text-slate-400 text-[11px]">
            Adjust the boundary thresholds used by the deterministic classifier. Changes immediately reclassify the active panel state.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px]">Warning Gap Threshold (%)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={thresholds.warningGapPercent}
                onChange={(e) =>
                  onUpdateThresholds({ ...thresholds, warningGapPercent: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px]">Critical Gap Threshold (%)</label>
              <input
                type="number"
                min="10"
                max="80"
                value={thresholds.criticalGapPercent}
                onChange={(e) =>
                  onUpdateThresholds({ ...thresholds, criticalGapPercent: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px]">Warning Temp (°C)</label>
              <input
                type="number"
                min="40"
                max="80"
                value={thresholds.warningTempC}
                onChange={(e) =>
                  onUpdateThresholds({ ...thresholds, warningTempC: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px]">Critical Temp (°C)</label>
              <input
                type="number"
                min="60"
                max="95"
                value={thresholds.criticalTempC}
                onChange={(e) =>
                  onUpdateThresholds({ ...thresholds, criticalTempC: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Telemetry Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        
        {/* Input 1: Solar Irradiance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Solar Irradiance (G)
            </span>
            <span className="text-xs font-mono font-semibold text-amber-300">
              {telemetry.irradiance} W/m²
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1200"
            step="10"
            value={telemetry.irradiance}
            onChange={(e) => onUpdateInput('irradiance', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>0 (Night)</span>
            <span>1000 (STC Peak)</span>
            <span>1200</span>
          </div>
        </div>

        {/* Input 2: Panel Temperature */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              Panel Temp (T_cell)
            </span>
            <span className={`text-xs font-mono font-semibold ${telemetry.panelTemp >= 65 ? 'text-rose-400' : 'text-slate-200'}`}>
              {telemetry.panelTemp.toFixed(1)} °C
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="85"
            step="0.5"
            value={telemetry.panelTemp}
            onChange={(e) => onUpdateInput('panelTemp', Number(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>10°C</span>
            <span>25°C (STC)</span>
            <span>85°C (Extreme)</span>
          </div>
        </div>

        {/* Input 3: Voltage (V) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Array Voltage (V)
            </span>
            <span className="text-xs font-mono font-semibold text-cyan-300">
              {telemetry.voltage.toFixed(1)} V
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="0.2"
            value={telemetry.voltage}
            onChange={(e) => onUpdateInput('voltage', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>0V</span>
            <span>Nom. Vmp: {installation.nominalVmp}V</span>
            <span>Voc: {installation.nominalVoc}V</span>
          </div>
        </div>

        {/* Input 4: Current (A) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Array Current (I)
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-300">
              {telemetry.current.toFixed(1)} A
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="0.1"
            value={telemetry.current}
            onChange={(e) => onUpdateInput('current', Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>0A</span>
            <span>Nom. Imp: {installation.nominalImp}A</span>
            <span>Isc: {installation.nominalIsc}A</span>
          </div>
        </div>

      </div>

      {/* Calculated Electrical Power & Performance Gap Comparison Card */}
      <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Measured Power (P = V * I) */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Measured Electrical Power (DC)</span>
            <span className="font-mono text-cyan-400">P = V × I</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-white mt-1">
            {telemetry.measuredPower.toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-400">Watts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Calculation: {telemetry.voltage.toFixed(1)} V × {telemetry.current.toFixed(1)} A
          </p>
        </div>

        {/* Expected Power */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Model Expected Power</span>
            <span className="text-[10px] text-slate-500 font-mono">STC Adjusted</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-200 mt-1">
            {telemetry.expectedPower.toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-400">Watts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            STC {installation.panelRatingW}W × ({telemetry.irradiance}/1000) × Temp Derate
          </p>
        </div>

        {/* Performance Gap & Health Classification */}
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Performance Gap</span>
            <span className="text-[10px] text-slate-500 font-mono">Δ %</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className={`text-3xl font-bold tracking-tight ${
              telemetry.performanceGap >= thresholds.criticalGapPercent
                ? 'text-rose-400'
                : telemetry.performanceGap >= thresholds.warningGapPercent
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {telemetry.performanceGap.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-400">
              {telemetry.performanceGap <= 0
                ? 'On track'
                : `(${Math.max(0, telemetry.expectedPower - telemetry.measuredPower).toFixed(0)}W deficit)`}
            </span>
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                telemetry.performanceGap >= thresholds.criticalGapPercent
                  ? 'bg-rose-500'
                  : telemetry.performanceGap >= thresholds.warningGapPercent
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, telemetry.performanceGap * 2.5)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Alert Reason & Engineering Hypotheses Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="text-xs font-semibold text-slate-200">
              Alert Classification Reason:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {telemetry.alertReason}
            </p>

            {/* Scientific Hypotheses (Non-Definitive) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Plausible Scientific Hypotheses (Field Testing Required to Verify):
              </span>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {telemetry.hypotheses.map((hyp, idx) => (
                  <li key={idx} className="leading-snug">
                    {hyp}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-400/90 pt-1 italic">
                Engineering Rule: Telemetry measurements indicate behavioral discrepancies but never prove a specific internal physical fault in isolation. Certified thermography and string isolation are required.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
