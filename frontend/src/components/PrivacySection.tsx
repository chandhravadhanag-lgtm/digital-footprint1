import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText } from 'lucide-react';

interface PrivacySectionProps {
  onOpenRemovalGuidance: () => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ onOpenRemovalGuidance }) => {
  const points = [
    'Only public or user-authorized information is analyzed.',
    'Private Gmail messages and correspondence are never accessed.',
    'Private social-media information, DMs, and closed circles are not accessed.',
    'Passwords and account authentication keys are never collected.',
    'The system does not bypass platform authentication, paywalls, or privacy toggles.',
    'Photo analysis strictly requires prior user confirmation of permission.',
    'Every single result shows its exact origin URL and provenance source.',
    'Users can request removal guidance and delisting for information they control.',
  ];

  return (
    <section id="privacy" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Responsible & Ethical AI
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy & Ethical Commitments
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          DigitalTrace AI is designed from the ground up around user consent, public-only data ingestion, and complete provenance transparency.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((pt, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{pt}</p>
            </div>
          ))}
        </div>

        {/* Buttons requested in prompt: "Verify Information", "Privacy Controls", "Removal Guidance" */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => alert('DigitalTrace AI enables manual verification of any claim directly on your profile dashboard.')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Information</span>
          </button>

          <button
            onClick={() => alert('Privacy Controls allow toggling search exclusions and data provenance audits in the application dashboard.')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Privacy Controls</span>
          </button>

          <button
            onClick={onOpenRemovalGuidance}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Removal Guidance Wizard</span>
          </button>
        </div>
      </div>
    </section>
  );
};
