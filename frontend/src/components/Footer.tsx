import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#04060c] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white text-base">DigitalTrace AI</span>
              <p className="text-[11px] text-slate-500">Consent-Based Footprint Extraction Engine</p>
            </div>
          </div>

          {/* Academic Prototype Disclaimer Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Academic Prototype — Zero Private Account Ingestion
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Built with React, TypeScript, Tailwind CSS, Python FastAPI, spaCy, and scikit-learn.
          </p>
          <p>
            This prototype does not access private accounts or bypass platform privacy controls.
          </p>
        </div>
      </div>
    </footer>
  );
};
