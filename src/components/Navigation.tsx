import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { DEMO_PRESETS } from '../utils/simpleSolarLogic';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

export type PageId = 'home' | 'plant' | 'health' | 'improve' | 'ai';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  selectedPresetId,
  onSelectPreset,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  const navItems: Array<{ id: PageId; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'plant', label: 'My Solar Plant', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'health', label: 'Check Panel Health', icon: <Activity className="w-5 h-5" /> },
    { id: 'improve', label: 'Improve Output', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'ai', label: 'Ask Solar AI', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#06172B]/95 backdrop-blur-md border-b border-slate-800/90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline - Clickable to Home */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3.5 text-left group cursor-pointer animate-logo-fade-in"
            aria-label="SolarIQ AI Home"
          >
            {/* Crisp Official Emblem with subtle float & hover glow */}
            <div className="relative w-12 h-12 rounded-2xl bg-[#06172B] border border-emerald-500/30 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 group-hover:shadow-emerald-500/25 transition-all logo-glow-hover">
              <img
                src={solariqEmblemImg}
                alt="SolarIQ AI Official Emblem"
                className="w-full h-full object-contain rounded-xl animate-logo-float"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-white tracking-tight flex items-center">
                  Solar<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#38BDF8]">IQ</span>
                  <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]">AI</span>
                </span>
                <span className="text-[11px] uppercase font-bold text-[#6EE7B7] bg-[#10B981]/15 border border-[#10B981]/40 px-2 py-0.5 rounded">
                  PROTOTYPE
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-400 font-medium hidden sm:block">
                Understand Your Solar. Improve Your Energy.
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2.5 rounded-xl text-base font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#10B981]/20 text-[#6EE7B7] shadow-sm border border-[#10B981]/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className={isActive ? 'text-[#6EE7B7]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* "Load Demo Example" Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                className="px-4 py-2.5 rounded-xl bg-[#0e243f] hover:bg-[#143257] border border-[#10B981]/50 text-[#F8FAFC] text-sm sm:text-base font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#6EE7B7]" />
                <span>Load Demo Example</span>
                <ChevronDown className="w-4 h-4 text-slate-300 ml-1" />
              </button>

              {presetDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-[#06172B] border border-[#10B981]/40 rounded-2xl p-2.5 shadow-2xl z-50 space-y-1.5"
                  onMouseLeave={() => setPresetDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6EE7B7] border-b border-slate-800">
                    Select a Reproducible Scenario:
                  </div>
                  {DEMO_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onSelectPreset(preset.id);
                          setPresetDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{preset.name}</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-[#6EE7B7]">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#06172B] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/50'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6EE7B7] px-3 block mb-2">
              Preset Scenarios:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center cursor-pointer border ${
                    selectedPresetId === preset.id
                      ? 'bg-[#10B981] text-[#06172B] border-[#10B981]'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
