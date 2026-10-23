import React, { useState } from 'react';
import {
  Droplets,
  Trees,
  Wind,
  Wrench,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Car,
  Flame,
  BatteryCharging,
  WashingMachine,
} from 'lucide-react';

import { PageId } from '../components/Navigation';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface ImproveOutputPageProps {
  onNavigateToAi: () => void;
}

export const ImproveOutputPage: React.FC<ImproveOutputPageProps> = ({ onNavigateToAi }) => {
  // Appliance timing simulator state
  const [shiftedAppliances, setShiftedAppliances] = useState<{ [key: string]: boolean }>({
    ev: true,
    washer: true,
    dishwasher: false,
    waterheater: true,
  });

  const toggleAppliance = (key: string) => {
    setShiftedAppliances((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const recommendations = [
    {
      id: 'cleanliness',
      title: '1. Check Panel Cleanliness',
      icon: <Droplets className="w-7 h-7 text-sky-600" />,
      badge: 'Surface Maintenance',
      badgeClass: 'bg-sky-50 border-sky-300 text-sky-900',
      whyItMatters:
        'Dust, bird droppings, pollen, and dried leaves act like a dark tint on your panel glass. Even a thin layer of dust can block 10% to 20% of sunlight from reaching the silicon cells.',
      whenToConsider:
        'Consider this after long dry spells without rain, during spring pollen season, or if your actual power stays 10% to 20% below expected on clear, cloudless days.',
      actionToTake:
        'Gently rinse the panels with clean water from a garden hose early in the morning when the glass is cool. Never use abrasive brushes, detergents, or high-pressure washers, and never spray cool water onto hot panels under direct midday sun.',
    },
    {
      id: 'shading',
      title: '2. Check for Shading',
      icon: <Trees className="w-7 h-7 text-emerald-600" />,
      badge: 'Obstacle Audit',
      badgeClass: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      whyItMatters:
        'Solar panels are wired together in electrical strings. A shadow cast over just one corner or single cell can choke the electrical current through the entire series of panels like a kinked hose.',
      whenToConsider:
        'Consider this if you notice sharp power drops during specific hours of the day (for instance, every afternoon at 1:30 PM), or when neighboring trees have grown over the past year.',
      actionToTake:
        'Observe your roof at 11:00 AM, 1:00 PM, and 3:00 PM to spot shadows from growing tree branches, chimneys, satellite dishes, or utility lines. Safely trim back overhanging tree branches.',
    },
    {
      id: 'temperature',
      title: '3. Monitor High Temperatures',
      icon: <Wind className="w-7 h-7 text-amber-600" />,
      badge: 'Airflow & Heat',
      badgeClass: 'bg-amber-50 border-amber-300 text-amber-900',
      whyItMatters:
        'Silicon solar cells naturally lose voltage as their temperature rises. For every degree above standard test conditions (25°C), electrical efficiency drops by roughly 0.4%. Extremely hot panels produce less electricity even under blinding sun.',
      whenToConsider:
        'Consider this during hot summer months (temperatures above 32°C ambient), or if your panel surface temperature readings consistently exceed 60°C to 70°C.',
      actionToTake:
        'Verify that the 4-inch gap between your roof tiles and the bottom of the panels is completely unobstructed. Clear away trapped dry leaves, bird nests, or debris that block natural convective cooling breezes.',
    },
    {
      id: 'electrical',
      title: '4. Inspect Electrical Connections',
      icon: <Wrench className="w-7 h-7 text-rose-600" />,
      badge: 'Hardware Safety',
      badgeClass: 'bg-rose-50 border-rose-300 text-rose-900',
      whyItMatters:
        'Over years of outdoor exposure to weather, thermal expansion, and humidity, wiring connectors and isolator switches can develop micro-corrosion or looseness, increasing electrical resistance.',
      whenToConsider:
        'Consider this if your panels are clean and fully unshaded, but power remains severely reduced (>25% loss) or your inverter displays persistent red or amber error codes.',
      actionToTake:
        'Check your inverter screen or companion mobile app for error codes or disconnected strings. Never touch high-voltage DC wiring yourself; schedule a certified solar electrician for a comprehensive diagnostic.',
    },
    {
      id: 'load_shifting',
      title: '5. Shift Flexible Electricity Usage to Midday',
      icon: <Clock className="w-7 h-7 text-purple-600" />,
      badge: 'Smart Usage',
      badgeClass: 'bg-purple-50 border-purple-300 text-purple-900',
      whyItMatters:
        'Electricity exported back to the grid often receives very low feed-in credits (e.g. 5¢ to 7¢ per kWh), while electricity imported at night is expensive (25¢ to 35¢ per kWh). Consuming your own free solar energy directly gives you the highest financial return.',
      whenToConsider:
        'Consider this every sunny day, especially if you have high daytime solar generation that goes unconsumed while family members are away from home.',
      actionToTake:
        'Use simple built-in appliance delay timers or smart plugs to schedule heavy electricity consumers (EV charging, dishwasher, washing machine, pool pumps) between 11:00 AM and 2:00 PM.',
    },
  ];

  return (
    <div className="bg-[#F4F8FC] min-h-screen py-10 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200/90 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#06172B] border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-sm animate-logo-float">
                <img src={solariqEmblemImg} alt="SolarIQ AI" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full">
                SolarIQ Optimization Guide
              </span>
              <span className="text-xs font-mono uppercase text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded font-bold">
                PRACTICAL GUIDE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#102A43] tracking-tight">
              Improve My Solar Output
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Five simple, proven practices to recover lost clean energy and maximize your rooftop solar investment
            </p>
          </div>

          <button
            onClick={onNavigateToAi}
            className="text-base font-bold text-white bg-[#059669] hover:bg-[#047857] px-6 py-4 rounded-2xl shadow-lg shadow-[#059669]/25 flex items-center gap-2.5 self-start sm:self-auto cursor-pointer transition-all hover:gap-3.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Ask Solar AI for Advice</span>
          </button>
        </div>

        {/* Measurement Disclaimer Note */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-sm sm:text-base text-amber-950 flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-950 font-bold block mb-1">Measurement Notice:</strong>
            Real solar gains depend on your local sunlight, roof orientation, and weather. We do not promise fixed financial or kilowatt savings without on-site sensor measurements. These recommendations represent standard photovoltaic best practices.
          </div>
        </div>

        {/* 5 Illustrated Recommendation Cards (White Cards, Deep Navy Titles) */}
        <div className="space-y-8">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-sm hover:shadow-md transition-all space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {rec.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                    {rec.title}
                  </h2>
                </div>
                <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border self-start sm:self-auto ${rec.badgeClass}`}>
                  {rec.badge}
                </span>
              </div>

              {/* Content 3-part layout: Why it matters, When to consider, What action to take */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Why It Matters */}
                <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-[#102A43] uppercase tracking-wider block text-xs sm:text-sm mb-1">
                      Why It Matters
                    </span>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                      {rec.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* When To Consider */}
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/70 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-amber-900 uppercase tracking-wider block text-xs sm:text-sm mb-1">
                      When To Consider
                    </span>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                      {rec.whenToConsider}
                    </p>
                  </div>
                </div>

                {/* Action To Take */}
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/70 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 uppercase tracking-wider block text-xs sm:text-sm mb-1">
                      Action To Take
                    </span>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                      {rec.actionToTake}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Interactive Midday Appliance Timing Helper */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight flex items-center gap-2.5">
                <Clock className="w-6 h-6 text-[#059669]" />
                Interactive Midday Appliance Schedule
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Toggle high-power appliances into your peak 11:00 AM – 2:00 PM solar generation window
              </p>
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full self-start sm:self-auto">
              Peak Sun Window: 11:00 AM – 2:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Appliance 1 */}
            <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              shiftedAppliances.ev ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-xs text-sky-600 shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#102A43]">EV Charging</h4>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">~7.2 kW Draw</span>
                </div>
              </div>
              <button
                onClick={() => toggleAppliance('ev')}
                className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  shiftedAppliances.ev
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {shiftedAppliances.ev ? 'Scheduled for 12:00 PM ✓' : 'Shift to Midday'}
              </button>
            </div>

            {/* Appliance 2 */}
            <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              shiftedAppliances.washer ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-xs text-emerald-600 shrink-0">
                  <WashingMachine className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#102A43]">Washing Machine</h4>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">~1.8 kW Draw</span>
                </div>
              </div>
              <button
                onClick={() => toggleAppliance('washer')}
                className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  shiftedAppliances.washer
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {shiftedAppliances.washer ? 'Scheduled for 1:00 PM ✓' : 'Shift to Midday'}
              </button>
            </div>

            {/* Appliance 3 */}
            <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              shiftedAppliances.waterheater ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-xs text-amber-600 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#102A43]">Water Heater</h4>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">~2.5 kW Draw</span>
                </div>
              </div>
              <button
                onClick={() => toggleAppliance('waterheater')}
                className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  shiftedAppliances.waterheater
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {shiftedAppliances.waterheater ? 'Scheduled for 11:30 AM ✓' : 'Shift to Midday'}
              </button>
            </div>

            {/* Appliance 4 */}
            <div className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              shiftedAppliances.dishwasher ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white shadow-xs text-purple-600 shrink-0">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#102A43]">Home Battery</h4>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">~3.3 kW Charge</span>
                </div>
              </div>
              <button
                onClick={() => toggleAppliance('dishwasher')}
                className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  shiftedAppliances.dishwasher
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {shiftedAppliances.dishwasher ? 'Scheduled for 12:30 PM ✓' : 'Shift to Midday'}
              </button>
            </div>

          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2">
            Tip: Most modern dishwashers, washing machines, and EV chargers feature a built-in "Delay Start" timer. Program them before leaving in the morning so they run cleanly on peak rooftop solar power!
          </p>
        </div>

      </div>
    </div>
  );
};
