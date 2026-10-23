import React, { useState } from 'react';
import {
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sliders,
  RefreshCw,
  Info,
} from 'lucide-react';
import { PanelCheckInputs, PanelCheckResult, SimpleHealthStatus } from '../types/solarSimple';
import { ConfigurableThresholds, DEFAULT_THRESHOLDS } from '../utils/simpleSolarLogic';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface CheckPanelHealthPageProps {
  inputs: PanelCheckInputs;
  onUpdateInputs: (updated: PanelCheckInputs) => void;
  checkResult: PanelCheckResult;
  onRunCheck: () => void;
  thresholds: ConfigurableThresholds;
  onUpdateThresholds: (updated: ConfigurableThresholds) => void;
  onNavigateToImprove: () => void;
}

export const CheckPanelHealthPage: React.FC<CheckPanelHealthPageProps> = ({
  inputs,
  onUpdateInputs,
  checkResult,
  onRunCheck,
  thresholds,
  onUpdateThresholds,
  onNavigateToImprove,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showThresholds, setShowThresholds] = useState(false);

  // Never communicate health status through colour alone; include readable status labels and icons.
  const getStatusBadge = (status: SimpleHealthStatus) => {
    switch (status) {
      case 'Healthy':
        return {
          label: 'Healthy & Nominal',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          cardClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeText: 'text-emerald-900 bg-emerald-100',
        };
      case 'Needs Inspection':
        return {
          label: 'Needs Inspection',
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          cardClass: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeText: 'text-amber-900 bg-amber-100',
        };
      case 'Critical':
        return {
          label: 'Critical Alert',
          icon: <AlertOctagon className="w-8 h-8 text-rose-600" />,
          cardClass: 'bg-rose-50 border-rose-300 text-rose-950',
          badgeText: 'text-rose-900 bg-rose-100',
        };
    }
  };

  const statusBadge = getStatusBadge(checkResult.status);

  // Power percentage for visual comparison bar
  const expectedWatts = Math.max(1, inputs.expectedPowerWatts);
  const actualWatts = Math.max(0, inputs.actualPowerWatts);
  const actualBarWidth = Math.min(100, Math.round((actualWatts / expectedWatts) * 100));

  return (
    <div className="bg-[#F4F8FC] min-h-screen py-10 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200/90 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#06172B] border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-sm animate-logo-float">
                <img src={solariqEmblemImg} alt="SolarIQ AI" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full">
                SolarIQ Diagnostic Checker
              </span>
              <span className="text-xs font-mono uppercase text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#102A43] tracking-tight">
              Check Panel Health
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Compare actual wattage against modeled expectations to diagnose power loss in seconds
            </p>
          </div>

          {/* Threshold Rules Button */}
          <button
            onClick={() => setShowThresholds(!showThresholds)}
            className="text-sm sm:text-base font-bold text-[#102A43] hover:text-[#059669] flex items-center gap-2.5 py-3 px-5 rounded-2xl bg-white border border-slate-300 shadow-sm transition-all cursor-pointer self-start sm:self-auto hover:border-emerald-300"
          >
            <Sliders className="w-5 h-5 text-[#059669]" />
            <span>{showThresholds ? 'Hide Threshold Rules' : 'Configure Threshold Rules'}</span>
          </button>
        </div>

        {/* Threshold Documentation Card (Collapsible) */}
        {showThresholds && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-bold text-[#102A43] flex items-center gap-2.5 text-base sm:text-lg">
                <Info className="w-5 h-5 text-[#059669]" />
                Clearly Documented Classification Thresholds
              </span>
              <button
                onClick={() => onUpdateThresholds(DEFAULT_THRESHOLDS)}
                className="text-[#059669] hover:underline flex items-center gap-1.5 text-sm font-bold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reset Default Rules
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Calculated dynamically in deterministic application code:
              <br />• <strong className="text-emerald-800">Healthy:</strong> Power loss &lt; {thresholds.lossWarningPercent}% and Temperature &lt; {thresholds.tempWarningCelsius}°C
              <br />• <strong className="text-amber-800">Needs Inspection:</strong> Power loss between {thresholds.lossWarningPercent}% and {thresholds.lossCriticalPercent}%, OR Temperature between {thresholds.tempWarningCelsius}°C and {thresholds.tempCriticalCelsius}°C
              <br />• <strong className="text-rose-800">Critical Alert:</strong> Power loss &ge; {thresholds.lossCriticalPercent}%, OR Temperature &ge; {thresholds.tempCriticalCelsius}°C
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="text-xs sm:text-sm text-slate-700 font-bold block mb-1">Warning Loss (%)</label>
                <input
                  type="number"
                  value={thresholds.lossWarningPercent}
                  onChange={(e) => onUpdateThresholds({ ...thresholds, lossWarningPercent: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-[#102A43] font-bold text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-slate-700 font-bold block mb-1">Critical Loss (%)</label>
                <input
                  type="number"
                  value={thresholds.lossCriticalPercent}
                  onChange={(e) => onUpdateThresholds({ ...thresholds, lossCriticalPercent: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-[#102A43] font-bold text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-slate-700 font-bold block mb-1">Warning Temp (°C)</label>
                <input
                  type="number"
                  value={thresholds.tempWarningCelsius}
                  onChange={(e) => onUpdateThresholds({ ...thresholds, tempWarningCelsius: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-[#102A43] font-bold text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-slate-700 font-bold block mb-1">Critical Temp (°C)</label>
                <input
                  type="number"
                  value={thresholds.tempCriticalCelsius}
                  onChange={(e) => onUpdateThresholds({ ...thresholds, tempCriticalCelsius: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-[#102A43] font-bold text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Spacious 2-Column Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs + Primary Button + Visual Bar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Form Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-[#102A43]">
                  Panel Telemetry Inputs
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Enter three values to diagnose panel performance
                </p>
              </div>

              <div className="space-y-5">
                
                {/* Input 1: Expected Power */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label htmlFor="input-expected" className="text-base sm:text-[17px] font-bold text-[#102A43]">
                      Expected Power (Watts)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'expected' ? null : 'expected')}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Expected power info"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  {activeTooltip === 'expected' && (
                    <div className="absolute right-0 bottom-full mb-2 w-72 p-4 bg-[#102A43] text-sm text-white rounded-2xl shadow-2xl z-30 leading-relaxed">
                      The target wattage your panel is rated to produce under full midday sunshine (typically 350W – 450W per residential panel).
                    </div>
                  )}
                  <div className="relative">
                    <input
                      id="input-expected"
                      type="number"
                      min="0"
                      max="1000"
                      value={inputs.expectedPowerWatts}
                      onChange={(e) => onUpdateInputs({ ...inputs, expectedPowerWatts: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 rounded-2xl px-4 py-3.5 text-3xl font-black text-[#102A43]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Watts
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Clean, unobstructed rating baseline</p>
                </div>

                {/* Input 2: Actual Power */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label htmlFor="input-actual" className="text-base sm:text-[17px] font-bold text-[#102A43]">
                      Actual Power (Watts)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'actual' ? null : 'actual')}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Actual power info"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  {activeTooltip === 'actual' && (
                    <div className="absolute right-0 bottom-full mb-2 w-72 p-4 bg-[#102A43] text-sm text-white rounded-2xl shadow-2xl z-30 leading-relaxed">
                      The real-time power your panel or inverter string is currently generating right now.
                    </div>
                  )}
                  <div className="relative">
                    <input
                      id="input-actual"
                      type="number"
                      min="0"
                      max="1000"
                      value={inputs.actualPowerWatts}
                      onChange={(e) => onUpdateInputs({ ...inputs, actualPowerWatts: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 rounded-2xl px-4 py-3.5 text-3xl font-black text-[#102A43]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Watts
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Real-time electricity output measured</p>
                </div>

                {/* Input 3: Panel Temperature */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label htmlFor="input-temp" className="text-base sm:text-[17px] font-bold text-[#102A43]">
                      Panel Temperature (°C)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'temp' ? null : 'temp')}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Panel temperature info"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  {activeTooltip === 'temp' && (
                    <div className="absolute right-0 bottom-full mb-2 w-72 p-4 bg-[#102A43] text-sm text-white rounded-2xl shadow-2xl z-30 leading-relaxed">
                      Surface temperature of the solar panel. While higher heat naturally lowers voltage, temperature alone cannot confirm a physical defect.
                    </div>
                  )}
                  <div className="relative">
                    <input
                      id="input-temp"
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.panelTempCelsius}
                      onChange={(e) => onUpdateInputs({ ...inputs, panelTempCelsius: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 rounded-2xl px-4 py-3.5 text-3xl font-black text-[#102A43]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      °C
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Surface warmth under sunlight (25°C – 75°C)</p>
                </div>

              </div>

              {/* Large Emerald Green Primary Button: "Check My Panel" */}
              <button
                onClick={onRunCheck}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#059669]/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Zap className="w-6 h-6 fill-white" />
                <span>Check My Panel</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Visual Comparison: Expected vs Actual Power Bar */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-[#102A43] uppercase tracking-wider text-xs sm:text-sm">
                  Visual Power Ratio
                </span>
                <span className="text-slate-700 font-semibold">
                  Actual: <strong className="text-[#059669]">{actualWatts}W</strong> / Expected: <strong className="text-sky-700">{expectedWatts}W</strong>
                </span>
              </div>

              <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl h-6 overflow-hidden p-1 flex">
                <div
                  className={`h-full rounded-xl transition-all duration-500 ${
                    checkResult.status === 'Healthy'
                      ? 'bg-gradient-to-r from-emerald-500 to-[#059669]'
                      : checkResult.status === 'Needs Inspection'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-rose-500 to-rose-600'
                  }`}
                  style={{ width: `${actualBarWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-mono">
                <span>0W</span>
                <span className="font-bold text-[#102A43]">{actualBarWidth}% of Expected Target</span>
                <span>{expectedWatts}W (100%)</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Diagnostic Results + Explanation + Causes + Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Top Badges: Status + Loss % */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Status Badge */}
                <div className={`p-6 rounded-3xl border flex items-center gap-4 ${statusBadge.cardClass}`}>
                  <div className="p-3 rounded-2xl bg-white shadow-sm shrink-0">
                    {statusBadge.icon}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-0.5">
                      Panel Health Status
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#102A43]">
                      {statusBadge.label}
                    </div>
                  </div>
                </div>

                {/* Performance Loss */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
                    Δ%
                  </div>
                  <div>
                    <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-0.5">
                      Calculated Performance Loss
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#102A43]">
                      {checkResult.performanceLossPercent}%{' '}
                      <span className="text-sm font-semibold text-slate-500">
                        ({checkResult.lossWatts}W drop)
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Simple Explanation */}
              <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2">
                <span className="text-xs sm:text-sm font-bold text-[#102A43] uppercase tracking-wider block">
                  Diagnosis in Plain English:
                </span>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {checkResult.shortExplanation}
                </p>
              </div>

              {/* Possible Causes (Clearly labelled as possibilities rather than confirmed faults) */}
              <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <span className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider block">
                  Possible Causes (Unconfirmed Possibilities):
                </span>
                <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                  {checkResult.possibleCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span className="leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs sm:text-sm text-slate-500 pt-1 italic">
                  * Note: These are common non-confirmed possibilities suggested by your numbers. On-site physical inspection is required for confirmation.
                </p>
              </div>

              {/* Recommended Next Steps */}
              <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-3">
                <span className="text-xs sm:text-sm font-bold text-[#102A43] uppercase tracking-wider block">
                  Recommended Next Steps:
                </span>
                <ul className="space-y-3 text-sm sm:text-base text-slate-700">
                  {checkResult.recommendedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Temperature Rule Explanation */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-sm sm:text-base text-amber-950 flex items-start gap-3.5 shadow-xs">
                <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-amber-950 font-bold block mb-1">Temperature Principle:</strong>
                  {checkResult.temperatureExplanation}
                </div>
              </div>

              {/* Next Action Link */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNavigateToImprove}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-base sm:text-lg font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-md shadow-[#059669]/20 transition-all hover:gap-3.5"
                >
                  <span>Explore 5 Practical Ways to Improve Output</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
