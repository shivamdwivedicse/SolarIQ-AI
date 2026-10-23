import React, { useState } from 'react';
import {
  Sun,
  Zap,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { HourlySolarPoint, PanelCheckInputs, PanelCheckResult, SimpleHealthStatus } from '../types/solarSimple';
import { EnergyFlowDiagram } from '../components/EnergyFlowDiagram';
import { generateDiurnalCurve } from '../utils/simpleSolarLogic';

import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface MySolarPlantPageProps {
  inputs: PanelCheckInputs;
  checkResult: PanelCheckResult;
  onNavigateToCheck: () => void;
}

export const MySolarPlantPage: React.FC<MySolarPlantPageProps> = ({
  inputs,
  checkResult,
  onNavigateToCheck,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HourlySolarPoint | null>(null);

  // Scaled 10-panel residential plant simulation
  const plantActualKw = Number(((inputs.actualPowerWatts * 10) / 1000).toFixed(2));
  const plantExpectedKw = Number(((inputs.expectedPowerWatts * 10) / 1000).toFixed(2));
  const todayEnergyKwh = Number((plantActualKw * 4.8).toFixed(1));
  const expectedEnergyKwh = Number((plantExpectedKw * 5.0).toFixed(1));
  const performanceRatio = inputs.expectedPowerWatts > 0
    ? Math.round((inputs.actualPowerWatts / inputs.expectedPowerWatts) * 100)
    : 100;

  // Diurnal 24h curve data
  const hourlyData = generateDiurnalCurve(inputs);
  const maxWatts = Math.max(...hourlyData.map((d) => Math.max(d.expectedWatts, d.actualWatts, 100)));

  // Never communicate health status through colour alone: include readable status labels and icons
  const getStatusConfig = (status: SimpleHealthStatus) => {
    switch (status) {
      case 'Healthy':
        return {
          label: 'Healthy & Nominal',
          badgeClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600" />,
          summary: 'Panels are generating power within 10% of manufacturer targets.',
        };
      case 'Needs Inspection':
        return {
          label: 'Needs Inspection',
          badgeClass: 'bg-amber-50 border-amber-300 text-amber-950',
          icon: <AlertTriangle className="w-7 h-7 text-amber-600" />,
          summary: 'Noticeable power drop or high heat detected. Visual inspection suggested.',
        };
      case 'Critical':
        return {
          label: 'Critical Alert',
          badgeClass: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: <AlertOctagon className="w-7 h-7 text-rose-600" />,
          summary: 'Severe performance loss (>25%). Check for heavy dirt or tree shadows.',
        };
    }
  };

  const statusConfig = getStatusConfig(checkResult.status);

  return (
    <div className="bg-[#F4F8FC] min-h-screen py-10 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Title & Status Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-slate-200/90 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#06172B] border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-sm animate-logo-float">
                <img src={solariqEmblemImg} alt="SolarIQ AI" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full">
                SolarIQ Live Monitoring
              </span>
              <span className="text-xs font-mono uppercase text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#102A43] tracking-tight">
              My Solar Plant
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Real-time generation overview for your 10-panel rooftop solar array (4.0 kWp rated capacity)
            </p>
          </div>

          {/* Overall Status Pill */}
          <div className={`p-5 rounded-3xl border flex items-center gap-4 self-start lg:self-auto shadow-sm ${statusConfig.badgeClass}`}>
            <div className="p-3 rounded-2xl bg-white shadow-sm shrink-0">
              {statusConfig.icon}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-0.5">
                Overall Plant Status
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#102A43]">
                {statusConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* 1. Large Metric Cards with Simple Explanations & Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric 1: Today's Generation */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-base sm:text-lg font-bold text-[#102A43]">
                  Today's Generation
                </span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'today' ? null : 'today')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Today's generation info"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              {activeTooltip === 'today' && (
                <div className="p-4 mb-2 rounded-2xl bg-[#102A43] text-sm text-white shadow-xl z-20 leading-relaxed">
                  The total amount of clean electricity your panels produced so far today, measured in kilowatt-hours (kWh).
                </div>
              )}
              <div className="text-4xl sm:text-5xl font-black text-[#102A43] tracking-tight">
                {todayEnergyKwh}{' '}
                <span className="text-xl font-bold text-slate-400">kWh</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 pt-4 border-t border-slate-100 font-medium">
              Powers typical home appliances for ~24 hours
            </p>
          </div>

          {/* Metric 2: Current Power Output */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-base sm:text-lg font-bold text-[#102A43]">
                  Current Power Output
                </span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'power' ? null : 'power')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Current power info"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              {activeTooltip === 'power' && (
                <div className="p-4 mb-2 rounded-2xl bg-[#102A43] text-sm text-white shadow-xl z-20 leading-relaxed">
                  The live rate of electricity generation right now in kilowatts (kW). Clear midday sunlight produces the highest power.
                </div>
              )}
              <div className="text-4xl sm:text-5xl font-black text-[#059669] tracking-tight flex items-baseline gap-1.5">
                <span>{plantActualKw}</span>
                <span className="text-xl font-bold text-slate-400">kW</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 pt-4 border-t border-slate-100 font-medium">
              Live DC-to-AC power from 10 rooftop panels
            </p>
          </div>

          {/* Metric 3: Expected Target */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-base sm:text-lg font-bold text-[#102A43]">
                  Expected Target
                </span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'expected' ? null : 'expected')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Expected generation info"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              {activeTooltip === 'expected' && (
                <div className="p-4 mb-2 rounded-2xl bg-[#102A43] text-sm text-white shadow-xl z-20 leading-relaxed">
                  What a clean, unobstructed 4.0 kW solar array produces under today's clear sunshine.
                </div>
              )}
              <div className="text-4xl sm:text-5xl font-black text-[#102A43] tracking-tight flex items-baseline gap-1.5">
                <span>{expectedEnergyKwh}</span>
                <span className="text-xl font-bold text-slate-400">kWh</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 pt-4 border-t border-slate-100 font-medium">
              Calculated target based on sunlight hours
            </p>
          </div>

          {/* Metric 4: Performance Ratio */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-base sm:text-lg font-bold text-[#102A43]">
                  Performance Ratio
                </span>
                <button
                  onClick={() => setActiveTooltip(activeTooltip === 'ratio' ? null : 'ratio')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Performance ratio info"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              {activeTooltip === 'ratio' && (
                <div className="p-4 mb-2 rounded-2xl bg-[#102A43] text-sm text-white shadow-xl z-20 leading-relaxed">
                  The percentage of expected power your system is capturing. Over 90% is healthy; under 75% indicates dust, shade, or thermal loss.
                </div>
              )}
              <div className={`text-4xl sm:text-5xl font-black tracking-tight ${
                performanceRatio >= 90 ? 'text-[#059669]' : performanceRatio >= 75 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {performanceRatio}%
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 pt-4 border-t border-slate-100 font-medium">
              {checkResult.performanceLossPercent > 0
                ? `${checkResult.performanceLossPercent}% loss currently observed`
                : 'Operating at maximum solar potential'}
            </p>
          </div>

        </div>

        {/* 2. Interactive Solar Energy Flow Illustration (Light Theme) */}
        <EnergyFlowDiagram
          currentPowerWatts={inputs.actualPowerWatts}
          plantPowerKw={plantActualKw}
          status={checkResult.status}
          lightMode={true}
        />

        {/* 3. Simple Diurnal Actual vs Expected Chart */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight flex items-center gap-2.5">
                <BarChart3 className="w-6 h-6 text-[#059669]" />
                Today's Generation Curve (Actual vs Expected)
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Visual hour-by-hour comparison of actual electricity made vs modeled sunshine baseline
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-700 font-bold">
                <span className="w-3.5 h-3.5 rounded-sm bg-sky-500 inline-block" />
                Expected Target
              </span>
              <span className="flex items-center gap-2 text-slate-700 font-bold">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#059669] inline-block" />
                Actual Output
              </span>
              <span className="text-xs font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded font-bold">
                DEMO DATA
              </span>
            </div>
          </div>

          {/* Readout when hovering */}
          <div className="min-h-10 text-sm sm:text-base font-mono text-slate-700 flex items-center">
            {hoveredPoint ? (
              <span className="bg-slate-100 border border-slate-300 px-4 py-2 rounded-xl shadow-xs">
                Time: <strong className="text-[#102A43]">{hoveredPoint.timeLabel}</strong> · Actual: <strong className="text-[#059669]">{hoveredPoint.actualWatts} W</strong> · Expected: <strong className="text-sky-700">{hoveredPoint.expectedWatts} W</strong>
                {hoveredPoint.expectedWatts > hoveredPoint.actualWatts && (
                  <span className="text-amber-800 ml-2 font-bold">
                    (Gap: {hoveredPoint.expectedWatts - hoveredPoint.actualWatts}W)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500 italic">
                Hover over any hour column below to inspect exact power comparison
              </span>
            )}
          </div>

          {/* SVG Chart (Light Mode) */}
          <div className="w-full h-64 sm:h-72 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lightCurveExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Guide Lines */}
              {[0, 0.5, 1].map((ratio, i) => {
                const y = 190 - ratio * 150;
                return (
                  <g key={i}>
                    <line x1="30" y1={y} x2="780" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="5" y={y + 4} fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      {Math.round(ratio * maxWatts)}W
                    </text>
                  </g>
                );
              })}

              {/* Expected Area Curve */}
              <path
                d={
                  hourlyData.reduce((p, d, i) => {
                    const x = 30 + (i / 23) * 750;
                    const y = 190 - (d.expectedWatts / (maxWatts || 1)) * 150;
                    return `${p} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '') + ' L 780 190 L 30 190 Z'
                }
                fill="url(#lightCurveExpected)"
              />

              {/* Expected Line */}
              <path
                d={hourlyData.reduce((p, d, i) => {
                  const x = 30 + (i / 23) * 750;
                  const y = 190 - (d.expectedWatts / (maxWatts || 1)) * 150;
                  return `${p} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.5"
              />

              {/* Actual Output Bars */}
              {hourlyData.map((d) => {
                const x = 30 + (d.hour / 23) * 750;
                const barHeight = (d.actualWatts / (maxWatts || 1)) * 150;
                const y = 190 - barHeight;
                const isHovered = hoveredPoint?.hour === d.hour;

                return (
                  <g
                    key={d.hour}
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x - 9}
                      y={y}
                      width={18}
                      height={Math.max(2, barHeight)}
                      rx="4"
                      fill={isHovered ? '#10B981' : '#059669'}
                      fillOpacity={d.actualWatts > 0 ? 0.95 : 0.25}
                    />
                    {/* Wider hit zone */}
                    <rect x={x - 16} y="20" width="32" height="180" fill="transparent" />
                  </g>
                );
              })}

              {/* Hour X-Axis Labels */}
              {hourlyData
                .filter((_, i) => i % 3 === 0)
                .map((d) => {
                  const x = 30 + (d.hour / 23) * 750;
                  return (
                    <text key={d.hour} x={x} y="210" fill="#64748B" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      {d.timeLabel}
                    </text>
                  );
                })}
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 text-sm sm:text-base text-slate-600 gap-3">
            <span>Peak solar window occurs between 11:00 AM and 2:00 PM when sunshine angle is optimal.</span>
            <button
              onClick={onNavigateToCheck}
              className="text-[#059669] hover:text-[#047857] font-bold flex items-center gap-2 cursor-pointer self-start sm:self-auto text-base"
            >
              <span>Run Detailed Health Check</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
