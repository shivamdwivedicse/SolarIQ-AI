import React from 'react';
import { Sun, Sparkles, FileText, CheckCircle2, AlertTriangle, AlertOctagon, ChevronDown } from 'lucide-react';
import { HealthStatus, SolarInstallation } from '../types/solar';
import { PRESET_INSTALLATIONS } from '../utils/solarCalculations';

interface NavbarProps {
  currentInstallation: SolarInstallation;
  onSelectInstallation: (inst: SolarInstallation) => void;
  activeScenario: 'healthy' | 'underperforming' | 'high_temp';
  onSelectScenario: (scenario: 'healthy' | 'underperforming' | 'high_temp') => void;
  healthStatus: HealthStatus;
  onOpenReport: () => void;
  onOpenAIModal: () => void;
  isAiDrawerOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentInstallation,
  onSelectInstallation,
  activeScenario,
  onSelectScenario,
  healthStatus,
  onOpenReport,
  onOpenAIModal,
  isAiDrawerOpen,
}) => {
  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Critical':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'Healthy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'Warning':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      case 'Critical':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090e1a]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
                <Sun className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">SolarIQ AI</span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-normal hidden sm:block">
                  Solar Energy Optimization &amp; Panel Health Monitoring System
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenAIModal}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isAiDrawerOpen
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Open AI Diagnostic Assistant"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </button>
              <button
                onClick={onOpenReport}
                className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-medium flex items-center gap-1"
                title="Generate Diagnostic Report"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls: Installation Selector, Demo Scenarios, Report, AI */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Installation selector */}
            <div className="relative">
              <label htmlFor="installation-select" className="sr-only">Select Solar Installation</label>
              <select
                id="installation-select"
                value={currentInstallation.id}
                onChange={(e) => {
                  const found = PRESET_INSTALLATIONS.find((inst) => inst.id === e.target.value);
                  if (found) onSelectInstallation(found);
                }}
                className="bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer appearance-none shadow-inner"
              >
                {PRESET_INSTALLATIONS.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.capacityKwp} kWp)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Demo Scenarios Segmented Controls */}
            <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase tracking-wider hidden md:inline">
                Demo Scenarios:
              </span>
              <button
                type="button"
                onClick={() => onSelectScenario('healthy')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeScenario === 'healthy'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Healthy
              </button>
              <button
                type="button"
                onClick={() => onSelectScenario('underperforming')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeScenario === 'underperforming'
                    ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Underperforming
              </button>
              <button
                type="button"
                onClick={() => onSelectScenario('high_temp')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeScenario === 'high_temp'
                    ? 'bg-amber-900/40 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. High-Temp
              </button>
            </div>

            {/* Current Health Status Pill */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${getStatusColor(healthStatus)}`}>
              {getStatusIcon(healthStatus)}
              <span>{healthStatus}</span>
            </div>

            {/* Action Buttons: Report & AI */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onOpenReport}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-300" />
                <span>Diagnostic Report</span>
              </button>
              <button
                onClick={onOpenAIModal}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                  isAiDrawerOpen
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-cyan-500/10'
                    : 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gemini Assistant</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
