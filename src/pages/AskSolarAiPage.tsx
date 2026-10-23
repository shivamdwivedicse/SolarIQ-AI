import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { PanelCheckInputs, PanelCheckResult } from '../types/solarSimple';
import solariqEmblemImg from '../assets/images/solariq_emblem.png';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  time: string;
}

interface AskSolarAiPageProps {
  inputs: PanelCheckInputs;
  checkResult: PanelCheckResult;
}

export const AskSolarAiPage: React.FC<AskSolarAiPageProps> = ({
  inputs,
  checkResult,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your SolarIQ AI Assistant.

I am currently tuned into your rooftop panel telemetry:
• Expected Target: ${inputs.expectedPowerWatts}W
• Actual Output: ${inputs.actualPowerWatts}W (${checkResult.performanceLossPercent}% loss)
• Panel Temperature: ${inputs.panelTempCelsius}°C (${checkResult.status})

How can I help you understand your system, resolve power drops, or optimize your electricity schedule today?`,
      source: 'gemini_3.8_flash',
      time: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    'Why is my panel producing less electricity?',
    'What does performance loss mean?',
    'How can I improve solar generation?',
    'What does a high panel temperature mean?',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentTelemetry: {
            expectedPower: inputs.expectedPowerWatts,
            actualPower: inputs.actualPowerWatts,
            panelTemp: inputs.panelTempCelsius,
            performanceLoss: checkResult.performanceLossPercent,
            healthStatus: checkResult.status,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Your solar array is generating clean energy.',
        source: data.source || 'gemini_ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      const fallbackReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Based on your check (${inputs.actualPowerWatts}W actual vs ${inputs.expectedPowerWatts}W expected, status: ${checkResult.status}), a gentle morning rinse and checking for shade from trees are the quickest ways to restore power.`,
        source: 'rule_based_fallback',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#06172B] min-h-screen py-10 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Official Logo Emblem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-800 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#06172B] border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/10 animate-logo-float">
              <img
                src={solariqEmblemImg}
                alt="SolarIQ AI"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-wider text-[#6EE7B7] bg-[#059669]/20 border border-[#059669]/40 px-3.5 py-0.5 rounded-full">
                  AI Solar Advisor
                </span>
                <span className="text-xs font-mono uppercase text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-3 py-0.5 rounded font-bold">
                  GEMINI 3.8 FLASH
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight">
                Ask Solar AI
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Get instant, plain-English answers grounded directly in your current panel telemetry
              </p>
            </div>
          </div>

          {/* Live Context Badge */}
          <div className="bg-[#0F223D] border border-slate-700/80 px-5 py-3.5 rounded-2xl flex items-center gap-3.5 self-start sm:self-auto text-sm sm:text-base shadow-sm">
            <div className="w-3 h-3 rounded-full bg-[#6EE7B7] animate-pulse" />
            <span className="text-slate-300">
              Live: <strong className="text-white">{inputs.actualPowerWatts}W</strong> / {inputs.expectedPowerWatts}W ({checkResult.status})
            </span>
          </div>
        </div>

        {/* Suggested Questions Bar */}
        <div className="bg-[#0B1E36] border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Click a suggested question to ask:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-left text-sm sm:text-base bg-[#06172B] hover:bg-[#122744] border border-slate-700 hover:border-[#38BDF8]/60 text-slate-200 px-5 py-4 rounded-2xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-between group shadow-sm"
              >
                <span className="font-semibold">{q}</span>
                <span className="text-[#38BDF8] group-hover:translate-x-1.5 transition-transform ml-3 text-lg font-bold">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation Thread */}
        <div className="bg-[#0A1A30] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col h-[580px]">
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#06172B] border border-emerald-500/30 p-1 flex items-center justify-center shrink-0 shadow-md">
                    <img
                      src={solariqEmblemImg}
                      alt="SolarIQ AI"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 text-base sm:text-[17px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#059669] text-white rounded-br-none shadow-md'
                      : 'bg-[#122744] border border-slate-700 text-slate-100 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-700/60">
                    <span>{m.time}</span>
                    {m.source && (
                      <span className="uppercase font-mono text-xs text-slate-400">
                        {m.source.includes('gemini') ? 'Gemini 3.8 Flash' : 'Rule Engine'}
                      </span>
                    )}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-10 h-10 rounded-2xl bg-[#059669]/30 border border-[#059669]/50 text-[#6EE7B7] flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {/* Branded Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 items-center text-sm text-slate-300">
                <div className="w-10 h-10 rounded-2xl bg-[#06172B] border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 animate-logo-float shadow-md">
                  <img
                    src={solariqEmblemImg}
                    alt="SolarIQ AI thinking"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="bg-[#122744] border border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#38BDF8]" />
                  <span className="text-base font-medium text-white">SolarIQ AI is thinking in plain English...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-5 border-t border-slate-800 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about your solar panel health, dust, shading, heat, or battery..."
              disabled={isLoading}
              className="flex-1 bg-[#06172B] border border-slate-700 focus:border-[#059669] rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-7 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base sm:text-lg flex items-center gap-2.5 shadow-xl shadow-[#059669]/30 disabled:opacity-40 transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
