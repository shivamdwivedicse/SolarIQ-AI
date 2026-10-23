import React from 'react';
import {
  Sun,
  ArrowRight,
  Sparkles,
  Activity,
  Layers,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { PageId } from '../components/Navigation';
import modernSolarHouseImg from '../assets/images/modern_solar_house_1792772736106.jpg';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onLoadPreset: (presetId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLoadPreset }) => {
  return (
    <div className="bg-[#06172B] text-slate-100 space-y-14 sm:space-y-16 py-4">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-6 sm:pb-8">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
              
              {/* Official Brand Badge with Emblem & Subtle Float */}
              <div className="inline-flex items-center gap-3 px-4.5 py-2 rounded-2xl bg-[#0e243f]/90 border border-[#10B981]/40 text-white text-sm sm:text-base font-bold shadow-xl shadow-[#10B981]/15 animate-logo-fade-in logo-glow-hover">
                <div className="w-8 h-8 rounded-xl bg-[#06172B] border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0">
                  <img
                    src={solariqEmblemImg}
                    alt="SolarIQ AI Official Emblem"
                    className="w-full h-full object-contain rounded-lg animate-logo-float"
                  />
                </div>
                <span className="text-[#6EE7B7]">SolarIQ AI</span>
                <span className="text-slate-500 hidden sm:inline">·</span>
                <span className="text-slate-200 hidden sm:inline">Next-Gen Solar Intelligence</span>
              </div>

              {/* Main Headline (36-54px) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12]">
                Make Every{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#6EE7B7]">
                  Ray Count.
                </span>
              </h1>

              {/* Subheading (18-20px) */}
              <p className="text-lg sm:text-[20px] text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Monitor solar panel health, understand energy losses, and discover smarter ways to improve your solar power generation.
              </p>

              {/* Two Prominent Action Buttons (17-19px) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('plant')}
                  className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-[#06172B] font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#10B981]/25 transition-all cursor-pointer active:scale-95"
                >
                  <Sun className="w-5 h-5 fill-[#06172B]" />
                  <span>Explore My Solar Plant</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    onLoadPreset('dusty');
                    onNavigate('health');
                  }}
                  className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-[#0e243f] hover:bg-[#143257] border border-[#38BDF8]/40 hover:border-[#38BDF8] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-5 h-5 text-[#38BDF8]" />
                  <span>Try Interactive Demo</span>
                </button>
              </div>

              {/* 3 Small Feature Highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#6EE7B7] font-bold text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Smarter Monitoring</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-400">Live DC-to-AC yield tracking</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#38BDF8] font-bold text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>AI Recommendations</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-400">Instant plain-English advice</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 font-bold text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Better Solar Output</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-400">Recover up to 20% lost power</p>
                </div>
              </div>

            </div>

            {/* Right Column: Prominent Modern Solar House Image Asset */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 group">
                {/* Image */}
                <img
                  src={modernSolarHouseImg}
                  alt="Modern architectural luxury eco-villa with rooftop solar panels and mountains"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Seamless vignette blending image naturally into dark navy #06172B */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06172B] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06172B]/50 via-transparent to-[#06172B]/30" />

                {/* SolarIQ AI System Overlay Badge */}
                <div className="absolute top-5 left-5 bg-[#06172B]/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-2xl">
                  <img
                    src={solariqEmblemImg}
                    alt="SolarIQ AI System Active"
                    className="w-7 h-7 rounded-lg object-contain"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>SolarIQ AI Active</span>
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Telemetry Synchronized</span>
                  </div>
                </div>

                {/* Floating Live Telemetry Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#06172B]/90 backdrop-blur-md border border-[#10B981]/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#6EE7B7] shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#6EE7B7] tracking-wider block">
                      Active Rooftop Array
                    </span>
                    <div className="text-base font-black text-white">
                      3.88 kW Live · 98.2% Optimal
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5. LIVE ARRAY TELEMETRY & IMPACT PULSE (Visual Bridge Eliminating Empty Space) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0d223a] via-[#091b30] to-[#0d223a] border border-[#10B981]/30 hover:border-[#10B981]/50 transition-colors rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle atmospheric glow behind telemetry bar */}
          <div className="absolute -top-12 left-1/3 w-80 h-32 bg-[#10B981]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 right-1/4 w-80 h-32 bg-[#38BDF8]/15 blur-3xl pointer-events-none" />

          {/* Top Bar: Live Status & Protocol */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-700/70">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                Live Array Intelligence &amp; Fleet Impact Pulse
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-[#06172B] border border-emerald-500/30 text-[#6EE7B7] font-mono">
                IEC 61724-1 Standard
              </span>
              <span className="hidden md:inline text-slate-400">·</span>
              <span className="hidden md:inline text-slate-300">Verified Solar Physics Core</span>
            </div>
          </div>

          {/* 4 Rich Telemetry Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            
            <div className="bg-[#06172B]/80 border border-slate-700/60 rounded-2xl p-4.5 space-y-2 hover:border-[#10B981]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Energy Tracked</span>
                <Zap className="w-4 h-4 text-[#6EE7B7]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                14,850+ <span className="text-sm font-semibold text-[#6EE7B7]">kWh</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active solar generation monitored across residential systems today.
              </p>
            </div>

            <div className="bg-[#06172B]/80 border border-slate-700/60 rounded-2xl p-4.5 space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Power Recovered</span>
                <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                +18% <span className="text-sm font-semibold text-[#38BDF8]">to +24%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Average yield restored after clearing soiling, pollen, and midday shade.
              </p>
            </div>

            <div className="bg-[#06172B]/80 border border-slate-700/60 rounded-2xl p-4.5 space-y-2 hover:border-amber-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Diagnostic</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                &lt; 30 <span className="text-sm font-semibold text-amber-400">Seconds</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rapid 3-point analysis of expected watts, output, and cell temperature.
              </p>
            </div>

            <div className="bg-[#06172B]/80 border border-slate-700/60 rounded-2xl p-4.5 space-y-2 hover:border-[#6EE7B7]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Accuracy</span>
                <ShieldCheck className="w-4 h-4 text-[#6EE7B7]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                100% <span className="text-sm font-semibold text-[#6EE7B7]">Transparent</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deterministic calculation logic paired with Gemini plain-English advisor.
              </p>
            </div>

          </div>

          {/* Quick Scenario Launcher Strip */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="text-sm font-bold text-white block">
                Want to test your panels right now?
              </span>
              <span className="text-xs text-slate-300">
                Launch a pre-configured scenario to see SolarIQ AI detect loss instantly:
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  onLoadPreset('clean');
                  onNavigate('health');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#06172B] hover:bg-[#10B981]/20 border border-[#10B981]/40 text-xs sm:text-sm font-bold text-[#6EE7B7] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>☀️</span>
                <span>Clean &amp; Sunny</span>
                <span className="text-[10px] text-emerald-400 font-mono font-normal">(-5% Loss)</span>
              </button>

              <button
                onClick={() => {
                  onLoadPreset('dusty');
                  onNavigate('health');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#06172B] hover:bg-amber-500/20 border border-amber-500/40 text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>🍂</span>
                <span>Dusty Panels</span>
                <span className="text-[10px] text-amber-300 font-mono font-normal">(-22.5% Loss)</span>
              </button>

              <button
                onClick={() => {
                  onLoadPreset('hot');
                  onNavigate('health');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#06172B] hover:bg-rose-500/20 border border-rose-500/40 text-xs sm:text-sm font-bold text-rose-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>🔥</span>
                <span>Heatwave Alert</span>
                <span className="text-[10px] text-rose-300 font-mono font-normal">(-35% Loss)</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 border border-rose-800/50 px-3.5 py-1 rounded-full">
            The Solar Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight">
            Why Solar Owners Lose Money Without Knowing It
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Millions of rooftop solar arrays silently operate below their designed output. Here is why:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Problem Card 1 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 hover:border-[#38BDF8]/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black text-2xl">
                01
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Panels Produce Less Than Expected
              </h3>
              <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
                Rooftop systems frequently generate 15% to 35% less electricity than their manufacturer rating due to accumulated dust, bird droppings, or high summer heatwaves.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-sm font-semibold text-rose-300">
              Result: Unnoticed loss on your monthly electricity bill
            </div>
          </div>

          {/* Problem Card 2 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 hover:border-[#38BDF8]/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-2xl">
                02
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Performance Problems Are Hard to Spot
              </h3>
              <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
                Standard inverter apps only show confusing raw wattage numbers or technical fault codes. Everyday homeowners cannot tell if a power drop is normal or a sign of trouble.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-sm font-semibold text-amber-300">
              Result: Endless confusion and frustrating guesswork
            </div>
          </div>

          {/* Problem Card 3 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 hover:border-[#38BDF8]/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] flex items-center justify-center font-black text-2xl">
                03
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Users Need Actionable Next Steps
              </h3>
              <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
                Knowing that power is low is not enough. Homeowners need clear, practical recommendations: when to wash panels, how to manage midday loads, and when to call a technician.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-sm font-semibold text-[#6EE7B7]">
              Result: Clear decisions that restore lost clean energy
            </div>
          </div>

        </div>
      </section>

      {/* 3. OUR SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0e243f] via-[#06172B] to-[#0e243f] border border-[#10B981]/40 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6EE7B7] bg-[#10B981]/20 border border-[#10B981]/40 px-3.5 py-1 rounded-full">
                Our Solution
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight leading-tight">
                Clear Answers &amp; Smarter Solar Decisions
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                SolarIQ AI translates complex electrical telemetry into simple, plain English. We compare your actual power output against mathematical expectations to calculate exact percentage losses, highlight potential causes, and deliver step-by-step optimization recommendations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#6EE7B7] shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-slate-200">
                    <strong className="text-white">Deterministic Logic:</strong> Transparent calculation rules you can verify.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-slate-200">
                    <strong className="text-white">Gemini AI Advisor:</strong> Ask any question in plain English anytime.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#06172B]/90 border border-slate-700/80 rounded-3xl p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-700/80">
                <img
                  src={solariqEmblemImg}
                  alt="SolarIQ AI"
                  className="w-10 h-10 rounded-xl object-contain border border-emerald-500/30 p-1 bg-[#06172B]"
                />
                <div>
                  <div className="font-black text-white text-base">SolarIQ AI Diagnostic Core</div>
                  <span className="text-xs text-[#6EE7B7] font-semibold">Deterministic IEC 61724 Engine</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-[#6EE7B7] block">Healthy Profile</span>
                  <span className="text-xs text-slate-400">Normal irradiance &amp; clean glass</span>
                </div>
                <span className="text-sm font-mono font-bold text-[#6EE7B7]">&lt; 10% Gap</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-amber-300 block">Needs Inspection</span>
                  <span className="text-xs text-slate-400">Light dust or partial shade</span>
                </div>
                <span className="text-sm font-mono font-bold text-amber-400">10% – 25% Gap</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-rose-300 block">Critical Alert</span>
                  <span className="text-xs text-slate-400">Heavy debris or string fault</span>
                </div>
                <span className="text-sm font-mono font-bold text-rose-400">&ge; 25% Gap</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (Visual 3-Step Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6EE7B7] bg-[#10B981]/20 border border-[#10B981]/40 px-3.5 py-1 rounded-full">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight">
            How SolarIQ AI Works
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            From raw numbers to actionable energy intelligence in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 text-center space-y-5 hover:border-[#38BDF8]/50 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center font-black text-2xl shadow-lg shadow-[#38BDF8]/10">
              1
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Enter Panel Readings</h3>
            <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
              Input your panel's expected wattage, actual output, and surface temperature. Or click one of our 3 instant demo presets.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 text-center space-y-5 hover:border-[#10B981]/50 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#6EE7B7] flex items-center justify-center font-black text-2xl shadow-lg shadow-[#10B981]/10">
              2
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Analyze Performance</h3>
            <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
              Our deterministic math engine compares actual vs expected power, measures performance loss percentage, and classifies status.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-8 text-center space-y-5 hover:border-amber-500/50 transition-colors">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/10">
              3
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Optimize &amp; Recover Power</h3>
            <p className="text-base sm:text-[17px] text-slate-300 leading-relaxed font-normal">
              Receive step-by-step guidance on gentle rinsing, checking for tree shading, or scheduling midday appliances.
            </p>
          </div>

        </div>
      </section>

      {/* 5. FOUR KEY FEATURES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/50 px-3.5 py-1 rounded-full">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight">
            Explore SolarIQ AI
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Four purpose-built tools designed to demystify rooftop solar for any homeowner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <button
            onClick={() => onNavigate('plant')}
            className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-7 text-left hover:border-[#10B981]/60 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#6EE7B7] group-hover:scale-110 transition-transform">
                <Sun className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#6EE7B7] transition-colors">
                My Solar Plant
              </h3>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Real-time array metrics, live generation curve, energy flow diagram, and overall plant health.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-base font-bold text-[#6EE7B7] gap-2">
              <span>View Dashboard</span> <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Feature 2 */}
          <button
            onClick={() => onNavigate('health')}
            className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-7 text-left hover:border-sky-400/60 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                Check Panel Health
              </h3>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Test any panel in seconds with 3 inputs: expected watts, actual output, and temperature.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-base font-bold text-sky-400 gap-2">
              <span>Run Quick Check</span> <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Feature 3 */}
          <button
            onClick={() => onNavigate('improve')}
            className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-7 text-left hover:border-amber-400/60 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Improve Output
              </h3>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Five actionable best practices covering dust washing, shading audits, heat mitigation, and load shifting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-base font-bold text-amber-400 gap-2">
              <span>Explore Guide</span> <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Feature 4 */}
          <button
            onClick={() => onNavigate('ai')}
            className="bg-[#0e243f]/60 border border-slate-800 rounded-3xl p-7 text-left hover:border-[#6EE7B7]/60 transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#6EE7B7] transition-colors">
                Ask Solar AI
              </h3>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Chat with our Gemini-powered solar assistant. Ask why power dropped, how heat affects output, or when to wash your panels.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-base font-bold text-[#6EE7B7] gap-2">
              <span>Ask a Question</span> <ArrowRight className="w-4 h-4" />
            </div>
          </button>

        </div>
      </section>

      {/* 6. GET STARTED / CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0e243f] via-[#06172B] to-[#0e243f] border border-[#10B981]/40 rounded-3xl p-8 sm:p-16 text-center space-y-7 shadow-2xl relative overflow-hidden">
          
          {/* Emblem Brand Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#06172B] border border-emerald-500/40 p-2 flex items-center justify-center shadow-2xl shadow-[#10B981]/30 animate-logo-float">
            <img
              src={solariqEmblemImg}
              alt="SolarIQ AI"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight">
              Ready to See Your Solar in Action?
            </h2>
            <p className="text-base sm:text-lg text-slate-200">
              Explore the live solar plant dashboard or test an underperforming panel scenario in under two minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-3">
            <button
              onClick={() => onNavigate('plant')}
              className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-[#06172B] font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#10B981]/30 cursor-pointer active:scale-95 transition-all"
            >
              <span>Explore My Solar Plant</span>
              <ArrowRight className="w-5 h-5 text-[#06172B]" />
            </button>
            <button
              onClick={() => {
                onLoadPreset('hot');
                onNavigate('health');
              }}
              className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-[#0e243f] hover:bg-[#143257] border border-slate-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer transition-all"
            >
              <span>Load Hot Summer Scenario</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
