import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  Table,
} from 'lucide-react';
import {
  HourlyDataPoint,
  InstallationSummary,
  OptimizationRecommendation,
  PanelTelemetry,
  SolarInstallation,
} from '../types/solar';

interface DiagnosticReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  installation: SolarInstallation;
  telemetry: PanelTelemetry;
  summary: InstallationSummary;
  recommendations: OptimizationRecommendation[];
  hourlyData: HourlyDataPoint[];
  scenarioName: string;
}

export const DiagnosticReportModal: React.FC<DiagnosticReportModalProps> = ({
  isOpen,
  onClose,
  installation,
  telemetry,
  summary,
  recommendations,
  hourlyData,
  scenarioName,
}) => {
  const [copied, setCopied] = useState(false);
  const reportDate = new Date().toLocaleString();

  if (!isOpen) return null;

  // Build markdown text report content
  const generateMarkdownReport = () => {
    return `# SolarIQ AI — Diagnostic & Solar Optimization Report
Generated on: ${reportDate}
Application: SolarIQ AI (Solar Energy Optimization & Panel Health Monitoring System)
Notice: Prototype decision-support report. On-site thermography/IV-curve testing required for certification.

========================================================================
1. SITE & INSTALLATION SPECIFICATIONS
========================================================================
- Installation Name:    ${installation.name}
- Array Capacity:       ${installation.capacityKwp} kWp (${installation.panelCount} panels @ ${installation.panelRatingW}W STC)
- Location:             ${installation.location}
- Inverter Efficiency:  ${(installation.inverterEfficiency * 100).toFixed(1)}%
- Temperature Coeff:    ${installation.tempCoefficient}% / °C
- Active Demo Profile:  ${scenarioName}

========================================================================
2. INSTANTANEOUS ELECTRICAL TELEMETRY & HEALTH CLASSIFICATION
========================================================================
- Measured DC Voltage:   ${telemetry.voltage.toFixed(2)} V
- Measured DC Current:   ${telemetry.current.toFixed(2)} A
- Measured DC Power:     ${telemetry.measuredPower.toFixed(1)} W (P = V * I)
- Model Expected Power:  ${telemetry.expectedPower.toFixed(1)} W (STC irradiance & temp adjusted)
- In-Plane Irradiance:   ${telemetry.irradiance} W/m²
- Panel Cell Temp:       ${telemetry.panelTemp.toFixed(1)} °C
- PERFORMANCE GAP:       ${telemetry.performanceGap.toFixed(1)}%
- HEALTH STATUS:         ${telemetry.healthStatus.toUpperCase()}

Alert Reason:
${telemetry.alertReason}

Scientific Hypotheses (Non-Definitive in Isolation):
${telemetry.hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}

========================================================================
3. ARRAY-WIDE DIURNAL ENERGY YIELD SUMMARY
========================================================================
- Current Array Output:  ${summary.currentPowerKw} kW
- Today's Total Yield:   ${summary.todayEnergyKwh} kWh
- Expected Model Yield:  ${summary.expectedEnergyKwh} kWh
- Performance Ratio:     ${summary.performanceRatio}% (IEC 61724 standard)
- Estimated Yield Loss:  ${summary.estimatedLossKwh} kWh (-$${summary.estimatedLossCost} USD est.)

========================================================================
4. ACTIONABLE OPTIMIZATION & REMEDIATION PLAN
========================================================================
${recommendations
  .map(
    (r, idx) => `
[${idx + 1}] ${r.title} (${r.type} - ${r.impact} Priority)
Description: ${r.description}
Actionable Steps:
${r.actionableSteps.map((s) => `  - ${s}`).join('\n')}
${r.estimatedKwhGainWeekly ? `  Estimated Weekly Recovery: +${r.estimatedKwhGainWeekly} kWh/week` : ''}`
  )
  .join('\n')}

========================================================================
5. ENGINEERING & SAFETY DISCLAIMER
========================================================================
This document was generated automatically by SolarIQ AI based on digital telemetry and mathematical PV models. In solar engineering, sensor readings alone cannot confirm internal cell delamination, micro-cracks, or diode failures without physical verification. High DC voltages present life-safety hazards; all physical diagnostics and electrical terminations must be performed by certified solar technicians.
`;
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolarIQ_Diagnostic_Report_${installation.id}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Hour',
      'Time',
      'Irradiance_W_m2',
      'Ambient_Temp_C',
      'Panel_Temp_C',
      'Expected_Output_kW',
      'Measured_Output_kW',
      'Deficit_kW',
      'Building_Load_kW',
    ];
    const rows = hourlyData.map((d) => [
      d.hour,
      d.timeLabel,
      d.irradiance,
      d.ambientTemp,
      d.panelTemp,
      d.expectedOutputKw,
      d.measuredOutputKw,
      Math.max(0, d.expectedOutputKw - d.measuredOutputKw).toFixed(2),
      d.loadKw,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SolarIQ_Hourly_Data_${installation.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0b1120] border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                SolarIQ System Diagnostic &amp; Optimization Report
              </h3>
              <p className="text-xs text-slate-400">
                Generated {reportDate} · {installation.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Action Bar */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Export Formats:</span>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report (.md)</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV Telemetry</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Formatted Report Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 bg-[#080d17]">
          
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Diagnostic Executive Summary
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                telemetry.healthStatus === 'Critical'
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : telemetry.healthStatus === 'Warning'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}>
                {telemetry.healthStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {telemetry.alertReason}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-300">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase">Performance Gap</span>
                <div className="text-base font-bold text-amber-400">{telemetry.performanceGap.toFixed(1)}%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase">Measured Power</span>
                <div className="text-base font-bold text-white">{telemetry.measuredPower.toFixed(1)} W</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase">Model Expected</span>
                <div className="text-base font-bold text-slate-300">{telemetry.expectedPower.toFixed(1)} W</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase">Cell Temp</span>
                <div className="text-base font-bold text-rose-300">{telemetry.panelTemp.toFixed(1)} °C</div>
              </div>
            </div>
          </div>

          {/* Installation Details */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              1. Installation &amp; Equipment Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Name</span>
                <span className="text-slate-200 font-medium">{installation.name}</span>
              </div>
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Rated Capacity</span>
                <span className="text-slate-200 font-medium">{installation.capacityKwp} kWp ({installation.panelCount} panels)</span>
              </div>
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Location</span>
                <span className="text-slate-200 font-medium">{installation.location}</span>
              </div>
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Inverter Efficiency</span>
                <span className="text-slate-200 font-medium">{(installation.inverterEfficiency * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Temperature Coefficient (Pmax)</span>
                <span className="text-slate-200 font-medium">{installation.tempCoefficient}% / °C</span>
              </div>
              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/70">
                <span className="text-slate-500 block text-[10px]">Orientation</span>
                <span className="text-slate-200 font-medium">{installation.tilt}° Tilt, {installation.azimuth}</span>
              </div>
            </div>
          </div>

          {/* Scientific Hypotheses */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              2. Scientific Hypotheses (Field Testing Required)
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              {telemetry.hypotheses.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 font-mono text-[10px]">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Checklist */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              3. Recommended Optimization Protocol
            </h4>
            <div className="space-y-2.5">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{rec.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {rec.type}
                    </span>
                  </div>
                  <p className="text-slate-400">{rec.description}</p>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-slate-300">
                    {rec.actionableSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/20 text-slate-400 text-[11px] leading-relaxed">
            <strong className="text-amber-400 block mb-1">PROTOTYPE DISCLAIMER</strong>
            This report is generated by the SolarIQ AI research prototype. Electrical measurements indicate mathematical variances from theoretical standard test conditions (STC). In solar photovoltaic systems, variations in voltage or current do not definitively identify internal mechanical or material failures. High DC voltages pose electrical and arc-flash dangers. Physical diagnostic procedures must strictly be executed by qualified, licensed electrical technicians adhering to IEC 62446 verification standards.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
