import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchPage } from './components/SearchPage';
import { CandidateSelector } from './components/CandidateSelector';
import { ReportDashboard } from './components/ReportDashboard';
import { AnalysisModal } from './components/AnalysisModal';
import { Footer } from './components/Footer';
import type { DynamicReport, CandidateMatch } from './types';

export function App() {
  const [view, setView] = useState<'search' | 'disambiguation' | 'report'>('search');
  const [report, setReport] = useState<DynamicReport | null>(null);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [currentQuery, setCurrentQuery] = useState<{ name: string; location?: string; org?: string }>({
    name: 'Sundar Pichai'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTargetName, setAnalysisTargetName] = useState('Sundar Pichai');

  const executeAnalysis = async (
    fullName: string, 
    location?: string, 
    org?: string, 
    candidateId?: string
  ) => {
    setCurrentQuery({ name: fullName, location, org });
    setAnalysisTargetName(fullName);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          location: location || null,
          organization: org || null,
          candidate_id: candidateId || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'disambiguation_needed') {
          setCandidates(data.possible_matches || []);
          setView('disambiguation');
        } else {
          setReport(data);
          setCandidates(data.possible_matches || []);
          setView('report');
        }
      }
    } catch (err) {
      console.error('Analysis request error:', err);
    } finally {
      setIsAnalyzing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCandidate = (candidateId: string) => {
    executeAnalysis(currentQuery.name, currentQuery.location, currentQuery.org, candidateId);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onStartAnalysis={() => {
          setView('search');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={view === 'report' ? 'dashboard' : 'landing'}
        onNavigateLanding={() => setView('search')}
        onNavigateDashboard={() => {
          if (report) setView('report');
          else setView('search');
        }}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {view === 'search' && (
          <SearchPage
            onSearch={(name, loc, org) => executeAnalysis(name, loc, org)}
            isLoading={isAnalyzing}
          />
        )}

        {view === 'disambiguation' && (
          <CandidateSelector
            name={currentQuery.name}
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
            onBackToSearch={() => setView('search')}
            isLoading={isAnalyzing}
          />
        )}

        {view === 'report' && report && (
          <ReportDashboard
            report={report}
            onNewSearch={() => setView('search')}
            onSelectAnotherCandidate={
              candidates.length > 1 ? () => setView('disambiguation') : undefined
            }
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Real-time Analysis Loading Modal */}
      <AnalysisModal
        isOpen={isAnalyzing}
        onComplete={() => {}}
        queryLabel={analysisTargetName}
      />
    </div>
  );
}

export default App;
