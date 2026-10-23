import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PanelTelemetry, SolarInstallation } from '../types/solar';

interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  source?: string;
  timestamp: string;
}

interface GeminiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: PanelTelemetry;
  installation: SolarInstallation;
  scenarioName: string;
}

const QUICK_PROMPTS = [
  'Explain why measured output deviates from expected power in this scenario.',
  'How does high cell temperature (thermal derating) physically degrade PV efficiency?',
  'What on-site tests are required to confirm if this is soiling versus a cell micro-crack?',
  'Recommend the most cost-effective load shifting schedule for my EV and battery storage.',
];

export const GeminiChatAssistant: React.FC<GeminiChatAssistantProps> = ({
  isOpen,
  onClose,
  telemetry,
  installation,
  scenarioName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'model',
      text: `Hello! I am your SolarIQ AI Diagnostics & Optimization Assistant. I am monitoring **${installation.name}** under the **${scenarioName}** profile.

Current Live Telemetry:
- **Measured Output**: ${telemetry.measuredPower.toFixed(1)} W (V: ${telemetry.voltage.toFixed(1)}V, I: ${telemetry.current.toFixed(1)}A)
- **Model Expected**: ${telemetry.expectedPower.toFixed(1)} W @ ${telemetry.irradiance} W/m²
- **Performance Gap**: ${telemetry.performanceGap.toFixed(1)}% (${telemetry.healthStatus})
- **Cell Temp**: ${telemetry.panelTemp.toFixed(1)} °C

How can I help you analyze these readings, investigate performance loss, or optimize your dispatch schedule?`,
      source: 'gemini_3.8_flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          currentTelemetry: {
            installationName: installation.name,
            panelTemp: telemetry.panelTemp,
            voltage: telemetry.voltage,
            current: telemetry.current,
            measuredPower: telemetry.measuredPower,
            expectedPower: telemetry.expectedPower,
            irradiance: telemetry.irradiance,
            performanceGap: telemetry.performanceGap,
            healthStatus: telemetry.healthStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'model',
        text: data.reply || 'Analysis complete.',
        source: data.source || 'gemini_ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'model',
        text: `Analysis note: Current measured output is ${telemetry.measuredPower.toFixed(1)} W vs ${telemetry.expectedPower.toFixed(1)} W expected (Gap: ${telemetry.performanceGap.toFixed(1)}%). In PV diagnostics, telemetry variations warrant field verification (IV-curve tracing and thermal imaging) rather than assuming a verified physical defect.`,
        source: 'rule_based_fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="SolarIQ AI Diagnostics Chat"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#090d16] border-l border-slate-800 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              SolarIQ AI Diagnostic Advisor
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close AI Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Telemetry Context Snippet */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          Context: <strong className="text-slate-200">{telemetry.measuredPower.toFixed(0)}W</strong> / {telemetry.expectedPower.toFixed(0)}W ({telemetry.healthStatus})
        </span>
        <span className="text-slate-500">
          T: {telemetry.panelTemp.toFixed(1)}°C · {telemetry.irradiance} W/m²
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'model' && (
              <div className="w-7 h-7 rounded-md bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                {m.text}
              </div>
              <div
                className={`text-[10px] mt-1.5 flex items-center justify-between gap-2 pt-1 border-t ${
                  m.sender === 'user' ? 'border-emerald-500/40 text-emerald-100' : 'border-slate-800 text-slate-500'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.source && (
                  <span className="uppercase text-[9px] font-mono">
                    {m.source.includes('gemini') ? 'Gemini AI' : 'Deterministic Rules'}
                  </span>
                )}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-md bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-md bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>SolarIQ AI is evaluating telemetry models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block mb-1.5">
          Suggested Engineering Prompts:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-left text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 rounded px-2.5 py-1 transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/70">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about panel health, thermal derating, load shifting..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-xs flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 mt-1.5 text-center">
          SolarIQ AI grounds answers in live telemetry without fabricating sensor readings.
        </p>
      </div>
    </aside>
  );
};
