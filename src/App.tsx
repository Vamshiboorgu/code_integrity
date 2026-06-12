import React, { useState, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { InputSection } from './components/InputSection';
import { KPIGrid } from './components/KPIGrid';
import { ChartsSection } from './components/ChartsSection';
import { TraceabilityMatrix } from './components/TraceabilityMatrix';
import { DriftDetectionTab } from './components/DriftDetectionTab';
import { SecurityRisksTab } from './components/SecurityRisksTab';
import { PerformanceRisksTab } from './components/PerformanceRisksTab';
import { RequirementExplorer } from './components/RequirementExplorer';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { Requirement } from './data/mockData';
import { LayoutDashboard, TableProperties, GitMerge, ShieldAlert, Zap, Loader2, CheckCircle2 } from 'lucide-react';

type Tab = 'overview' | 'traceability' | 'drift' | 'security' | 'performance';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
  { key: 'traceability', label: 'Traceability', icon: <TableProperties size={14} /> },
  { key: 'drift', label: 'Drift Detection', icon: <GitMerge size={14} /> },
  { key: 'security', label: 'Security Risks', icon: <ShieldAlert size={14} /> },
  { key: 'performance', label: 'Performance Risks', icon: <Zap size={14} /> },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanStart = useCallback(() => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setScanComplete(false), 3000);
    }, 3500);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #111827 0%, #080c14 100%)',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflowX: 'hidden',
    }}>
      {/* Abstract Background Elements */}
      <div style={{ position: 'fixed', top: -200, left: '20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '40%', right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="noise" style={{ zIndex: 1, position: 'fixed', inset: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopNav onScanStart={handleScanStart} isScanning={isScanning} />

        {/* Scan Notification */}
        <div style={{
          position: 'fixed', top: 72, left: '50%', transform: `translateX(-50%) translateY(${isScanning || scanComplete ? 0 : -100}px)`,
          opacity: isScanning || scanComplete ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 60, display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 1.25rem', borderRadius: 999,
          background: isScanning ? 'rgba(8,12,20,0.8)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${isScanning ? 'rgba(99,102,241,0.4)' : 'rgba(16,185,129,0.4)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: isScanning ? '0 12px 32px rgba(99,102,241,0.2)' : '0 12px 32px rgba(16,185,129,0.2)',
        }}>
          {isScanning ? (
            <>
              <Loader2 size={16} color="#818cf8" className="animate-spin" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.02em' }}>Deep Scanning Repository…</span>
              <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 4, height: 12, borderRadius: 99, background: '#818cf8', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} color="#34d399" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6ee7b7', letterSpacing: '0.02em' }}>Scan Complete — 12 requirements mapped</span>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, transition: 'margin-right 0.35s cubic-bezier(0.4,0,0.2,1)', marginRight: aiPanelOpen ? 340 : 0 }}>
          <main style={{ padding: 'calc(60px + 2rem) 2rem 2rem 2rem', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <InputSection onSubmit={handleScanStart} />
            
            <KPIGrid onTabChange={handleTabChange} />

            {/* Tab Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div className="tab-bar">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                {activeTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ChartsSection />
                    <TraceabilityMatrix onRequirementSelect={setSelectedRequirement} />
                  </div>
                )}
                {activeTab === 'traceability' && <TraceabilityMatrix onRequirementSelect={setSelectedRequirement} />}
                {activeTab === 'drift' && <DriftDetectionTab />}
                {activeTab === 'security' && <SecurityRisksTab />}
                {activeTab === 'performance' && <PerformanceRisksTab />}
              </div>
            </div>

          </main>
        </div>

        <AIInsightsPanel isOpen={aiPanelOpen} onToggle={() => setAiPanelOpen(!aiPanelOpen)} />

        {selectedRequirement && (
          <RequirementExplorer
            requirement={selectedRequirement}
            onClose={() => setSelectedRequirement(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
