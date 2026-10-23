import {
  DemoPreset,
  HourlySolarPoint,
  PanelCheckInputs,
  PanelCheckResult,
  SimpleHealthStatus,
} from '../types/solarSimple';

// Clearly documented configurable demo thresholds
export interface ConfigurableThresholds {
  lossWarningPercent: number; // e.g., 10%
  lossCriticalPercent: number; // e.g., 25%
  tempWarningCelsius: number; // e.g., 60°C
  tempCriticalCelsius: number; // e.g., 75°C
}

export const DEFAULT_THRESHOLDS: ConfigurableThresholds = {
  lossWarningPercent: 10,
  lossCriticalPercent: 25,
  tempWarningCelsius: 60,
  tempCriticalCelsius: 75,
};

/**
 * Calculates panel health, performance loss %, possible causes, and next steps deterministically.
 * Rule: Temperature alone never proves a hardware defect.
 */
export function calculatePanelHealth(
  inputs: PanelCheckInputs,
  thresholds: ConfigurableThresholds = DEFAULT_THRESHOLDS
): PanelCheckResult {
  const expected = Math.max(0, Number(inputs.expectedPowerWatts) || 0);
  const actual = Math.max(0, Number(inputs.actualPowerWatts) || 0);
  const temp = Number(inputs.panelTempCelsius) || 0;

  // 1. Calculate performance loss percentage
  let lossPercent = 0;
  let lossWatts = 0;
  if (expected > 0 && actual < expected) {
    lossWatts = expected - actual;
    lossPercent = Number(((lossWatts / expected) * 100).toFixed(1));
  }

  // 2. Classify status using configurable demo thresholds
  let status: SimpleHealthStatus = 'Healthy';

  const isCriticalLoss = lossPercent >= thresholds.lossCriticalPercent;
  const isWarningLoss = lossPercent >= thresholds.lossWarningPercent && !isCriticalLoss;
  const isCriticalTemp = temp >= thresholds.tempCriticalCelsius;
  const isWarningTemp = temp >= thresholds.tempWarningCelsius && !isCriticalTemp;

  if (isCriticalLoss || isCriticalTemp) {
    status = 'Critical';
  } else if (isWarningLoss || isWarningTemp) {
    status = 'Needs Inspection';
  } else {
    status = 'Healthy';
  }

  // 3. Simple English short explanation
  let shortExplanation = '';
  if (status === 'Healthy') {
    shortExplanation = `Your panel is working properly! It is producing ${actual}W out of an expected ${expected}W (only ${lossPercent}% difference). A small loss under ${thresholds.lossWarningPercent}% is completely normal and happens due to light haze, mild warmth, or natural glass reflection.`;
  } else if (status === 'Needs Inspection') {
    if (isWarningTemp && !isWarningLoss) {
      shortExplanation = `Your panel is running hot at ${temp}°C, which causes its electrical efficiency to drop. The power output is lower than optimal because heat naturally slows down solar cells.`;
    } else {
      shortExplanation = `Your panel is producing ${lossPercent}% less power than expected (${lossWatts}W drop). The most common causes are light dust accumulation, bird droppings, or partial shadows from trees or walls.`;
    }
  } else {
    // Critical
    if (isCriticalTemp && !isCriticalLoss) {
      shortExplanation = `Your panel temperature is very high (${temp}°C, above the ${thresholds.tempCriticalCelsius}°C limit). While not proof of damage, excessive heat greatly reduces power and suggests trapped air behind the panel.`;
    } else {
      shortExplanation = `Your panel has a serious power drop of ${lossPercent}% (${lossWatts}W lower than expected). This usually means heavy dirt, deep shade covering multiple solar cells, or a loose electrical connection.`;
    }
  }

  // 4. Possible Causes (Clearly labelled as possibilities rather than confirmed faults)
  const possibleCauses: string[] = [];
  if (status === 'Healthy') {
    possibleCauses.push('Normal slight deviation due to natural atmospheric haze or glass reflection (normal).');
    possibleCauses.push('Minor solar angle variation during the current hour.');
  } else if (status === 'Needs Inspection') {
    possibleCauses.push('Possibility 1: Light surface dust, bird droppings, or pollen coating the glass.');
    possibleCauses.push('Possibility 2: Partial shade from nearby trees, power poles, or chimney edges.');
    if (temp >= thresholds.tempWarningCelsius) {
      possibleCauses.push('Possibility 3: High summer heat temporarily reducing solar cell voltage.');
    }
  } else {
    // Critical
    possibleCauses.push('Possibility 1: Heavy dirt, thick bird droppings, or leaves completely blocking several solar cells.');
    possibleCauses.push('Possibility 2: Deep shadow covering a full section or corner of the panel.');
    if (temp >= thresholds.tempCriticalCelsius) {
      possibleCauses.push('Possibility 3: Restricted airflow behind panels creating an unventilated heat trap.');
    }
    possibleCauses.push('Possibility 4: Loose wire connection or an inverter bypass event (physical testing needed to confirm).');
  }

  // 5. Clearly documented temperature explanation
  const temperatureExplanation = `Temperature Rule: Your panel is currently at ${temp}°C. A high temperature reading alone cannot confirm that a panel is broken or damaged. Solar panels naturally get warm in direct sunlight, and heat temporarily reduces electrical power by about 0.4% per degree. However, poor air circulation under the panel can cause excess heat buildup.`;

  // 6. Simple recommended next steps
  let recommendedSteps: string[] = [];
  if (status === 'Healthy') {
    recommendedSteps = [
      'No immediate action required. Your system is producing healthy solar energy.',
      'Check weekly generation to ensure performance stays steady.',
      'Rinse with plain water only if you see visible dirt after dry, dusty weeks.',
    ];
  } else if (status === 'Needs Inspection') {
    recommendedSteps = [
      'Look at the panel surface for bird droppings, fallen leaves, or pollen.',
      'Check for shadows from nearby trees, chimneys, or utility lines between 11 AM and 2 PM.',
      'Verify that airflow behind the panel is not blocked by nesting debris or leaves.',
      'Gently wash the panel early in the morning when the glass is cool.',
    ];
  } else {
    // Critical
    recommendedSteps = [
      'Safely inspect the panel from the ground or with a ladder for heavy debris or thick dirt.',
      'Check your solar inverter display or app for error codes or disconnected strings.',
      'If the panel is clean and free of shadows, contact a certified solar technician to inspect the wiring safely.',
    ];
  }

  return {
    status,
    performanceLossPercent: lossPercent,
    lossWatts,
    shortExplanation,
    possibleCauses,
    recommendedSteps,
    temperatureExplanation,
  };
}

/**
 * Generates smooth 24-hour actual vs expected generation profile
 */
export function generateDiurnalCurve(inputs: PanelCheckInputs): HourlySolarPoint[] {
  const points: HourlySolarPoint[] = [];
  const expectedPeak = Math.max(100, inputs.expectedPowerWatts);
  const actualPeak = Math.max(0, inputs.actualPowerWatts);

  for (let h = 0; h < 24; h++) {
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    let expectedWatts = 0;
    let actualWatts = 0;

    if (h >= 6 && h <= 18) {
      // Bell curve factor
      const factor = Math.sin(((h - 6) / 12) * Math.PI);
      const curve = Math.pow(Math.max(0, factor), 1.3);

      expectedWatts = Math.round(expectedPeak * curve);
      actualWatts = Math.round(actualPeak * curve);
    }

    points.push({
      hour: h,
      timeLabel,
      expectedWatts,
      actualWatts,
      isPeakSun: h >= 10 && h <= 15,
    });
  }

  return points;
}

// 3 Simple, Reproducible Demo Presets for Judges & First-Time Users
export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'healthy',
    name: '1. Healthy Panel',
    badge: 'Optimal Yield',
    description: 'Clean glass, moderate warmth, nominal output (400W expected vs 388W actual).',
    inputs: {
      expectedPowerWatts: 400,
      actualPowerWatts: 388,
      panelTempCelsius: 38,
    },
  },
  {
    id: 'dusty',
    name: '2. Dusty / Shaded Panel',
    badge: 'Loss Alert',
    description: 'Significant 30% power drop caused by surface dust or tree limb shadow.',
    inputs: {
      expectedPowerWatts: 400,
      actualPowerWatts: 280,
      panelTempCelsius: 42,
    },
  },
  {
    id: 'hot',
    name: '3. Hot Summer Panel',
    badge: 'Heat Warning',
    description: 'Elevated 72°C heat creating thermal voltage drop and reduced efficiency.',
    inputs: {
      expectedPowerWatts: 400,
      actualPowerWatts: 320,
      panelTempCelsius: 72,
    },
  },
];
