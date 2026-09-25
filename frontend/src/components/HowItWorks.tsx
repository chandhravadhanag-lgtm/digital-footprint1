import React from 'react';
import { LogIn, Compass, BrainCircuit, LayoutDashboard, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Input',
      description: 'Provide an authorized name, profile URL, or photograph.',
      icon: LogIn,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Discover',
      description: 'Collect information from permitted public sources and user-authorized data.',
      icon: Compass,
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      number: '03',
      title: 'Analyze',
      description: 'NLP extracts names, organizations, education, skills, dates and other entities.',
      icon: BrainCircuit,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      number: '04',
      title: 'Organize',
      description: 'Present the information in a unified profile with source references.',
      icon: LayoutDashboard,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Architecture Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          How DigitalTrace AI Operates
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          A four-step consent-oriented pipeline combining spaCy NLP entity extraction and verifiable source provenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} p-0.5 shadow-lg`}>
                    <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="text-3xl font-black text-white/10 font-mono">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "{step.description}"
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-blue-400 font-medium">
                <span>Phase {step.number} Validation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
