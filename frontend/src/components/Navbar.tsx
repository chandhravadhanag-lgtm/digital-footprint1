import React from 'react';
import { ShieldCheck, Sparkles, UserCheck, Eye } from 'lucide-react';

interface NavbarProps {
  onStartAnalysis: () => void;
  currentView: 'landing' | 'dashboard';
  onNavigateLanding: () => void;
  onNavigateDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartAnalysis,
  currentView,
  onNavigateLanding,
  onNavigateDashboard,
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060911]/80 backdrop-blur-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-purple-950/80 to-blue-950/80 px-4 py-1.5 text-center text-xs font-medium text-blue-200 border-b border-blue-500/20 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" />
        <span className="font-semibold tracking-wider text-white">PUBLIC / AUTHORIZED INFORMATION ONLY</span>
        <span className="text-blue-300/80 hidden sm:inline">— Academic Prototype with Zero Private Scraping</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={onNavigateLanding}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">DigitalTrace</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Consent-Based Analyzer</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button 
              onClick={onNavigateLanding} 
              className={`hover:text-white transition-colors ${currentView === 'landing' ? 'text-blue-400' : ''}`}
            >
              Home
            </button>
            <a href="#how-it-works" onClick={() => { if (currentView !== 'landing') onNavigateLanding(); }} className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" onClick={() => { if (currentView !== 'landing') onNavigateLanding(); }} className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#privacy" onClick={() => { if (currentView !== 'landing') onNavigateLanding(); }} className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#about" onClick={() => { if (currentView !== 'landing') onNavigateLanding(); }} className="hover:text-white transition-colors">
              About
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {currentView === 'landing' ? (
              <button
                onClick={onStartAnalysis}
                className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                Start Analysis
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateLanding}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  New Search
                </button>
                <button
                  onClick={onNavigateDashboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Demo Profile Active</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
