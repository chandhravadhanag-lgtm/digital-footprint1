import React, { useState } from 'react';
import { Search, MapPin, Building2, User, ShieldCheck, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';

interface SearchPageProps {
  onSearch: (fullName: string, location?: string, organization?: string) => void;
  isLoading: boolean;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSearch, isLoading }) => {
  const [fullName, setFullName] = useState('Sundar Pichai');
  const [location, setLocation] = useState('');
  const [organization, setOrganization] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || isLoading) return;
    onSearch(fullName.trim(), location.trim() || undefined, organization.trim() || undefined);
  };

  const handleQuickSelect = (name: string, loc = '', org = '') => {
    setFullName(name);
    setLocation(loc);
    setOrganization(org);
    onSearch(name, loc || undefined, org || undefined);
  };

  return (
    <div className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>DYNAMIC PUBLIC DISCOVERY • REAL-TIME APIS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Digital Footprint <br />
          <span className="gradient-text">Analyzer</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Enter any person's full name to generate a real-time report using publicly available web knowledge. 
          Fresh search on every query with identity disambiguation and verified source provenance.
        </p>
      </div>

      {/* Core Search Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Full Name <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sundar Pichai or Rahul Kumar"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Optional Distinction Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                Location / Country <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. United States or New York"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                Profession / Organization <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Google or OpenAI"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Optional location and organization help disambiguate between multiple people with the same name.</span>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Scanning Public Knowledge Bases...' : 'Search Digital Footprint'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Quick Example Queries */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Try Quick Examples:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickSelect('Sundar Pichai', 'California', 'Google')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              Sundar Pichai (Google)
            </button>
            <button
              onClick={() => handleQuickSelect('Satya Nadella', 'Washington', 'Microsoft')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              Satya Nadella (Microsoft)
            </button>
            <button
              onClick={() => handleQuickSelect('Rahul Kumar')}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
              title="Demonstrates multiple identity disambiguation"
            >
              Rahul Kumar (Multiple Matches Demo)
            </button>
            <button
              onClick={() => handleQuickSelect('Sam Altman', 'San Francisco', 'OpenAI')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              Sam Altman (OpenAI)
            </button>
          </div>
        </div>
      </div>

      {/* Ethical Safeguards Banner */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 text-white font-semibold">
          <AlertCircle className="w-4 h-4 text-emerald-400" />
          <span>Public Information Only & Privacy Guarantee</span>
        </div>
        <p className="leading-relaxed">
          This system exclusively queries legitimate public APIs (Wikidata, Wikipedia REST, GitHub, and indexed web discovery). 
          It never scrapes private accounts, bypasses authentication, harvests passwords, or exposes private phone numbers. 
          Unverified items are explicitly labeled as <strong className="text-slate-200">"Not found / Not publicly verified"</strong>.
        </p>
      </div>
    </div>
  );
};
