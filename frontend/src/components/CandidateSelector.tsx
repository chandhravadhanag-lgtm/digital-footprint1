import React from 'react';
import type { CandidateMatch } from '../types';
import { Users, UserCheck, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';

interface CandidateSelectorProps {
  name: string;
  candidates: CandidateMatch[];
  onSelectCandidate: (candidateId: string) => void;
  onBackToSearch: () => void;
  isLoading: boolean;
}

export const CandidateSelector: React.FC<CandidateSelectorProps> = ({
  name,
  candidates,
  onSelectCandidate,
  onBackToSearch,
  isLoading,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Alert Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Multiple Possible Matches Found
            </h2>
            <p className="text-xs text-purple-200">
              Multiple distinct public individuals share the name <strong className="text-white">"{name}"</strong>. 
              To prevent conflation, please select the intended person below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-purple-300/80 pt-2 border-t border-purple-500/20">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          <span>Strict Identity Matching Rule: DigitalTrace AI never merges data of different individuals into a single record.</span>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
          <span>Candidate Profiles Discovered ({candidates.length})</span>
          <button
            onClick={onBackToSearch}
            className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            &larr; Refine Search Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {candidates.map((c, idx) => (
            <div
              key={c.candidate_id || idx}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 space-y-4 relative flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    Match #{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {c.display_name}
                  </h3>
                  {c.score >= 80 && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Best Context Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  {c.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5">
                    Profession: <strong className="text-slate-200">{c.profession}</strong>
                  </span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5">
                    Organization: <strong className="text-slate-200">{c.organization}</strong>
                  </span>
                  {c.wikidata_url && (
                    <a
                      href={c.wikidata_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                    >
                      <span>Entity ID: {c.candidate_id}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <button
                  onClick={() => onSelectCandidate(c.candidate_id)}
                  disabled={isLoading}
                  className="w-full md:w-auto px-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Generating Report...' : 'Analyze This Profile'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
