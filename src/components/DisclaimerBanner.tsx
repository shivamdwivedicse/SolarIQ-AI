import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900/90 border-b border-amber-500/30 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-amber-300 font-semibold uppercase tracking-wider text-[11px] mr-1.5">Engineering Prototype Notice:</strong>
            SolarIQ AI provides computational modeling and decision-support hypotheses based on electrical telemetry. In photovoltaic engineering, voltage or temperature deviations alone do not definitively prove physical internal faults. Physical diagnosis requires licensed on-site thermography and IV-curve testing.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="Dismiss disclaimer banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
