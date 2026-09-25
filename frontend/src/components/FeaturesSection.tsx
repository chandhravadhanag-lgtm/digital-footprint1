import React from 'react';
import { 
  FileText, 
  GitMerge, 
  GraduationCap, 
  Cpu, 
  Search, 
  Image as ImageIcon, 
  ShieldCheck, 
  LockKeyhole 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'NLP Entity Extraction',
      description: 'spaCy pipeline extracts tokenized entities: PERSON, ORGANIZATION, EDUCATION, LOCATION, SKILL, and DATE with exact character offsets.',
      icon: FileText,
      badge: 'spaCy + NER',
      accent: 'blue',
    },
    {
      title: 'Profile Matching',
      description: 'scikit-learn TF-IDF vectorization and cosine similarity algorithms evaluate bio concordance across public handles.',
      icon: GitMerge,
      badge: 'TF-IDF Similarity',
      accent: 'indigo',
    },
    {
      title: 'Education Extraction',
      description: 'Extracts universities, conferred degrees (B.Tech, M.S., Ph.D.), and graduation years from publicly accessible directories.',
      icon: GraduationCap,
      badge: 'Academic Records',
      accent: 'emerald',
    },
    {
      title: 'Skill Extraction',
      description: 'Identifies technical proficiencies and tooling from GitHub public repository topics and open-source contributions.',
      icon: Cpu,
      badge: 'Entity Ruler',
      accent: 'purple',
    },
    {
      title: 'Public Profile Discovery',
      description: 'Aggregates authorized presence on GitHub, LinkedIn, Instagram, and Facebook using public URL endpoints only.',
      icon: Search,
      badge: 'Public Indexing',
      accent: 'cyan',
    },
    {
      title: 'Image Matching for Authorized Profiles',
      description: 'Permits user-consented photo checks against public avatars with strict consent confirmation guardrails.',
      icon: ImageIcon,
      badge: 'Consent-Verified',
      accent: 'amber',
    },
    {
      title: 'Source Verification',
      description: 'Every extracted claim links directly to its origin URL with an interactive user verification and dispute mechanism.',
      icon: ShieldCheck,
      badge: 'Provenance Ledger',
      accent: 'teal',
    },
    {
      title: 'Privacy Controls',
      description: 'Empowers users with step-by-step removal guidance, cache purges, and transparency on zero private data ingestion.',
      icon: LockKeyhole,
      badge: 'Ethical AI',
      accent: 'rose',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Core Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Engineered for Accuracy & Integrity
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Combining statistical natural language processing with principled privacy boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Public/Authorized Scope</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
