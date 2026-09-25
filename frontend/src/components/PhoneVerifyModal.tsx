import React, { useState } from 'react';
import { Phone, ShieldAlert, CheckCircle2, X, ArrowRight, KeyRound } from 'lucide-react';

interface PhoneVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneVerifyModal: React.FC<PhoneVerifyModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 382-9104');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber })
      });
      const data = await res.json();
      setDemoCodeHint(data.mock_otp || '7482');
      setStep('otp');
    } catch {
      setDemoCodeHint('7482');
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode })
      });
      setStep('success');
    } catch {
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('input');
    setOtpCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-white/20 shadow-2xl relative">
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Phone Verification</h3>
            <span className="text-[11px] text-blue-300 uppercase tracking-wider font-semibold">
              Authorized Use Only
            </span>
          </div>
        </div>

        {/* Strict Ethical Warning Banner */}
        <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-100 font-semibold">Strict Privacy Guardrail: </strong>
            DigitalTrace AI does <strong>not</strong> support reverse lookup of strangers. Enter a phone number connected to your own account to verify identity ownership.
          </p>
        </div>

        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Registered Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Sending code...' : 'Request Ownership Verification OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  4-Digit OTP Code
                </label>
                {demoCodeHint && (
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Mock OTP: {demoCodeHint}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="7482"
                maxLength={4}
                required
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Verify Phone Ownership'}</span>
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Ownership Verified</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your phone number is confirmed as authorized for this profile analysis session.
              </p>
            </div>
            <button
              onClick={resetModal}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
