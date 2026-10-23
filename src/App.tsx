/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, PageId } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MySolarPlantPage } from './pages/MySolarPlantPage';
import { CheckPanelHealthPage } from './pages/CheckPanelHealthPage';
import { ImproveOutputPage } from './pages/ImproveOutputPage';
import { AskSolarAiPage } from './pages/AskSolarAiPage';
import { PanelCheckInputs, PanelCheckResult } from './types/solarSimple';
import {
  calculatePanelHealth,
  ConfigurableThresholds,
  DEFAULT_THRESHOLDS,
  DEMO_PRESETS,
} from './utils/simpleSolarLogic';

export default function App() {
  // Page Routing State (synchronized with URL hash)
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const hash = window.location.hash.replace('#', '') as PageId;
    if (['home', 'plant', 'health', 'improve', 'ai'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  // Active Demo Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('healthy');

  // Core Panel Telemetry Inputs (shared across plant, health check, improve, and AI)
  const [inputs, setInputs] = useState<PanelCheckInputs>({
    expectedPowerWatts: 400,
    actualPowerWatts: 388,
    panelTempCelsius: 38,
  });

  // Configurable Thresholds
  const [thresholds, setThresholds] = useState<ConfigurableThresholds>(DEFAULT_THRESHOLDS);

  // Calculated Check Result
  const [checkResult, setCheckResult] = useState<PanelCheckResult>(() =>
    calculatePanelHealth(
      {
        expectedPowerWatts: 400,
        actualPowerWatts: 388,
        panelTempCelsius: 38,
      },
      DEFAULT_THRESHOLDS
    )
  );

  // Sync hash with currentPage
  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (['home', 'plant', 'health', 'improve', 'ai'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Preset Loading
  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setInputs({ ...preset.inputs });
    const result = calculatePanelHealth(preset.inputs, thresholds);
    setCheckResult(result);
  };

  // Run Check
  const handleRunCheck = () => {
    const result = calculatePanelHealth(inputs, thresholds);
    setCheckResult(result);
  };

  const isDarkPage = currentPage === 'home' || currentPage === 'ai';

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${
      isDarkPage ? 'bg-[#06172B] text-slate-100' : 'bg-[#F4F8FC] text-slate-800'
    }`}>
      
      {/* Top Demo Disclaimer Notice */}
      <div className={`px-4 py-2.5 text-center text-sm font-medium transition-colors ${
        isDarkPage
          ? 'bg-[#040F1D] border-b border-slate-800/80 text-slate-300'
          : 'bg-slate-200/90 border-b border-slate-300 text-slate-700'
      }`}>
        <span className="inline-flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <strong className={isDarkPage ? 'text-[#6EE7B7] uppercase tracking-wider text-xs' : 'text-emerald-900 uppercase tracking-wider text-xs'}>
            DEMO DATA:
          </strong>
          Interactive prototype for hackathon presentation. Simulated rooftop telemetry.
        </span>
      </div>

      {/* Main Multi-Page Navigation Bar */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        selectedPresetId={selectedPresetId}
        onSelectPreset={(presetId) => {
          handleLoadPreset(presetId);
          // If on home, jump to health check to see the immediate result
          if (currentPage === 'home') {
            handleNavigate('health');
          }
        }}
      />

      {/* Multi-Page Views */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onLoadPreset={handleLoadPreset}
          />
        )}

        {currentPage === 'plant' && (
          <MySolarPlantPage
            inputs={inputs}
            checkResult={checkResult}
            onNavigateToCheck={() => handleNavigate('health')}
          />
        )}

        {currentPage === 'health' && (
          <CheckPanelHealthPage
            inputs={inputs}
            onUpdateInputs={setInputs}
            checkResult={checkResult}
            onRunCheck={handleRunCheck}
            thresholds={thresholds}
            onUpdateThresholds={setThresholds}
            onNavigateToImprove={() => handleNavigate('improve')}
          />
        )}

        {currentPage === 'improve' && (
          <ImproveOutputPage
            onNavigateToAi={() => handleNavigate('ai')}
          />
        )}

        {currentPage === 'ai' && (
          <AskSolarAiPage
            inputs={inputs}
            checkResult={checkResult}
          />
        )}
      </main>

      {/* Platform Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
