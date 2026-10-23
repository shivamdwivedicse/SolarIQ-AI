import {
  DemoScenario,
  FlexibleLoad,
  HealthStatus,
  HistoricalAlert,
  HourlyDataPoint,
  InstallationSummary,
  OptimizationRecommendation,
  PanelTelemetry,
  SolarInstallation,
  SystemThresholds,
} from '../types/solar';

export const DEFAULT_THRESHOLDS: SystemThresholds = {
  warningGapPercent: 10.0,
  criticalGapPercent: 25.0,
  warningTempC: 60.0,
  criticalTempC: 75.0,
  voltageSagWarningPercent: 15.0,
};

export const PRESET_INSTALLATIONS: SolarInstallation[] = [
  {
    id: 'rooftop-alpha',
    name: 'Rooftop Array Alpha (Residential Prototyping Lab)',
    capacityKwp: 4.8,
    panelCount: 12,
    panelRatingW: 400,
    tempCoefficient: -0.38, // -0.38% per °C above 25°C
    nominalVoc: 45.6,
    nominalIsc: 10.8,
    nominalVmp: 38.5,
    nominalImp: 10.39,
    tilt: 25,
    azimuth: '180° South',
    location: 'Building C Rooftop, Tech Park',
    inverterEfficiency: 0.975,
    installationDate: '2024-04-15',
  },
  {
    id: 'commercial-beta',
    name: 'Carport Canopy Beta (Commercial Fleet Charging)',
    capacityKwp: 48.0,
    panelCount: 120,
    panelRatingW: 400,
    tempCoefficient: -0.37,
    nominalVoc: 46.0,
    nominalIsc: 11.0,
    nominalVmp: 38.8,
    nominalImp: 10.31,
    tilt: 10,
    azimuth: '170° SSE',
    location: 'South Parking Lot, Logistics Hub',
    inverterEfficiency: 0.982,
    installationDate: '2023-09-10',
  },
  {
    id: 'agrivoltaic-gamma',
    name: 'Agrivoltaic Tracker Gamma (Research Farm)',
    capacityKwp: 120.0,
    panelCount: 300,
    panelRatingW: 400,
    tempCoefficient: -0.36,
    nominalVoc: 45.8,
    nominalIsc: 10.9,
    nominalVmp: 38.6,
    nominalImp: 10.36,
    tilt: 35,
    azimuth: 'Dual-Axis Tracking',
    location: 'Agricultural Field Section 4',
    inverterEfficiency: 0.985,
    installationDate: '2024-01-20',
  },
];

export const DEMO_SCENARIOS: Record<'healthy' | 'underperforming' | 'high_temp', DemoScenario> = {
  healthy: {
    id: 'healthy',
    name: 'Healthy Panel Profile',
    badge: 'Optimal Performance',
    status: 'Healthy',
    description: 'Clean surface, unobstructed sunlight, standard ambient temperature, and nominal electrical output.',
    telemetry: {
      irradiance: 850,
      panelTemp: 42.0,
      ambientTemp: 26.0,
      voltage: 38.4,
      current: 9.9,
    },
    explanation: 'System is producing 380.2W against an expected 388.5W under 850 W/m² irradiance. The 2.1% performance delta is well within acceptable real-world operating tolerances (cable impedance, atmospheric Rayleigh scattering, and glass reflection).',
    keyDifferentiator: 'Performance gap < 10% · Stable cell temp · Maximum Power Point (MPP) tracking operating nominally.',
  },
  underperforming: {
    id: 'underperforming',
    name: 'Underperforming Panel Profile',
    badge: 'Impaired Generation',
    status: 'Critical',
    description: 'Significant electrical current deficit with nominal open-circuit voltage, typical of localized shading or heavy soiling.',
    telemetry: {
      irradiance: 850,
      panelTemp: 44.0,
      ambientTemp: 27.0,
      voltage: 35.0,
      current: 6.8,
    },
    explanation: 'Measured power is 238.0W compared to expected 385.4W (a 38.2% performance deficit). Notice the current (6.8A) is depressed far below nominal (9.9A), indicating obstructed light penetration or partial cell occlusion.',
    keyDifferentiator: 'Performance gap > 25% · Depressed current · Voltage maintains stable baseline.',
  },
  high_temp: {
    id: 'high_temp',
    name: 'High-Temperature Warning Profile',
    badge: 'Thermal Derating',
    status: 'Warning',
    description: 'Elevated cell operating temperature causing substantial thermal voltage sag and efficiency reduction.',
    telemetry: {
      irradiance: 960,
      panelTemp: 74.0,
      ambientTemp: 34.0,
      voltage: 31.8,
      current: 9.3,
    },
    explanation: 'High cell temperature of 74.0°C (49°C above STC 25°C) triggers an estimated 18.6% thermal degradation penalty due to Silicon bandgap voltage drop. While current remains high (9.3A), voltage has dropped to 31.8V.',
    keyDifferentiator: 'Panel temp > 70°C · Severe voltage degradation · High irradiance environment.',
  },
};

/**
 * Calculates deterministic DC electrical power:
 * Power (W) = Voltage (V) * Current (A)
 */
export function calculateMeasuredPower(voltage: number, current: number): number {
  if (isNaN(voltage) || isNaN(current) || voltage < 0 || current < 0) {
    return 0;
  }
  return Number((voltage * current).toFixed(1));
}

/**
 * Calculates expected power under real environmental conditions:
 * P_expected = P_STC * (G / 1000) * (1 + (gamma / 100) * (T_cell - 25))
 */
export function calculateExpectedPower(
  nominalRatingW: number,
  irradianceWm2: number,
  cellTempC: number,
  tempCoefficientPercentPerC: number = -0.38
): number {
  if (irradianceWm2 <= 0 || nominalRatingW <= 0) {
    return 0;
  }
  const irradianceRatio = Math.max(0, irradianceWm2 / 1000);
  const tempDelta = cellTempC - 25; // STC reference temperature is 25°C
  const thermalDerateFactor = 1 + (tempCoefficientPercentPerC / 100) * tempDelta;
  // Ensure factor does not drop below realistic minimum
  const boundedDerate = Math.max(0.4, Math.min(1.2, thermalDerateFactor));
  const expected = nominalRatingW * irradianceRatio * boundedDerate;
  return Number(Math.max(0, expected).toFixed(1));
}

/**
 * Calculates percentage performance gap:
 * Gap % = max(0, ((Expected - Measured) / Expected) * 100)
 */
export function calculatePerformanceGap(measuredPowerW: number, expectedPowerW: number): number {
  if (expectedPowerW <= 0) return 0;
  if (measuredPowerW >= expectedPowerW) return 0;
  const gap = ((expectedPowerW - measuredPowerW) / expectedPowerW) * 100;
  return Number(gap.toFixed(1));
}

/**
 * Evaluates panel health status and deterministic alerts
 * Strictly obeys requirement: "Never claim that temperature or voltage alone proves a specific physical fault."
 */
export function evaluateHealthStatus(
  measuredPower: number,
  expectedPower: number,
  performanceGap: number,
  panelTemp: number,
  voltage: number,
  nominalVmp: number,
  thresholds: SystemThresholds = DEFAULT_THRESHOLDS
): {
  status: HealthStatus;
  alertReason: string;
  hypotheses: string[];
} {
  const hypotheses: string[] = [];
  let status: HealthStatus = 'Healthy';
  let alertReason = 'System telemetry aligns with standard photovoltaic modeling parameters.';

  const isCriticalGap = performanceGap >= thresholds.criticalGapPercent;
  const isWarningGap = performanceGap >= thresholds.warningGapPercent && !isCriticalGap;
  const isCriticalTemp = panelTemp >= thresholds.criticalTempC;
  const isWarningTemp = panelTemp >= thresholds.warningTempC && !isCriticalTemp;
  const isVoltageSag = nominalVmp > 0 && ((nominalVmp - voltage) / nominalVmp) * 100 > thresholds.voltageSagWarningPercent;

  if (isCriticalGap || isCriticalTemp) {
    status = 'Critical';
    if (isCriticalGap && isCriticalTemp) {
      alertReason = `Severe performance deficit (${performanceGap.toFixed(1)}%) coupled with critical cell temperature (${panelTemp.toFixed(1)}°C).`;
      hypotheses.push('Observation: Severe thermal stress combined with energy deficit.');
      hypotheses.push('Non-verified potential cause: Localized cell hotspot heating or bypass diode conduction under partial shade.');
      hypotheses.push('Non-verified potential cause: Sub-string failure or severe structural debris obstruction.');
    } else if (isCriticalGap) {
      alertReason = `Severe electrical generation gap (${performanceGap.toFixed(1)}% below modeled expectation of ${expectedPower.toFixed(0)}W).`;
      hypotheses.push('Non-verified potential cause: Accumulated surface dust, bird droppings, or organic residue obstructing solar irradiance.');
      hypotheses.push('Non-verified potential cause: Localized shading from foliage, structural parapets, or seasonal obstacles.');
      hypotheses.push('Non-verified potential cause: Internal string interconnect resistance or open sub-string.');
    } else {
      alertReason = `Critical thermal threshold reached (${panelTemp.toFixed(1)}°C >= ${thresholds.criticalTempC}°C limit).`;
      hypotheses.push('Non-verified potential cause: Inadequate under-panel airflow clearance causing localized heat stagnation.');
      hypotheses.push('Non-verified potential cause: High solar irradiance combined with elevated ambient temperatures and roof reflection.');
    }
  } else if (isWarningGap || isWarningTemp || isVoltageSag) {
    status = 'Warning';
    if (isWarningTemp) {
      alertReason = `Thermal elevation detected (${panelTemp.toFixed(1)}°C). Operating cell efficiency is degraded by heat.`;
      hypotheses.push('Observation: Elevated cell temperature decreases output voltage via semiconductor bandgap narrowing.');
      hypotheses.push('Non-verified potential cause: Summer heatwave conditions or reduced convective rooftop airflow.');
    } else if (isVoltageSag) {
      alertReason = `Operating voltage (${voltage.toFixed(1)}V) is depressed by >${thresholds.voltageSagWarningPercent}% compared to nominal Vmp (${nominalVmp.toFixed(1)}V).`;
      hypotheses.push('Non-verified potential cause: Bypass diode conduction due to uneven irradiance or thermal voltage sag.');
    } else {
      alertReason = `Moderate performance gap detected (${performanceGap.toFixed(1)}% variance from expected output).`;
      hypotheses.push('Non-verified potential cause: Early-stage surface soiling or atmospheric haze.');
      hypotheses.push('Non-verified potential cause: Minor irradiance sensor alignment difference relative to the array plane.');
    }
  } else {
    hypotheses.push('Normal operation: Minimal deviation between measured DC telemetry and STC-adjusted mathematical model.');
    hypotheses.push('MPPT tracking is functioning within target equilibrium bounds.');
  }

  return { status, alertReason, hypotheses };
}

/**
 * Computes array-wide summary metrics
 */
export function calculateInstallationSummary(
  installation: SolarInstallation,
  currentPanelPowerW: number,
  expectedPanelPowerW: number,
  hourlyData: HourlyDataPoint[]
): InstallationSummary {
  // Array total scale
  const panelScale = installation.panelCount;
  const currentArrayPowerKw = (currentPanelPowerW * panelScale * installation.inverterEfficiency) / 1000;
  
  // Calculate today's energy from hourly data
  let todayEnergyKwh = 0;
  let expectedEnergyKwh = 0;
  hourlyData.forEach((pt) => {
    todayEnergyKwh += pt.measuredOutputKw;
    expectedEnergyKwh += pt.expectedOutputKw;
  });

  const performanceRatio = expectedEnergyKwh > 0 ? (todayEnergyKwh / expectedEnergyKwh) * 100 : 92.5;
  const estimatedLossKwh = Math.max(0, expectedEnergyKwh - todayEnergyKwh);
  const costPerKwh = 0.18; // Average USD per kWh
  const estimatedLossCost = estimatedLossKwh * costPerKwh;

  return {
    currentPowerKw: Number(currentArrayPowerKw.toFixed(2)),
    todayEnergyKwh: Number(todayEnergyKwh.toFixed(1)),
    expectedEnergyKwh: Number(expectedEnergyKwh.toFixed(1)),
    performanceRatio: Number(performanceRatio.toFixed(1)),
    estimatedLossKwh: Number(estimatedLossKwh.toFixed(1)),
    estimatedLossCost: Number(estimatedLossCost.toFixed(2)),
  };
}

/**
 * Generates synthetic 24-hour diurnal profile matching current scenario and installation
 */
export function generateHourlyGenerationProfile(
  installation: SolarInstallation,
  scenarioId: 'healthy' | 'underperforming' | 'high_temp',
  customCurrentRatio: number = 1.0
): HourlyDataPoint[] {
  const points: HourlyDataPoint[] = [];
  const arrayCapacity = installation.capacityKwp;

  for (let h = 0; h < 24; h++) {
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    let irradiance = 0;
    let ambientTemp = 18;
    let panelTemp = 18;
    let expectedOutputKw = 0;
    let measuredOutputKw = 0;
    let loadKw = 1.2;

    // Solar bell curve between 06:00 and 19:00
    if (h >= 6 && h <= 18) {
      const solarAngle = Math.sin(((h - 6) / 12) * Math.PI);
      const peakIrradiance = 980;
      irradiance = Math.max(0, peakIrradiance * Math.pow(solarAngle, 1.2));
      
      // Ambient temp rises with daylight, peaks around 14:00 - 15:00
      ambientTemp = 19 + 14 * Math.sin(((h - 5) / 14) * Math.PI);
      
      // Panel temp is ambient + solar heating factor
      const heatingFactor = scenarioId === 'high_temp' ? 0.045 : 0.026;
      panelTemp = ambientTemp + irradiance * heatingFactor;

      // Model expected power
      const derate = 1 + (installation.tempCoefficient / 100) * (panelTemp - 25);
      expectedOutputKw = Math.max(0, (arrayCapacity * (irradiance / 1000) * derate * installation.inverterEfficiency));

      // Measured output based on scenario
      let healthMultiplier = 0.98;
      if (scenarioId === 'underperforming') {
        healthMultiplier = 0.62 * customCurrentRatio;
      } else if (scenarioId === 'high_temp') {
        healthMultiplier = 0.81 * customCurrentRatio;
      } else {
        healthMultiplier = 0.98 * customCurrentRatio;
      }

      measuredOutputKw = Math.max(0, expectedOutputKw * healthMultiplier);
    } else {
      // Night time
      ambientTemp = 16 + (h < 6 ? 2 - h * 0.3 : 18 - h * 0.2);
      panelTemp = ambientTemp;
      irradiance = 0;
      expectedOutputKw = 0;
      measuredOutputKw = 0;
    }

    // Typical domestic/commercial base load
    if (h >= 7 && h <= 9) loadKw = 3.5;
    else if (h >= 11 && h <= 14) loadKw = 2.8;
    else if (h >= 17 && h <= 21) loadKw = 4.2;
    else loadKw = 1.1;

    // Scale load slightly with installation scale
    const loadScale = Math.max(1, installation.capacityKwp / 10);
    const scaledLoad = loadKw * loadScale;

    points.push({
      hour: h,
      timeLabel,
      irradiance: Number(irradiance.toFixed(0)),
      ambientTemp: Number(ambientTemp.toFixed(1)),
      panelTemp: Number(panelTemp.toFixed(1)),
      measuredOutputKw: Number(measuredOutputKw.toFixed(2)),
      expectedOutputKw: Number(expectedOutputKw.toFixed(2)),
      loadKw: Number(scaledLoad.toFixed(2)),
      isPeakSun: h >= 10 && h <= 15,
    });
  }

  return points;
}

/**
 * Returns structured actionable optimization recommendations
 */
export function generateOptimizationRecommendations(
  telemetry: PanelTelemetry,
  scenarioId: 'healthy' | 'underperforming' | 'high_temp',
  installation: SolarInstallation
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];

  // 1. Soiling / Cleanliness recommendation
  if (telemetry.performanceGap >= 15 || scenarioId === 'underperforming') {
    recommendations.push({
      id: 'opt-clean-1',
      category: 'cleanliness',
      title: 'Panel Surface Debris & Soiling Inspection',
      description: 'Significant optical attenuation observed. Field dust accumulation or bird soiling is a frequent cause of localized irradiance attenuation.',
      impact: 'High',
      type: 'Diagnostic Inspection',
      actionableSteps: [
        'Perform ground-level visual inspection using binoculars or drone camera.',
        'If particulate film is evident, schedule early-morning low-pressure deionized water rinse.',
        'CAUTION: Avoid cleaning during peak sun (>45°C) to prevent thermal shock micro-fractures.',
      ],
      estimatedKwhGainWeekly: Number((installation.capacityKwp * 4.2 * 0.18).toFixed(1)),
    });
  } else {
    recommendations.push({
      id: 'opt-clean-routine',
      category: 'cleanliness',
      title: 'Routine Semi-Annual Surface Maintenance',
      description: 'Optical transmission is within nominal bounds. Maintain scheduled cleaning after pollen season or dry spells.',
      impact: 'Low',
      type: 'General Maintenance',
      actionableSteps: [
        'Monitor local air quality index (AQI) and dust storm advisories.',
        'Review soiling rates after upcoming precipitation events.',
      ],
    });
  }

  // 2. Shading & Obstacle Analysis
  if (scenarioId === 'underperforming' || telemetry.voltage < 36) {
    recommendations.push({
      id: 'opt-shade-1',
      category: 'shading',
      title: 'Diurnal Solar Shading & Obstacle Survey',
      description: 'Depressed array current with moderate voltage can stem from localized tree canopy growth, newly installed antennas, or rooftop vents.',
      impact: 'High',
      type: 'Diagnostic Inspection',
      actionableSteps: [
        'Conduct a sun-path horizon audit between 10:00 AM and 3:00 PM.',
        'Trim vegetation extending beyond the 30° winter solar shadow perimeter.',
        'Evaluate whether DC power optimizers or microinverters would mitigate string-level shading bottlenecks.',
      ],
      estimatedKwhGainWeekly: Number((installation.capacityKwp * 4.2 * 0.12).toFixed(1)),
    });
  }

  // 3. Thermal Derating & Ventilation
  if (telemetry.panelTemp >= 60 || scenarioId === 'high_temp') {
    recommendations.push({
      id: 'opt-thermal-1',
      category: 'thermal',
      title: 'Thermal Derating Mitigation & Racking Airflow',
      description: `Elevated panel temperature (${telemetry.panelTemp.toFixed(1)}°C) induces a continuous negative voltage penalty (~${installation.tempCoefficient}%/°C).`,
      impact: 'High',
      type: 'Operational Optimization',
      actionableSteps: [
        'Inspect underside roof-to-panel clearance; ensure at least 100mm gap for natural chimney convective airflow.',
        'Clear leaf litter and nesting debris lodged behind panel frames.',
        'For high-heat commercial rooftops, verify reflective roof membrane (cool-roof coating) integrity.',
      ],
      estimatedKwhGainWeekly: Number((installation.capacityKwp * 4.2 * 0.09).toFixed(1)),
    });
  }

  // 4. Electrical Connections & Inverter MPPT
  recommendations.push({
    id: 'opt-elec-1',
    category: 'electrical',
    title: 'Inverter MPPT Tracking & DC Terminal Audit',
    description: 'Ensure maximum power point tracker firmware is up to date and DC junction terminals are torqued to manufacturer specification.',
    impact: 'Medium',
    type: 'General Maintenance',
    actionableSteps: [
      'Check inverter logs for transient grid overvoltage or frequency curtailment events.',
      'Verify combiner box DC surge protective devices (SPD) indicators are green.',
      'Schedule periodic infrared thermography to identify high-resistance MC4 crimp connections.',
    ],
  });

  // 5. Smart Load Shifting (Always applicable)
  recommendations.push({
    id: 'opt-load-1',
    category: 'load_shifting',
    title: 'Solar Self-Consumption Load Shifting Protocol',
    description: 'Align high-power dispatchable equipment with peak solar generation (11:00 AM – 2:30 PM) to minimize low-value grid export and avoid peak tariff imports.',
    impact: 'High',
    type: 'Operational Optimization',
    actionableSteps: [
      'Schedule Electric Vehicle (EV) smart charging to ramp up when solar output exceeds 3.5 kW.',
      'Pre-heat domestic hot water heat pump during midday peak generation hours.',
      'Shift laundry and pool filtration pump timers to 12:00 PM – 2:00 PM window.',
    ],
    estimatedKwhGainWeekly: Number((installation.capacityKwp * 2.5).toFixed(1)),
  });

  return recommendations;
}

export const INITIAL_FLEXIBLE_LOADS: FlexibleLoad[] = [
  {
    id: 'load-ev',
    name: 'Electric Vehicle Charger (Level 2)',
    powerKw: 7.2,
    durationHours: 3,
    recommendedWindow: '11:00 - 14:00',
    currentScheduledHour: 18, // currently set at 18:00 (peak grid tariff)
    isShifted: false,
    estimatedSavings: 4.85,
  },
  {
    id: 'load-heatpump',
    name: 'Heat Pump Water Pre-Heating',
    powerKw: 2.8,
    durationHours: 2.5,
    recommendedWindow: '12:00 - 14:30',
    currentScheduledHour: 12,
    isShifted: true,
    estimatedSavings: 2.4,
  },
  {
    id: 'load-battery',
    name: 'Home Energy Storage Battery (Charge Cycle)',
    powerKw: 3.5,
    durationHours: 3,
    recommendedWindow: '10:30 - 13:30',
    currentScheduledHour: 11,
    isShifted: true,
    estimatedSavings: 3.15,
  },
  {
    id: 'load-appliance',
    name: 'Commercial Dishwasher / Laundry',
    powerKw: 2.2,
    durationHours: 1.5,
    recommendedWindow: '13:00 - 14:30',
    currentScheduledHour: 20,
    isShifted: false,
    estimatedSavings: 1.6,
  },
];

export const DEMO_HISTORICAL_ALERTS: HistoricalAlert[] = [
  {
    id: 'alt-001',
    timestamp: 'Today, 11:24 AM',
    severity: 'Warning',
    title: 'Elevated Cell Temperature (68.4°C)',
    description: 'Panel operating temperature exceeded 65°C during high noon irradiance. Thermal derate factor -16.5%.',
    measuredPowerW: 312,
    expectedPowerW: 374,
    gapPercent: 16.6,
    suggestedRemediation: 'Check underside racking clearance and verify roof membrane heat reflection.',
    status: 'Investigating',
  },
  {
    id: 'alt-002',
    timestamp: 'Yesterday, 02:15 PM',
    severity: 'Critical',
    title: 'Sudden Current Sag on Sub-String B',
    description: 'Measured DC current dropped from 9.8A to 5.4A during clear-sky conditions (910 W/m²).',
    measuredPowerW: 205,
    expectedPowerW: 392,
    gapPercent: 47.7,
    suggestedRemediation: 'Drone visual sweep confirmed dense bird soiling on southwest quadrant. Cleaned at 5:00 PM.',
    status: 'Resolved',
  },
  {
    id: 'alt-003',
    timestamp: 'Oct 21, 10:40 AM',
    severity: 'Healthy',
    title: 'Routine Post-Rain Calibration Check',
    description: 'Post-storm natural washing restored optical transmission. Performance gap dropped to 1.8%.',
    measuredPowerW: 388,
    expectedPowerW: 395,
    gapPercent: 1.8,
    suggestedRemediation: 'Routine logs updated. Inverter efficiency verified at 97.8%.',
    status: 'Resolved',
  },
  {
    id: 'alt-004',
    timestamp: 'Oct 19, 01:10 PM',
    severity: 'Warning',
    title: 'Partial Shading Transients Detected',
    description: 'Recurrent 18% power dip between 12:45 PM and 1:30 PM coinciding with adjacent communication mast shadow.',
    measuredPowerW: 320,
    expectedPowerW: 390,
    gapPercent: 17.9,
    suggestedRemediation: 'Map shadow angle against solar elevation. Review string rewiring or optimizer placement.',
    status: 'Open',
  },
];
