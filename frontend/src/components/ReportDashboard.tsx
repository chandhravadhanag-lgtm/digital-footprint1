import React from 'react';
import type { DynamicReport } from '../types';
import { 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  FileText, 
  RefreshCw, 
  Download, 
  Calendar,
  Building2,
  Users
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface ReportDashboardProps {
  report: DynamicReport;
  onNewSearch: () => void;
  onSelectAnotherCandidate?: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onNewSearch,
  onSelectAnotherCandidate,
}) => {
  const { person, social_profiles, websites, news, sources, confidence, possible_matches } = report;

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `digital_footprint_${person.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <GithubIcon className="w-5 h-5 text-purple-400" />;
    if (p.includes('linkedin')) return <LinkedinIcon className="w-5 h-5 text-blue-400" />;
    if (p.includes('instagram')) return <InstagramIcon className="w-5 h-5 text-pink-400" />;
    if (p.includes('facebook')) return <FacebookIcon className="w-5 h-5 text-blue-500" />;
    if (p.includes('x') || p.includes('twitter')) return <span className="font-bold text-sm text-white">𝕏</span>;
    if (p.includes('youtube')) return <span className="font-bold text-sm text-red-500">▶</span>;
    return <Globe className="w-5 h-5 text-cyan-400" />;
  };

  const renderConfidenceBadge = (conf: string) => {
    const c = conf.toLowerCase();
    if (c === 'high') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">High Confidence</span>;
    }
    if (c === 'medium') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400">Medium Confidence</span>;
    }
    if (c.includes('disagree')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">Sources Disagree</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">Unverified / Low</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner Notice */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-bold text-white tracking-wide">PUBLIC INFORMATION REPORT</span>
          <span className="text-blue-300/80 hidden md:inline">— Aggregated from legitimate public APIs and verified search provenance</span>
        </div>
        <div className="text-[11px] text-blue-300 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          Zero Private Scraping
        </div>
      </div>

      {/* Main Identity Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {person.avatar_url ? (
              <img
                src={person.avatar_url}
                alt={person.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-3xl font-extrabold text-white">
                {person.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {person.name}
                </h1>
                {renderConfidenceBadge(confidence)}
              </div>

              <p className="text-sm font-medium text-slate-300">
                {person.headline || 'Public Profile Record'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="text-blue-400 font-semibold">
                  Sources Corroborated: {sources.length}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">
                  Social Presence: {social_profiles.filter(s => s.is_verified).length} Active
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {possible_matches && possible_matches.length > 1 && onSelectAnotherCandidate && (
              <button
                onClick={onSelectAnotherCandidate}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                title="View other individuals discovered with this name"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Other Matches ({possible_matches.length})</span>
              </button>
            )}

            <button
              onClick={exportJson}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onNewSearch}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          </div>
        </div>

        {/* Biographical Summary */}
        {person.biography_summary && person.biography_summary !== "Not found / Not publicly verified" && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Public Biography Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5 font-sans">
              "{person.biography_summary}"
            </p>
          </div>
        )}
      </div>

      {/* Grid of Key Attribute Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Profession & Occupation */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Profession / Occupation</span>
            </div>
            {renderConfidenceBadge(person.profession.confidence)}
          </div>

          <div className="space-y-1">
            <p className={`text-base font-bold ${person.profession.value.includes('Not found') ? 'text-slate-400 italic font-normal text-xs' : 'text-white'}`}>
              {person.profession.value}
            </p>
            {person.profession.source && !person.profession.source.includes('Not found') && (
              <a
                href={person.profession.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Source: {person.profession.source.length > 35 ? person.profession.source.substring(0, 35) + '...' : person.profession.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Card 2: Current or Previous Organization */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Organization / Employer</span>
            </div>
            {renderConfidenceBadge(person.organization.confidence)}
          </div>

          <div className="space-y-1">
            <p className={`text-base font-bold ${person.organization.value.includes('Not found') ? 'text-slate-400 italic font-normal text-xs' : 'text-white'}`}>
              {person.organization.value}
            </p>
            {person.organization.source && !person.organization.source.includes('Not found') && (
              <a
                href={person.organization.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Source: {person.organization.source.length > 35 ? person.organization.source.substring(0, 35) + '...' : person.organization.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Card 3: Date of Birth */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Date of Birth</span>
            </div>
            {renderConfidenceBadge(person.date_of_birth.confidence)}
          </div>

          <div className="space-y-1">
            <p className={`text-base font-bold ${person.date_of_birth.value.includes('Not found') ? 'text-slate-400 italic font-normal text-xs' : 'text-white'}`}>
              {person.date_of_birth.value}
            </p>
            {person.date_of_birth.source && !person.date_of_birth.source.includes('Not found') && (
              <a
                href={person.date_of_birth.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Source: {person.date_of_birth.source.length > 35 ? person.date_of_birth.source.substring(0, 35) + '...' : person.date_of_birth.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Education & Career Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>Documented Education</span>
            </div>
            <span className="text-xs text-slate-400">{person.education.length} Records</span>
          </div>

          <div className="space-y-3">
            {person.education.map((edu, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                  {renderConfidenceBadge(edu.confidence)}
                </div>
                <p className="text-xs text-slate-300">{edu.degree}</p>
                {edu.source && !edu.source.includes('Not found') && (
                  <a
                    href={edu.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>View Provenance</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Career & Organizations Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Career & Organizations</span>
            </div>
            <span className="text-xs text-slate-400">{person.career.length} Records</span>
          </div>

          <div className="space-y-3">
            {person.career.map((car, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white">{car.organization}</h4>
                  {renderConfidenceBadge(car.confidence)}
                </div>
                <p className="text-xs text-slate-300">{car.role} • {car.period}</p>
                {car.source && !car.source.includes('Not found') && (
                  <a
                    href={car.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>View Provenance</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Profiles Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Public Social-Media & Profile URLs</h3>
            <p className="text-xs text-slate-400">
              Only public, verified handles are displayed. Private circles and DMs are never accessed.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
            6 Official Platforms Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {social_profiles.map((soc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                soc.is_verified
                  ? 'bg-slate-900/80 border-white/10 hover:border-blue-500/40'
                  : 'bg-slate-900/40 border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    {getPlatformIcon(soc.platform)}
                  </div>
                  <span className="text-sm font-bold text-white">{soc.platform}</span>
                </div>
                {renderConfidenceBadge(soc.confidence)}
              </div>

              {soc.is_verified ? (
                <div className="space-y-1">
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{soc.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <p className="text-[10px] text-slate-500">Source: {soc.source}</p>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Not found / Not publicly verified
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Websites & News Mentions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Websites */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Public Websites & Knowledge Bases</span>
            </div>
          </div>

          {person.official_website.value && !person.official_website.value.includes('Not found') && (
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Official / Personal Website</span>
                {renderConfidenceBadge(person.official_website.confidence)}
              </div>
              <a
                href={person.official_website.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-blue-300 hover:underline flex items-center gap-1"
              >
                <span>{person.official_website.value}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="space-y-2.5">
            {websites.map((w, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white hover:text-blue-300 flex items-center gap-1"
                >
                  <span>{w.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {w.snippet && <p className="text-[11px] text-slate-400 line-clamp-2">{w.snippet}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* News Mentions */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Public News & Press Mentions</span>
            </div>
            <span className="text-xs text-slate-400">{news.length} Mentions</span>
          </div>

          <div className="space-y-2.5">
            {news.length > 0 ? (
              news.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-white hover:text-blue-300 flex items-center gap-1 line-clamp-1"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.source}</span>
                  </div>
                  {item.snippet && <p className="text-[11px] text-slate-400 line-clamp-2">{item.snippet}</p>}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-3">
                No recent public news articles indexed for this person.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sources Provenance Ledger Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Source Provenance Ledger</h3>
            <p className="text-xs text-slate-400">
              Every fact extracted in this report links to a specific public URL in this ledger.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {sources.length} Verified Sources Cited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Platform / Service</th>
                <th className="px-4 py-3">Target URL</th>
                <th className="px-4 py-3 text-right">Reliability Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sources.map((src, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold text-white">{src.platform}</td>
                  <td className="px-4 py-3 font-mono text-blue-400">
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {src.url.length > 55 ? `${src.url.substring(0, 55)}...` : src.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-emerald-400 font-bold">{src.reliability}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
