import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PageId } from './Navigation';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#06172B] text-slate-300 text-base mt-20 relative overflow-hidden">
      {/* Subtle green ambient accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#10B981] to-transparent w-full opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info with Official Logo */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3.5 text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#06172B] border border-emerald-500/30 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 group-hover:shadow-emerald-500/25 transition-all logo-glow-hover">
                <img
                  src={solariqEmblemImg}
                  alt="SolarIQ AI Official Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <span className="font-black text-2xl text-white tracking-tight flex items-center">
                  Solar<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#38BDF8]">IQ</span>
                  <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]">AI</span>
                </span>
                <span className="text-xs text-slate-400 font-semibold block">
                  Official Clean Energy Platform
                </span>
              </div>
            </button>

            <p className="text-base text-slate-400 max-w-lg leading-relaxed font-normal">
              Understand Your Solar. Improve Your Energy. SolarIQ AI is an interactive platform built to help everyday homeowners and energy managers track rooftop solar generation, identify performance drops, and optimize clean power.
            </p>

            <div className="text-[#6EE7B7] font-bold tracking-wide text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Smart Solar. Brighter Tomorrow.</span>
            </div>
          </div>

          {/* Quick Platform Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold uppercase tracking-wider text-[#F8FAFC]">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-base">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#6EE7B7] text-slate-300 transition-colors cursor-pointer"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plant')}
                  className="hover:text-[#6EE7B7] text-slate-300 transition-colors cursor-pointer"
                >
                  My Solar Plant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('health')}
                  className="hover:text-[#6EE7B7] text-slate-300 transition-colors cursor-pointer"
                >
                  Check Panel Health
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('improve')}
                  className="hover:text-[#6EE7B7] text-slate-300 transition-colors cursor-pointer"
                >
                  Improve Output
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai')}
                  className="hover:text-[#6EE7B7] text-slate-300 transition-colors cursor-pointer"
                >
                  Ask Solar AI
                </button>
              </li>
            </ul>
          </div>

          {/* Demonstration & Engineering Specs */}
          <div className="space-y-3">
            <h4 className="text-base font-bold uppercase tracking-wider text-[#F8FAFC]">
              Hackathon Demonstration
            </h4>
            <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed font-normal">
              Designed for presentation and interactive prototyping. All sample readings are labeled as <strong>DEMO DATA</strong>.
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs uppercase font-mono px-3.5 py-1.5 rounded-xl bg-[#0e243f] border border-emerald-500/30 text-[#6EE7B7] font-bold">
                IEC 61724 Standard Model
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-slate-400 text-sm leading-relaxed">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">PROTOTYPE DISCLAIMER:</strong> SolarIQ AI is an interactive engineering prototype for demonstration and decision support. It is not a certified diagnostic system or safety-critical hardware controller. Physical verification requires certified on-site equipment.
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium shrink-0">
            © 2026 SolarIQ AI. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
