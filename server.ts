import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

// Deterministic rule-based fallback generator for optimization and analysis
function generateRuleBasedAnalysis(data: any) {
  const {
    panelTemp = 42,
    voltage = 38.2,
    current = 9.8,
    measuredPower = 374,
    expectedPower = 388,
    irradiance = 850,
    performanceGap = 3.6,
    healthStatus = 'Healthy',
    installationName = 'Solar Array',
  } = data;

  const reasons: string[] = [];
  const recommendations: string[] = [];
  const hypotheses: string[] = [];

  if (performanceGap >= 25) {
    reasons.push(`Measured electrical output (${measuredPower.toFixed(1)} W) is critically below the model expected baseline (${expectedPower.toFixed(1)} W) by ${performanceGap.toFixed(1)}%.`);
    hypotheses.push('Possible non-verified cause: severe soiling/bird droppings or heavy organic dust.');
    hypotheses.push('Possible non-verified cause: localized partial shading from tree limbs, parapet walls, or neighboring antennas.');
    hypotheses.push('Possible non-verified cause: activated bypass diodes due to defective or shaded sub-strings (check for ~0.6V to 12V string drops).');
    recommendations.push('Schedule safe ground or drone visual inspection for heavy debris or physical shading.');
    recommendations.push('Conduct an IV-curve tracer test to distinguish between uniform soiling and cell-level mismatch.');
  } else if (performanceGap >= 10) {
    reasons.push(`Measured power (${measuredPower.toFixed(1)} W) exhibits moderate divergence (${performanceGap.toFixed(1)}%) from expected output (${expectedPower.toFixed(1)} W).`);
    hypotheses.push('Possible non-verified cause: light dust deposition or ambient haze reducing effective photon absorption.');
    hypotheses.push('Possible non-verified cause: minor tilt/azimuth alignment variance relative to standard modeling.');
    recommendations.push('Inspect panel surfaces and check recent local precipitation history to evaluate wash necessity.');
    recommendations.push('Verify inverter MPPT tracking efficiency during clear-sky midday hours.');
  } else {
    reasons.push(`System is operating within optimal bounds with only a minor ${performanceGap.toFixed(1)}% variance.`);
    recommendations.push('Maintain regular semi-annual visual inspections and inverter firmware updates.');
  }

  if (panelTemp > 65) {
    reasons.push(`Panel operating temperature of ${panelTemp.toFixed(1)}°C exceeds standard nominal operating cell temperature (NOCT ~45°C), triggering notable thermal derating.`);
    hypotheses.push('High operating temperature reduces Silicon bandgap voltage (approx. -0.38%/°C temperature coefficient).');
    hypotheses.push('Restricted underside airflow or flush roof mounting may be hindering natural convective cooling.');
    recommendations.push('Verify at least 10–15 cm clearance between roof deck and panel racking for convective heat dissipation.');
  }

  // Load shifting suggestions
  recommendations.push('Load Shifting Optimization: Program flexible daytime loads (EV charging, heat pumps, energy storage) to absorb peak solar generation between 11:30 and 14:30.');

  return {
    source: 'rule_based_fallback',
    summary: `Operational Assessment for ${installationName}: Classified as ${healthStatus.toUpperCase()} (${performanceGap.toFixed(1)}% performance gap). Note: Sensor telemetry alone cannot definitively verify physical structural faults; on-site diagnostic testing is recommended for confirmation.`,
    reasons,
    hypotheses,
    recommendations,
    disclaimer: 'Prototype diagnostic support rule engine. Not a certified hardware safety controller.',
  };
}

// AI Analysis Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const sensorData = req.body;

    if (!aiClient) {
      const fallback = generateRuleBasedAnalysis(sensorData);
      return res.json({
        ...fallback,
        source: 'rule_based_offline',
        note: 'Generated using deterministic engineering rules engine (Gemini API key not configured or offline).',
      });
    }

    const prompt = `You are the SolarIQ AI Energy Optimization & Panel Health Specialist.
Analyze the following solar installation telemetry and provide an objective, scientifically accurate engineering assessment:

Installation: ${sensorData.installationName || 'Solar Array'}
Telemetry:
- Panel Operating Temperature: ${sensorData.panelTemp}°C
- Array Voltage: ${sensorData.voltage} V
- Array Current: ${sensorData.current} A
- Measured DC Power (V * I): ${sensorData.measuredPower} W
- Model Expected Power: ${sensorData.expectedPower} W
- Solar Irradiance: ${sensorData.irradiance} W/m²
- Performance Gap: ${sensorData.performanceGap}%
- Deterministic Health Status: ${sensorData.healthStatus}

STRICT ENGINEERING RULES:
1. NEVER claim that temperature or voltage readings alone prove a specific physical hardware fault.
2. Clearly distinguish general diagnostic hypotheses (e.g. potential dust, partial shading, bypass diode activation, thermal derating) from confirmed physical faults.
3. Recommend specific field verification actions (e.g., thermal imaging, IV-curve tracing, visual inspection).
4. Provide actionable energy optimization advice (such as load shifting for EV/batteries and maintenance scheduling).
5. Format your output strictly in JSON with the following structure:
{
  "summary": "Short 2-sentence executive summary",
  "operationalExplanation": "Detailed physical explanation of electrical behavior and thermal derating",
  "potentialHypotheses": ["hypothesis 1", "hypothesis 2", "hypothesis 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "loadShiftingAdvice": "Advice on how to utilize generation based on this state"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    try {
      const parsed = JSON.parse(text);
      return res.json({
        ...parsed,
        source: 'gemini_ai',
        model: 'gemini-3.8-flash',
      });
    } catch {
      return res.json({
        summary: text,
        source: 'gemini_ai_raw',
        model: 'gemini-3.8-flash',
      });
    }
  } catch (err: any) {
    console.error('Error during AI analysis:', err);
    const fallback = generateRuleBasedAnalysis(req.body);
    return res.json({
      ...fallback,
      source: 'rule_based_fallback_on_error',
      errorDetails: err?.message || 'Gemini API call failed',
      note: 'Returned deterministic engineering rules output due to service unavailability.',
    });
  }
});

// AI Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], currentTelemetry } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!aiClient) {
      // Friendly, simple English rule-based chat responder
      const lower = message.toLowerCase();
      let response = '';

      if (lower.includes('status') || lower.includes('health') || lower.includes('panel')) {
        response = `Your panel is currently showing an actual output of ${currentTelemetry?.actualPower ?? currentTelemetry?.measuredPower ?? 300} watts compared to an expected ${currentTelemetry?.expectedPower ?? 380} watts (status: ${currentTelemetry?.healthStatus ?? 'Healthy'}). If your output drops more than 10-15%, common reasons are dust, dirt, or shadows from nearby trees.`;
      } else if (lower.includes('temp') || lower.includes('heat') || lower.includes('hot')) {
        response = `Solar panels actually make slightly less electricity as they get very hot! When panels warm up past 25°C, their efficiency drops roughly 0.4% per degree. Keeping good airflow behind the panels helps them run cooler and produce more power. Note: high temperature alone does not mean the panel is broken.`;
      } else if (lower.includes('clean') || lower.includes('dust') || lower.includes('wash')) {
        response = `Dust and bird droppings can block sunlight and reduce output by 15% or more. Gently rinsing panels with clean water in the early morning or evening (when the glass is cool) is the safest way to restore output. Never use harsh brushes or wash them under hot direct sun.`;
      } else if (lower.includes('improve') || lower.includes('optimize') || lower.includes('save') || lower.includes('appliance')) {
        response = `The best way to maximize your solar savings is to run heavy appliances (like your washing machine, dishwasher, or EV charger) in the middle of the day between 11 AM and 2 PM when your solar panels are making the most free power.`;
      } else {
        response = `Your solar system is currently producing ${currentTelemetry?.actualPower ?? currentTelemetry?.measuredPower ?? 300}W (loss: ${currentTelemetry?.performanceLoss ?? currentTelemetry?.performanceGap ?? 5}%). To keep your system in top shape: 1) check for leaves or dirt on the glass, 2) look out for shadows during midday, and 3) ensure good ventilation behind the panels.`;
      }

      return res.json({
        reply: response,
        source: 'rule_based_offline',
        note: 'Simple solar guide response.',
      });
    }

    const systemInstruction = `You are SolarIQ AI, a friendly solar advisor for homeowners and first-time users.
Current panel status:
- Expected Power: ${currentTelemetry?.expectedPower ?? 'N/A'} Watts
- Actual Power: ${currentTelemetry?.actualPower ?? currentTelemetry?.measuredPower ?? 'N/A'} Watts
- Panel Temperature: ${currentTelemetry?.panelTemp ?? 'N/A'} °C
- Performance Loss: ${currentTelemetry?.performanceLoss ?? currentTelemetry?.performanceGap ?? 'N/A'} %
- Overall Status: ${currentTelemetry?.healthStatus ?? 'N/A'}

GUIDELINES:
- Use simple, everyday English. Avoid dense engineering jargon.
- Keep responses short, clear, and helpful (2 to 4 sentences or a few bullets).
- Explain that temperature alone does not prove a hardware fault; it often just causes temporary heat derating or points to airflow blockage.
- Give practical next steps that anyone can understand (cleaning, checking for shade, midday appliance scheduling).`;

    // Build contents from history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Push past history if available
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant' || item.sender === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Unable to generate response. Please try again.';
    return res.json({
      reply,
      source: 'gemini_ai',
      model: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.json({
      reply: `Telemetry analysis note: Current panel output is ${req.body?.currentTelemetry?.measuredPower || 'measured'} W vs ${req.body?.currentTelemetry?.expectedPower || 'expected'} W. For in-depth diagnostic evaluation, physical checks (IV-curve tracing and thermal imaging) are recommended. (AI Service notice: ${err?.message || 'Temporary service interruption, providing fallback guidance'}).`,
      source: 'rule_based_fallback',
    });
  }
});

// Serve frontend with Vite in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = parseInt(process.env.PORT || '3000', 10);

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SolarIQ AI server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
