import React from 'react';
import { GraduationCap, Scale, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Mission & Ethics
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          About DigitalTrace AI
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          An academic NLP and Full-Stack research initiative illustrating how ethical entity resolution and natural language pipelines can clarify personal digital footprints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Academic Prototype</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Developed to demonstrate state-of-the-art information extraction, EntityRuler pattern matching, and TF-IDF similarity vectorization on consented and public Web standards.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Ethical Boundaries</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strict refusal of clandestine data harvesting: no credential brute-forcing, zero private message indexing, and prohibition of reverse phone search on unaffiliated individuals.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Open Architecture</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Built with modern Python FastAPI, spaCy NER engines, scikit-learn, and React TypeScript with Tailwind CSS for high reliability, clean UX, and verifiable provenance tracking.
          </p>
        </div>
      </div>
    </section>
  );
};
