import React, { useState, useRef } from 'react';
import { Search, User, Globe, Image as ImageIcon, Shield, Upload, CheckCircle2, Phone, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeName: (name: string, location?: string) => void;
  onAnalyzeProfile: (url: string) => void;
  onAnalyzePhoto: (file: File | null) => void;
  onOpenPhoneModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeName,
  onAnalyzeProfile,
  onAnalyzePhoto,
  onOpenPhoneModal,
}) => {
  const [activeTab, setActiveTab] = useState<'name' | 'social' | 'photo'>('name');

  // Form states
  const [fullName, setFullName] = useState('Alex Morgan');
  const [location, setLocation] = useState('San Francisco, CA');

  const [socialUrl, setSocialUrl] = useState('https://github.com/alexmorgan-dev');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [photoConsent, setPhotoConsent] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'name') {
      onAnalyzeName(fullName, location);
    } else if (activeTab === 'social') {
      onAnalyzeProfile(socialUrl);
    } else if (activeTab === 'photo') {
      if (!photoConsent) return;
      onAnalyzePhoto(photoFile);
    }
  };

  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
          <Shield className="w-3.5 h-3.5" />
          <span>ACADEMIC NLP & FOOTPRINT EXTRACTION PROTOTYPE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Understand Your <br />
          <span className="gradient-text">Digital Footprint</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
          Analyze public and authorized information from multiple online sources and organize it into one intelligent profile.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-white/10 relative">
          
          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('name')}
              className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'name'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Name</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'social'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Social Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'photo'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo</span>
            </button>
          </div>

          {/* Tab Content Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'name' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20">
                      Sample Default
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Public Location <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA or Austin, TX"
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Public Profile URL <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="e.g. https://github.com/alexmorgan-dev or linkedin.com/in/..."
                    required
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Supported: Instagram, Facebook, LinkedIn, GitHub public profiles.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'photo' && (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-900/50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-500/50 shadow-lg">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
                          Change
                        </div>
                      </div>
                      <p className="text-xs text-slate-300">
                        {photoFile ? photoFile.name : 'Using demo authorized sample photo (Alex Morgan)'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        Drag and drop your photo here, or <span className="text-blue-400 underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-400">Supports PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Mandatory Consent Checkbox */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-950/40 border border-blue-500/30">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={photoConsent}
                    onChange={(e) => setPhotoConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="consent-check" className="text-xs text-slate-200 cursor-pointer select-none">
                    <span className="font-semibold text-white">Required Consent: </span>
                    "I confirm I have permission to analyze this image."
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={activeTab === 'photo' && !photoConsent}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'photo' && !photoConsent
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110 active:scale-[0.99]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Analyze Digital Footprint</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Privacy footer inside card */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-blue-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Public and authorized information only.</span>
            </div>

            {/* Phone Verification Link */}
            <button
              type="button"
              onClick={onOpenPhoneModal}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone number verification (authorized use only)</span>
            </button>
          </div>
        </div>

        {/* Small Notice */}
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-500">
            This academic prototype does not access private accounts or bypass platform privacy controls.
          </p>
        </div>
      </div>
    </section>
  );
};
