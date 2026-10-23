export type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

export interface SolarInstallation {
  id: string;
  name: string;
  capacityKwp: number;
  panelCount: number;
  panelRatingW: number;
  tempCoefficient: number; // e.g. -0.38 (%/°C)
  nominalVoc: number; // Open circuit voltage (V)
  nominalIsc: number; // Short circuit current (A)
  nominalVmp: number; // Max power voltage (V)
  nominalImp: number; // Max power current (A)
  tilt: number;
  azimuth: string;
  location: string;
  inverterEfficiency: number;
  installationDate: string;
}

export interface PanelTelemetry {
  panelTemp: number; // °C
  ambientTemp: number; // °C
  voltage: number; // V
  current: number; // A
  measuredPower: number; // W (Voltage * Current)
  expectedPower: number; // W
  irradiance: number; // W/m²
  performanceGap: number; // %
  healthStatus: HealthStatus;
  alertReason: string;
  hypotheses: string[];
  timestamp: string;
}

export interface SystemThresholds {
  warningGapPercent: number; // e.g. 10%
  criticalGapPercent: number; // e.g. 25%
  warningTempC: number; // e.g. 60°C
  criticalTempC: number; // e.g. 75°C
  voltageSagWarningPercent: number; // e.g. 15%
}

export interface InstallationSummary {
  currentPowerKw: number;
  todayEnergyKwh: number;
  expectedEnergyKwh: number;
  performanceRatio: number; // %
  estimatedLossKwh: number;
  estimatedLossCost: number; // USD
}

export interface HourlyDataPoint {
  hour: number;
  timeLabel: string;
  irradiance: number; // W/m²
  ambientTemp: number; // °C
  panelTemp: number; // °C
  measuredOutputKw: number;
  expectedOutputKw: number;
  loadKw: number;
  isPeakSun: boolean;
}

export interface HistoricalAlert {
  id: string;
  timestamp: string;
  severity: HealthStatus;
  title: string;
  description: string;
  measuredPowerW: number;
  expectedPowerW: number;
  gapPercent: number;
  suggestedRemediation: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export interface OptimizationRecommendation {
  id: string;
  category: 'cleanliness' | 'shading' | 'electrical' | 'load_shifting' | 'thermal';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  type: 'General Maintenance' | 'Operational Optimization' | 'Diagnostic Inspection';
  actionableSteps: string[];
  estimatedKwhGainWeekly?: number;
}

export interface FlexibleLoad {
  id: string;
  name: string;
  powerKw: number;
  durationHours: number;
  recommendedWindow: string;
  currentScheduledHour: number;
  isShifted: boolean;
  estimatedSavings: number;
}

export interface DemoScenario {
  id: 'healthy' | 'underperforming' | 'high_temp';
  name: string;
  badge: string;
  status: HealthStatus;
  description: string;
  telemetry: {
    irradiance: number;
    panelTemp: number;
    ambientTemp: number;
    voltage: number;
    current: number;
  };
  explanation: string;
  keyDifferentiator: string;
}
