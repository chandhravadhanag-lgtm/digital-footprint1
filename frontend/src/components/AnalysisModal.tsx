import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Brain } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onComplete: () => void;
  queryLabel: string;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onComplete,
  queryLabel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Verifying consent parameters & public query scope', detail: 'Ensuring zero private credential requests' },
    { label: 'Querying permitted public directories & authorized URLs', detail: 'Indexing GitHub, LinkedIn, and University listings' },
    { label: 'Running spaCy Named Entity Recognition (NER)', detail: 'Extracting PERSON, EDUCATION, ORGANIZATION, SKILLS' },
    { label: 'Computing scikit-learn TF-IDF similarity metrics', detail: 'Cross-referencing profile attributes' },
    { label: 'Synthesizing verified footprint dashboard', detail: 'Compiling source provenance ledger' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        {/* Top glowing line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />

        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white">Analyzing Digital Footprint</h3>
          <p className="text-xs text-blue-300 font-medium">
            Target Query: <span className="text-white font-semibold">"{queryLabel}"</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">NLP Pipeline Progress</span>
            <span className="text-blue-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Multi-stage items */}
        <div className="space-y-3 mb-6">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-500/10 border border-blue-500/30 text-white'
                    : isFinished
                    ? 'text-slate-300'
                    : 'text-slate-600 opacity-60'
                }`}
              >
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-semibold leading-tight">{step.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Analyzing authorized / public sources only</span>
        </div>
      </div>
    </div>
  );
};
