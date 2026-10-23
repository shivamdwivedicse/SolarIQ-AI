export type SimpleHealthStatus = 'Healthy' | 'Needs Inspection' | 'Critical';

export interface PanelCheckInputs {
  expectedPowerWatts: number;
  actualPowerWatts: number;
  panelTempCelsius: number;
}

export interface PanelCheckResult {
  status: SimpleHealthStatus;
  performanceLossPercent: number;
  lossWatts: number;
  shortExplanation: string;
  possibleCauses: string[];
  recommendedSteps: string[];
  temperatureExplanation: string;
}

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: PanelCheckInputs;
}

export interface HourlySolarPoint {
  hour: number;
  timeLabel: string;
  expectedWatts: number;
  actualWatts: number;
  isPeakSun: boolean;
}
