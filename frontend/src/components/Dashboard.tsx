import React, { useState } from 'react';
import type { ProfileData } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Globe, 
  Image as ImageIcon, 
  FileText, 
  BrainCircuit, 
  Link as LinkIcon, 
  Lock, 
  RefreshCw, 
  Download, 
  Sliders, 
  Check,
  Building2,
  Sparkles,
  MapPin,
  Send,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface DashboardProps {
  profile: ProfileData;
  onNewSearch: () => void;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onNewSearch, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profiles' | 'education' | 'career' | 'skills' | 'photos' | 'mentions' | 'nlp' | 'sources' | 'connected' | 'privacy'
  >('overview');

  // Interactive verification state overrides
  const [verifiedItems, setVerifiedItems] = useState<{ [key: string]: boolean }>({
    'source-1': true,
    'source-2': true,
    'edu-1': true,
    'emp-1': true,
  });

  // Connected OAuth mock state
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    linkedin: true,
    github: true,
  });

  // Interactive live NLP test state
  const [nlpInputText, setNlpInputText] = useState(
    'John completed his B.Tech at ABC University and works at XYZ Technologies building Python and React applications.'
  );
  const [liveNlpResults, setLiveNlpResults] = useState<any>(null);
  const [liveNlpLoading, setLiveNlpLoading] = useState(false);

  // Privacy Request Form State
  const [privacyItem, setPrivacyItem] = useState('Old Public Directory Listing');
  const [privacyType, setPrivacyType] = useState('Removal Guidance');
  const [privacyEmail, setPrivacyEmail] = useState('alex.morgan.user@example.com');
  const [privacySubmittedTicket, setPrivacySubmittedTicket] = useState<any>(null);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const toggleVerify = async (type: string, id: number) => {
    const key = `${type}-${id}`;
    const nextState = !verifiedItems[key];
    setVerifiedItems(prev => ({ ...prev, [key]: nextState }));

    try {
      await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: type, item_id: id, is_verified: nextState }),
      });
    } catch (e) {
      console.error('Verify API error:', e);
    }
  };

  const handleLiveNlpAnalyze = async () => {
    setLiveNlpLoading(true);
    try {
      const res = await fetch('/api/nlp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nlpInputText }),
      });
      const data = await res.json();
      setLiveNlpResults(data);
    } catch (err) {
      console.error('NLP test error:', err);
    } finally {
      setLiveNlpLoading(false);
    }
  };

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacyLoading(true);
    try {
      const res = await fetch('/api/privacy/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profile.id,
          request_type: privacyType,
          target_item: privacyItem,
          contact_email: privacyEmail,
        }),
      });
      const data = await res.json();
      setPrivacySubmittedTicket(data);
    } catch (err) {
      console.error('Privacy request error:', err);
    } finally {
      setPrivacyLoading(false);
    }
  };

  const exportJsonReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `digitaltrace_${profile.full_name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Strict Prototype Sample Notice Bar */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold tracking-wide text-amber-300">
            SAMPLE DATA — NOT REAL PERSON INFORMATION
          </span>
          <span className="text-amber-200/80 hidden md:inline">
            | Academic demonstration prototype for NLP entity matching.
          </span>
        </div>
        <div className="text-[11px] text-amber-300/80 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
          Consent-Verified Architecture
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Avatar and Person Meta */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={profile.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl shadow-blue-500/10"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#090d16]" title="Publicly Indexed">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.full_name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Check className="w-3 h-3" />
                  Analysis Completed
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                  <ShieldCheck className="w-3 h-3" />
                  Public/Authorized Data
                </span>
              </div>

              <p className="text-sm font-medium text-slate-300">{profile.headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profile.location}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-semibold">
                  Sources Found: {profile.sources_count}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">
                  Match Confidence: {Math.round(profile.confidence_score * 100)}% ({profile.confidence_level})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={onRefresh}
              title="Refresh profile data from backend"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportJsonReport}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report (JSON)</span>
            </button>
            <button
              onClick={onNewSearch}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run New Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="border-b border-white/10 overflow-x-auto pb-1 scrollbar-none">
        <nav className="flex space-x-1 min-w-max">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'profiles', label: 'Profiles', icon: LinkIcon },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'career', label: 'Career', icon: Briefcase },
            { id: 'skills', label: 'Skills', icon: Award },
            { id: 'photos', label: 'Photos', icon: ImageIcon },
            { id: 'mentions', label: 'Web Mentions', icon: FileText },
            { id: 'nlp', label: 'NLP Insights', icon: BrainCircuit },
            { id: 'sources', label: 'Sources', icon: ShieldCheck },
            { id: 'connected', label: 'Connected Accounts', icon: Sliders },
            { id: 'privacy', label: 'Privacy & Guidance', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Full Name</span>
              <p className="text-sm font-bold text-white truncate">{profile.full_name}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Professional Role</span>
              <p className="text-sm font-bold text-white truncate">
                {profile.employment[0]?.role || 'Software Developer'}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Education</span>
              <p className="text-sm font-bold text-white truncate">
                {profile.education[0]?.degree || 'B.Tech in CS'}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Location</span>
              <p className="text-sm font-bold text-white truncate">{profile.location || 'Public Listing'}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Identified Skills</span>
              <p className="text-sm font-bold text-blue-400">{profile.skills.length} Extracted</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Public Profiles</span>
              <p className="text-sm font-bold text-purple-400">4 Matched</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Information Confidence Visualization</h3>
                <p className="text-xs text-slate-400">
                  Statistical confidence metrics computed by matching public profiles and verified directory entries.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                89% Aggregate Reliability
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-300">High Confidence</span>
                  <span className="font-mono text-emerald-400 font-bold">75% (6 Sources)</span>
                </div>
                <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-[11px] text-slate-300">
                  GitHub repos, university graduation record, and LinkedIn confirmed with multi-point matching.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-300">Medium Confidence</span>
                  <span className="font-mono text-blue-400 font-bold">18% (2 Sources)</span>
                </div>
                <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }} />
                </div>
                <p className="text-[11px] text-slate-300">
                  Public press articles and hackathon directory listings with single-mention corroboration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300">Needs Verification</span>
                  <span className="font-mono text-amber-400 font-bold">7% (1 Profile)</span>
                </div>
                <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '7%' }} />
                </div>
                <p className="text-[11px] text-slate-300">
                  Instagram handle has similar username but requires explicit user verification.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <BrainCircuit className="w-4 h-4 text-blue-400" />
                <span>spaCy NLP Extracted Entity Preview</span>
              </div>
              <button
                onClick={() => setActiveTab('nlp')}
                className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Open Full NLP Panel &rarr;
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.entities.slice(0, 8).map((ent) => (
                <div
                  key={ent.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs"
                >
                  <span className="font-medium text-white">{ent.text}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ent.label === 'PERSON' ? 'bg-blue-500/20 text-blue-300' :
                    ent.label === 'ORGANIZATION' ? 'bg-purple-500/20 text-purple-300' :
                    ent.label === 'EDUCATION' ? 'bg-emerald-500/20 text-emerald-300' :
                    ent.label === 'SKILL' ? 'bg-cyan-500/20 text-cyan-300' :
                    ent.label === 'LOCATION' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {ent.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILES */}
      {activeTab === 'profiles' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Public Profile Matching</h2>
              <p className="text-xs text-slate-400">
                Matches across authorized public platforms with similarity indices. Sample data clearly tagged.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              4 Target Platforms Checked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                platform: 'GitHub',
                icon: GithubIcon,
                username: `${profile.full_name.toLowerCase().replace(/\s+/g, '')}-dev`,
                url: `https://github.com/${profile.full_name.toLowerCase().replace(/\s+/g, '')}-dev`,
                confidence: 96,
                verifiedKey: 'source-1',
                desc: 'Public repositories, contribution activity, and README bio matching.',
                color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
              },
              {
                platform: 'LinkedIn',
                icon: LinkedinIcon,
                username: `${profile.full_name.toLowerCase().replace(/\s+/g, '-')}-sample`,
                url: `https://linkedin.com/in/${profile.full_name.toLowerCase().replace(/\s+/g, '-')}-sample`,
                confidence: 93,
                verifiedKey: 'source-2',
                desc: 'Public headline, education timeline, and stated skill tags.',
                color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
              },
              {
                platform: 'Instagram',
                icon: InstagramIcon,
                username: `${profile.full_name.toLowerCase().replace(/\s+/g, '.')}.codes`,
                url: `https://instagram.com/${profile.full_name.toLowerCase().replace(/\s+/g, '.')}.codes`,
                confidence: 78,
                verifiedKey: 'source-3',
                desc: 'Public profile bio with developer references. Requires manual verification.',
                color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
              },
              {
                platform: 'Facebook',
                icon: FacebookIcon,
                username: `${profile.full_name.toLowerCase().replace(/\s+/g, '.')}.public`,
                url: `https://facebook.com/${profile.full_name.toLowerCase().replace(/\s+/g, '.')}.public`,
                confidence: 71,
                verifiedKey: 'source-4',
                desc: 'Public page listing matching graduation cohort.',
                color: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              const isVerified = verifiedItems[card.verifiedKey] ?? false;
              return (
                <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl border ${card.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{card.platform}</h3>
                        <span className="text-xs font-mono text-slate-300">@{card.username}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                      Sample Data
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Match Confidence</span>
                      <span className="font-mono font-bold text-blue-400">{card.confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${card.confidence}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => toggleVerify('source', idx + 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>{isVerified ? 'Verified by You' : 'Verify Account'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EDUCATION */}
      {activeTab === 'education' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Education & Academic Timeline</h2>
            <p className="text-xs text-slate-400">
              Extracted from university student directories and public credential badges.
            </p>
          </div>

          <div className="space-y-4">
            {profile.education.map((edu) => {
              const isVerified = verifiedItems[`edu-${edu.id}`] ?? edu.is_verified;
              return (
                <div key={edu.id} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                        <p className="text-sm font-semibold text-blue-300">{edu.institution}</p>
                        <p className="text-xs text-slate-400">{edu.period} • {edu.field_of_study}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                        {Math.round(edu.confidence * 100)}% Confidence
                      </span>
                      <button
                        onClick={() => toggleVerify('education', edu.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isVerified ? 'Verified' : 'Verify'}</span>
                      </button>
                    </div>
                  </div>

                  {edu.extracted_text && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 font-mono">
                      <span className="text-slate-500 font-bold block mb-1 uppercase text-[10px]">Extracted Text:</span>
                      "{edu.extracted_text}"
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Source Provenance: <strong className="text-slate-200">{edu.source_platform}</strong></span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Public Registry Corroborated
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CAREER */}
      {activeTab === 'career' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Employment & Career History</h2>
            <p className="text-xs text-slate-400">
              Corroborated from public open-source project disclosures and professional listings.
            </p>
          </div>

          <div className="space-y-4">
            {profile.employment.map((emp) => {
              const isVerified = verifiedItems[`emp-${emp.id}`] ?? emp.is_verified;
              return (
                <div key={emp.id} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-1">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">{emp.role}</h3>
                        <p className="text-sm font-semibold text-indigo-300">{emp.organization}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {emp.period}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVerify('employment', emp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isVerified ? 'Verified' : 'Verify'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{emp.description}</p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Source: <strong className="text-slate-200">{emp.source_platform}</strong></span>
                    <span className="font-mono text-blue-400 font-semibold">{Math.round(emp.confidence * 100)}% Match</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Identified Technical Skills</h2>
            <p className="text-xs text-slate-400">
              Extracted via spaCy EntityRuler pattern classification and public GitHub repository topic mining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.skills.map((skill) => (
              <div key={skill.id} className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">{skill.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    {skill.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Extraction Confidence</span>
                    <span className="font-mono text-emerald-400 font-bold">{Math.round(skill.confidence * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${skill.confidence * 100}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
                  <p className="text-slate-400">
                    <span className="text-slate-500">Method: </span>
                    {skill.extraction_method}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-500">Source: </span>
                    <strong className="text-slate-300">{skill.source_label}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Authorized Sample Photo Gallery</h2>
              <p className="text-xs text-slate-400">
                Sample portraits matching public conference listings. Private social media photos are never scraped.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Permission-Confirmed Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.photos.map((photo) => (
              <div key={photo.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-3 p-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Sample Avatar'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Public / Authorized
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300">
                    Sample Demo Image
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{photo.caption}</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Source: {photo.source_platform}</span>
                    <span>Date: {photo.date_found}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => alert(`Verified prototype demo image source: ${photo.source_platform}`)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Provenance</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: WEB MENTIONS */}
      {activeTab === 'mentions' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Public Web Mentions & Articles</h2>
            <p className="text-xs text-slate-400">
              Publicly indexed articles, academic publications, and press releases.
            </p>
          </div>

          <div className="space-y-4">
            {profile.web_mentions.map((mention) => (
              <div key={mention.id} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        {mention.website}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{mention.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{mention.title}</h3>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
                    Relevance: {Math.round(mention.relevance_score * 100)}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  "{mention.extracted_information}"
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Scanned via Public HTTP/RSS Index</span>
                  <a
                    href={mention.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>View Article Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: NLP INSIGHTS */}
      {activeTab === 'nlp' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">NLP Insights & Entity Extraction Engine</h2>
            <p className="text-xs text-slate-400">
              Under-the-hood natural language processing using spaCy token classification, EntityRuler, and scikit-learn TF-IDF.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Reference NLP Extraction Example</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono space-y-3">
              <div className="text-slate-400">
                <span className="text-slate-500 font-bold">RAW SENTENCE:</span><br />
                "John completed his B.Tech at ABC University and works at XYZ Technologies."
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-slate-500 font-bold block">EXTRACTED ENTITIES:</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300">
                    PERSON &rarr; John
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                    EDUCATION &rarr; B.Tech
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    ORGANIZATION &rarr; ABC University
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    ORGANIZATION &rarr; XYZ Technologies
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Live NLP Sandbox</h3>
                <p className="text-xs text-slate-400">
                  Enter any biographical statement or public profile summary to test real-time entity recognition.
                </p>
              </div>
              <span className="text-[11px] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                Active spaCy Engine
              </span>
            </div>

            <div className="space-y-3">
              <textarea
                value={nlpInputText}
                onChange={(e) => setNlpInputText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleLiveNlpAnalyze}
                disabled={liveNlpLoading}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 flex items-center gap-2 cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>{liveNlpLoading ? 'Extracting with spaCy...' : 'Extract Entities & Keywords with spaCy'}</span>
              </button>
            </div>

            {liveNlpResults && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-4 text-xs font-mono animate-fade-in">
                <div>
                  <span className="text-slate-400 font-bold block mb-2">EXTRACTED ENTITIES ({liveNlpResults.entities.length}):</span>
                  <div className="flex flex-wrap gap-2">
                    {liveNlpResults.entities.map((ent: any, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-white flex items-center gap-1.5"
                      >
                        <strong className="text-blue-300">{ent.text}</strong>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-200">
                          {ent.label} ({Math.round(ent.confidence * 100)}%)
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <span className="text-slate-400 font-bold block mb-2">TOP TF-IDF KEYWORDS:</span>
                  <div className="flex flex-wrap gap-2">
                    {liveNlpResults.keywords.map((kw: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                        {kw.keyword} ({kw.score})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cosine Similarity to Reference Bio:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {liveNlpResults.similarity_to_benchmark}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 9: SOURCES */}
      {activeTab === 'sources' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Discovered Source Provenance Registry</h2>
            <p className="text-xs text-slate-400">
              Full breakdown of the 8 publicly accessible sources corroborating this digital footprint.
            </p>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5">Platform</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Source URL</th>
                    <th className="px-5 py-3.5">Reliability</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profile.sources.map((src) => {
                    const isVerified = verifiedItems[`source-${src.id}`] ?? src.is_verified;
                    return (
                      <tr key={src.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-bold text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          {src.platform}
                        </td>
                        <td className="px-5 py-4 text-slate-300">{src.source_type}</td>
                        <td className="px-5 py-4 font-mono text-slate-400">
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 hover:underline">
                            {src.url.length > 38 ? `${src.url.substring(0, 38)}...` : src.url}
                          </a>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                          {Math.round(src.reliability_score * 100)}%
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isVerified ? 'Verified' : 'Public Index'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => toggleVerify('source', src.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            {isVerified ? 'Dispute' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: CONNECTED ACCOUNTS */}
      {activeTab === 'connected' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Connected Accounts (Authorized OAuth)</h2>
            <p className="text-xs text-slate-400">
              Users can optionally connect their own accounts to verify ownership.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-1">
            <span className="font-bold text-white">Zero Private Data Ingestion Policy:</span>
            <p>
              DigitalTrace AI does not read private Gmail messages, search histories, or private social posts. 
              OAuth scopes are strictly limited to user profile verification (e.g. confirming email ownership).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <Globe className="w-6 h-6" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  connectedAccounts.google 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {connectedAccounts.google ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Google / Gmail</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Connect only with explicit OAuth permission for identity verification. No private emails accessed.
                </p>
              </div>

              <button
                onClick={() => setConnectedAccounts(prev => ({ ...prev, google: !prev.google }))}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  connectedAccounts.google
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {connectedAccounts.google ? 'Disconnect Google' : 'Connect via Google OAuth'}
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <LinkedinIcon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  connectedAccounts.linkedin 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {connectedAccounts.linkedin ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">LinkedIn</h3>
                <p className="text-xs text-slate-300 mt-1">
                  OAuth identity handshake confirming public employment timeline and credentials.
                </p>
              </div>

              <button
                onClick={() => setConnectedAccounts(prev => ({ ...prev, linkedin: !prev.linkedin }))}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  connectedAccounts.linkedin
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {connectedAccounts.linkedin ? 'Disconnect LinkedIn' : 'Connect via LinkedIn'}
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  connectedAccounts.github 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {connectedAccounts.github ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">GitHub</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Authorizes inspection of public commit repositories for technical skill extraction.
                </p>
              </div>

              <button
                onClick={() => setConnectedAccounts(prev => ({ ...prev, github: !prev.github }))}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  connectedAccounts.github
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {connectedAccounts.github ? 'Disconnect GitHub' : 'Connect via GitHub'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: PRIVACY & REMOVAL GUIDANCE */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white">Privacy Rights & Data Removal Guidance</h2>
            <p className="text-xs text-slate-400">
              Guidance for removing or restricting unwanted public records, plus automated cache purges.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Core Privacy Architecture Principles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Only public or user-authorized information is ever analyzed.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Private Gmail messages and private inboxes are <strong>never</strong> accessed.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Private social media posts and friends-only accounts are omitted.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Passwords and credentials are never requested or stored.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>The system never attempts to bypass platform authentication or paywalls.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Photograph analysis requires explicit user consent confirmation.</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Request Removal Guidance or Cache Delisting</h3>
            <p className="text-xs text-slate-300">
              Submit a target public mention or profile item to receive automated instructions on how to remove it from the hosting origin, and immediately delist it from DigitalTrace AI caches.
            </p>

            <form onSubmit={handlePrivacySubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Request Type
                </label>
                <select
                  value={privacyType}
                  onChange={(e) => setPrivacyType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Removal Guidance">Removal Guidance from Origin Platform</option>
                  <option value="Search Engine Delisting">Search Engine Delisting Assistance</option>
                  <option value="Cache Purge">Instant Cache Purge from DigitalTrace AI</option>
                  <option value="Verification Audit">Data Provenance Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Information / URL
                </label>
                <input
                  type="text"
                  value={privacyItem}
                  onChange={(e) => setPrivacyItem(e.target.value)}
                  placeholder="e.g. University Directory listing or Facebook profile"
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Email <span className="text-slate-500">(for delivery of delisting instructions)</span>
                </label>
                <input
                  type="email"
                  value={privacyEmail}
                  onChange={(e) => setPrivacyEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={privacyLoading}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{privacyLoading ? 'Submitting...' : 'Submit Privacy Request'}</span>
                </button>
              </div>
            </form>

            {privacySubmittedTicket && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Ticket Generated: {privacySubmittedTicket.ticket_id}</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">{privacySubmittedTicket.status_label}</span>
                </div>
                <p className="text-slate-300">{privacySubmittedTicket.message}</p>
                <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                  <span className="font-bold text-white block">Step-by-step guidance:</span>
                  {privacySubmittedTicket.guidance_steps.map((step: string, i: number) => (
                    <p key={i} className="text-slate-300 text-[11px]">{step}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
