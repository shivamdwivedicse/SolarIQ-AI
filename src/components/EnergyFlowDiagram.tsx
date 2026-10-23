import React from 'react';
import { Sun, Layers, Zap, Home, ArrowRight } from 'lucide-react';

interface EnergyFlowDiagramProps {
  currentPowerWatts: number;
  plantPowerKw: number;
  status: string;
  lightMode?: boolean;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowDiagramProps> = ({
  currentPowerWatts,
  plantPowerKw,
  status,
  lightMode = false,
}) => {
  if (lightMode) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              Live Solar Energy Flow
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              How sunlight transforms into clean, usable electricity for your household
            </p>
          </div>
          <span className="text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
            Generating {plantPowerKw} kW AC
          </span>
        </div>

        {/* Visual Flow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative items-stretch">
          
          {/* Node 1: Sunlight */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-center space-y-3 relative group hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm mb-3">
                <Sun className="w-7 h-7 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 block mb-1">
                Step 1 · Radiation
              </span>
              <h4 className="text-lg font-bold text-[#102A43]">Sunlight</h4>
              <p className="text-sm sm:text-[15px] text-slate-600 mt-2 leading-relaxed">
                Solar irradiance hitting rooftop array surface (~850 W/m² today)
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-amber-800/80">
              Solar irradiance source
            </div>
          </div>

          {/* Node 2: Solar Panels */}
          <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-5 text-center space-y-3 relative group hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600 shadow-sm mb-3">
                <Layers className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 block mb-1">
                Step 2 · DC Power
              </span>
              <h4 className="text-lg font-bold text-[#102A43]">Solar Panels</h4>
              <p className="text-sm sm:text-[15px] text-slate-600 mt-2 leading-relaxed">
                Silicon photovoltaic cells convert light photons into <strong className="text-sky-900">{currentPowerWatts}W</strong> DC
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-sky-800/80">
              Array status: {status}
            </div>
          </div>

          {/* Node 3: Inverter / Electricity */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 relative group hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm mb-3">
                <Zap className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block mb-1">
                Step 3 · Inversion
              </span>
              <h4 className="text-lg font-bold text-[#102A43]">Inverter Conversion</h4>
              <p className="text-sm sm:text-[15px] text-slate-600 mt-2 leading-relaxed">
                Smart inverter transforms raw DC into <strong className="text-emerald-900">{plantPowerKw} kW</strong> usable 240V AC
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-800/80">
              97.5% conversion efficiency
            </div>
          </div>

          {/* Node 4: Home or Building */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5 text-center space-y-3 relative group hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 shadow-sm mb-3">
                <Home className="w-7 h-7" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 block mb-1">
                Step 4 · Consumption
              </span>
              <h4 className="text-lg font-bold text-[#102A43]">Home &amp; EV Loads</h4>
              <p className="text-sm sm:text-[15px] text-slate-600 mt-2 leading-relaxed">
                Powers household appliances, AC, refrigerator, and vehicle battery cleanly
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-purple-800/80">
              Zero grid import during peak
            </div>
          </div>

        </div>

        {/* Direction Indicator */}
        <div className="hidden md:flex items-center justify-between px-6 pt-2 text-slate-400">
          <div className="flex-1 h-1 bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-400 opacity-60 rounded-full mx-4" />
          <span className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            Continuous Clean Energy Flow <ArrowRight className="w-4 h-4 text-emerald-600" />
          </span>
          <div className="flex-1 h-1 bg-gradient-to-r from-emerald-400 via-purple-300 to-purple-400 opacity-60 rounded-full mx-4" />
        </div>
      </div>
    );
  }

  // Dark mode rendering
  return (
    <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            Live Solar Energy Flow
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mt-1">
            How sunlight transforms into clean, usable electricity for your household
          </p>
        </div>
        <span className="text-sm sm:text-base font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-4 py-1.5 rounded-full self-start sm:self-auto">
          Generating {plantPowerKw} kW AC
        </span>
      </div>

      {/* Visual Flow Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative items-stretch">
        
        {/* Node 1: Sunlight */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 text-center space-y-3 relative group hover:border-amber-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 mb-3">
              <Sun className="w-7 h-7 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
              Step 1 · Radiation
            </span>
            <h4 className="text-lg font-bold text-white">Sunlight</h4>
            <p className="text-sm sm:text-[15px] text-slate-300 mt-2 leading-relaxed">
              Solar irradiance hitting rooftop array surface (~850 W/m² today)
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-amber-400/80">
            Irradiance source
          </div>
        </div>

        {/* Node 2: Solar Panels */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3 relative group hover:border-cyan-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 mb-3">
              <Layers className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block mb-1">
              Step 2 · DC Power
            </span>
            <h4 className="text-lg font-bold text-white">Solar Panels</h4>
            <p className="text-sm sm:text-[15px] text-slate-300 mt-2 leading-relaxed">
              Silicon photovoltaic cells convert photons into <strong className="text-cyan-300">{currentPowerWatts}W</strong> DC
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-cyan-400/80">
            Array status: {status}
          </div>
        </div>

        {/* Node 3: Inverter / Electricity */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3 relative group hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 mb-3">
              <Zap className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Step 3 · Inversion
            </span>
            <h4 className="text-lg font-bold text-white">Inverter Conversion</h4>
            <p className="text-sm sm:text-[15px] text-slate-300 mt-2 leading-relaxed">
              Smart inverter turns DC into <strong className="text-emerald-300">{plantPowerKw} kW</strong> grid-synchronized AC
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-emerald-400/80">
            97.5% conversion efficiency
          </div>
        </div>

        {/* Node 4: Home or Building */}
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 text-center space-y-3 relative group hover:border-purple-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 mb-3">
              <Home className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-400 block mb-1">
              Step 4 · Consumption
            </span>
            <h4 className="text-lg font-bold text-white">Home &amp; EV Loads</h4>
            <p className="text-sm sm:text-[15px] text-slate-300 mt-2 leading-relaxed">
              Powers refrigerator, climate systems, lighting, and EV charger on clean sun power
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-purple-400/80">
            Zero grid import during peak
          </div>
        </div>

      </div>

      {/* Direction Indicator */}
      <div className="hidden md:flex items-center justify-between px-6 pt-2 text-slate-400">
        <div className="flex-1 h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 opacity-40 rounded-full mx-4" />
        <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Zero-Emission Continuous Flow <ArrowRight className="w-4 h-4 text-emerald-400" />
        </span>
        <div className="flex-1 h-1 bg-gradient-to-r from-emerald-400 via-purple-400 to-purple-500 opacity-40 rounded-full mx-4" />
      </div>
    </div>
  );
};
