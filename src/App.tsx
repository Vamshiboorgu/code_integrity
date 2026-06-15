import React, { useState, useCallback, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { TraceabilityMap } from './components/TraceabilityMap';
import { CoverageTrend } from './components/CoverageTrend';
import { DriftHighlights } from './components/DriftHighlights';
import { TopUnlinkedFiles } from './components/TopUnlinkedFiles';
import { RiskDistribution } from './components/RiskDistribution';
import { SignalFusionCard } from './components/SignalFusionCard';
import { TraceabilityMatrix } from './components/TraceabilityMatrix';
import { AIInsightsSidebar } from './components/AIInsightsSidebar';
import { TraceabilityGraph } from './components/TraceabilityGraph';
import { DriftDetectionTab } from './components/DriftDetectionTab';
import { SecurityRisksTab } from './components/SecurityRisksTab';
import { PerformanceRisksTab } from './components/PerformanceRisksTab';
import { RequirementExplorer } from './components/RequirementExplorer';
import { RoleSelection } from './components/RoleSelection';
import { BADashboard } from './components/BADashboard';
import { ScanModal } from './components/ScanModal';
import { ScanProgress } from './components/ScanProgress';
import { LandingPage } from './components/LandingPage';
import { DocsPage } from './components/DocsPage';
import { CodeMapView } from './components/CodeMapView';
import { TestsView } from './components/TestsView';
import { ReportsView } from './components/ReportsView';
import { IntegrationsView } from './components/IntegrationsView';
import { AuditLogsView } from './components/AuditLogsView';
import { SettingsView } from './components/SettingsView';
import { TeamView } from './components/TeamView';
import { RegressionsView } from './components/RegressionsView';
import { Requirement, SecurityRisk, PerformanceRisk, OrphanCode, DeadTest } from './data/mockData';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type Tab = 'overview' | 'traceability' | 'drift' | 'security' | 'performance';

// Hash routing: parse window.location.hash into the app's screen state so the URL
// reflects where you are and the browser Back button works.
type Screen = { landing: boolean; docs: boolean; role: 'dev' | 'ba' | 'qa' | null; view: string };
function parseHash(): Screen {
  const h = (typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '') || '/';
  if (h === '/docs') return { landing: false, docs: true, role: null, view: 'dashboard' };
  if (h === '/start') return { landing: false, docs: false, role: null, view: 'dashboard' };
  if (h.startsWith('/app')) return { landing: false, docs: false, role: 'dev', view: h.split('/')[2] || 'dashboard' };
  return { landing: true, docs: false, role: null, view: 'dashboard' };
}

// Read a File as a base64 data URL (backend strips the prefix and decodes it).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read requirements file.'));
    reader.readAsDataURL(file);
  });
}

function App() {
  const _init = parseHash();
  const [showLanding, setShowLanding] = useState(_init.landing);
  const [showDocs, setShowDocs] = useState(_init.docs);
  const [role, setRole] = useState<'dev' | 'ba' | 'qa' | null>(_init.role);
  const [view, setView] = useState<string>(_init.view);
  const [scanJiraOpen, setScanJiraOpen] = useState(false);
  const [postgresEnabled, setPostgresEnabled] = useState(false);
  const [regressionsData, setRegressionsData] = useState<any>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanStatus, setScanStatus] = useState<any>(null);   // live /api/scan/status
  const [scanStartMs, setScanStartMs] = useState(0);          // client clock at scan start
  const [history, setHistory] = useState<any[]>([]);

  // Live backend states
  const [kpis, setKpis] = useState<any>(null);
  const [backendMetrics, setBackendMetrics] = useState<any>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [securityRisks, setSecurityRisks] = useState<SecurityRisk[]>([]);
  const [performanceRisks, setPerformanceRisks] = useState<PerformanceRisk[]>([]);
  const [orphanCode, setOrphanCode] = useState<OrphanCode[]>([]);
  const [deadTests, setDeadTests] = useState<DeadTest[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  const fetchBackendData = useCallback(async () => {
    try {
      const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';

      const [resMetrics, resMap, resDrift, resRisks] = await Promise.all([
        fetch(`${API_BASE}/api/metrics`).then(r => r.json()),
        fetch(`${API_BASE}/api/map`).then(r => r.json()),
        fetch(`${API_BASE}/api/drift`).then(r => r.json()),
        fetch(`${API_BASE}/api/risks`).then(r => r.json()),
      ]);

      // Store raw metrics for sidebar
      setBackendMetrics(resMetrics);

      // Scan history for the Coverage Trend + KPI sparklines (real data).
      fetch(`${API_BASE}/api/history`).then(r => r.json())
        .then(d => setHistory(d.history || []))
        .catch(() => setHistory([]));

      // Integrations: is the Postgres system-of-record reachable?
      fetch(`${API_BASE}/api/projects`).then(r => r.json())
        .then(d => setPostgresEnabled(!!d.enabled))
        .catch(() => setPostgresEnabled(false));

      // Regression versioning: diff latest scan vs the approved baseline.
      fetch(`${API_BASE}/api/regressions`).then(r => r.json())
        .then(d => setRegressionsData(d))
        .catch(() => setRegressionsData(null));

      const reqList = resMap.requirements || [];
      const traceResults = await Promise.all(
        reqList.map((req: any) =>
          fetch(`${API_BASE}/api/trace?req=${encodeURIComponent(req.key)}`)
            .then(r => r.json())
            .catch(() => ({ requirement: req, blocks: [] }))
        )
      );

      const processedRequirements: Requirement[] = traceResults.map((t: any, index: number) => {
        const apiReq = t.requirement || reqList[index];
        const blocks = t.blocks || [];

        const codeFiles = Array.from(new Set(blocks.map((b: any) => b.file))) as string[];

        const testFilesList: string[] = [];
        blocks.forEach((b: any) => {
          if (b.tests) {
            b.tests.forEach((testName: string) => {
              const parts = testName.split('::');
              testFilesList.push(parts[0]);
            });
          }
        });
        const testFiles = Array.from(new Set(testFilesList));

        const totalBlocks = blocks.length;
        const coveredBlocks = blocks.filter((b: any) => b.tests && b.tests.length > 0).length;
        const coverage = totalBlocks > 0 ? Math.round((coveredBlocks / totalBlocks) * 100) : 0;

        let status: 'complete' | 'partial' | 'missing' = 'missing';
        if (totalBlocks > 0) {
          status = coverage >= 80 ? 'complete' : 'partial';
        }

        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        const p = (apiReq.priority || '').toLowerCase();
        if (p.includes('crit')) severity = 'critical';
        else if (p.includes('high')) severity = 'high';
        else if (p.includes('med')) severity = 'medium';
        else if (p.includes('low')) severity = 'low';

        return {
          id: apiReq.key,
          name: apiReq.summary,
          description: apiReq.description || '',
          codeFiles,
          testFiles,
          status,
          coverage,
          severity,
          category: apiReq.component || apiReq.source || 'General',
          type: (apiReq.type || 'REQ').toUpperCase(),
          source: apiReq.source,
        };
      });

      setRequirements(processedRequirements);

      const flags = resRisks.flags || [];
      const secRisks: SecurityRisk[] = flags
        .filter((f: any) => f.kind === 'security')
        .map((f: any, idx: number) => {
          let severity: 'high' | 'medium' | 'low' = 'medium';
          const sev = (f.severity || '').toLowerCase();
          if (sev.includes('high')) severity = 'high';
          else if (sev.includes('med')) severity = 'medium';
          else if (sev.includes('low')) severity = 'low';

          return {
            id: `SEC-${idx + 1}`,
            file: f.file,
            riskType: f.rule || 'Vulnerability',
            severity,
            linkedRequirement: f.requirement ? f.requirement.key : 'NONE',
            testCoverage: f.test ? 100 : 0,
            description: f.detail,
            line: f.line,
          };
        });
      setSecurityRisks(secRisks);

      const perfRisks: PerformanceRisk[] = flags
        .filter((f: any) => f.kind === 'performance')
        .map((f: any, idx: number) => {
          let severity: 'high' | 'medium' | 'low' = 'medium';
          const sev = (f.severity || '').toLowerCase();
          if (sev.includes('high')) severity = 'high';
          else if (sev.includes('med')) severity = 'medium';
          else if (sev.includes('low')) severity = 'low';

          return {
            id: `PERF-${idx + 1}`,
            fileName: f.file,
            issueType: f.rule || 'Performance Issue',
            severity,
            recommendation: f.detail,
            impact: `Risk Score: ${f.risk_score}`,
          };
        });
      setPerformanceRisks(perfRisks);

      const orphanList: OrphanCode[] = (resDrift.orphan_code || []).map((o: any, idx: number) => {
        let risk: 'high' | 'medium' | 'low' = 'medium';
        if (o.best_confidence < 0.1) risk = 'high';
        else if (o.best_confidence < 0.15) risk = 'medium';
        else risk = 'low';

        return {
          id: `ORP-${idx + 1}`,
          fileName: o.file,
          functionName: o.name,
          line: o.line,
          confidence: Math.round((o.best_confidence || 0) * 100),
          risk,
        };
      });
      setOrphanCode(orphanList);

      const deadTestsList: DeadTest[] = (resDrift.dead_tests || []).map((t: any, idx: number) => ({
        id: `DT-${idx + 1}`,
        testFile: t.name,
        coversOnly: t.covers_only || [],
        status: 'dead' as const,
      }));
      setDeadTests(deadTestsList);

      const totalReqs = processedRequirements.length;
      const implementedReqs = processedRequirements.filter(r => r.status === 'complete').length;
      const partialReqs = processedRequirements.filter(r => r.status === 'partial').length;
      const missingReqs = processedRequirements.filter(r => r.status === 'missing').length;

      const allTests = new Set<string>();
      traceResults.forEach((t: any) => {
        (t.blocks || []).forEach((b: any) => {
          (b.tests || []).forEach((testName: string) => allTests.add(testName));
        });
      });

      const linkedReqs = processedRequirements.filter(r => r.codeFiles.length > 0).length;
      const averageCoverage = totalReqs > 0 ? Math.round((linkedReqs / totalReqs) * 100) : 0;

      const computedKpis = {
        totalRequirements: totalReqs,
        implementedRequirements: implementedReqs,
        partialRequirements: partialReqs,
        missingRequirements: missingReqs,
        linkedTests: allTests.size,
        deadTests: deadTestsList.length,
        orphanCode: orphanList.length,
        securityRisks: secRisks.length,
        performanceRisks: perfRisks.length,
        traceabilityCoverage: averageCoverage,
      };
      setKpis(computedKpis);

      const insights: any[] = [];
      let insightIdx = 1;

      const highestSecRisk = secRisks.find(r => r.severity === 'high');
      if (highestSecRisk) {
        insights.push({
          id: insightIdx++,
          type: 'critical' as const,
          title: 'Critical Security Vulnerability',
          description: `${highestSecRisk.riskType} detected in ${highestSecRisk.file.split('/').pop()} (line ${highestSecRisk.line}). Immediate remediation required.`,
          action: highestSecRisk.linkedRequirement !== 'NONE' ? `View ${highestSecRisk.linkedRequirement}` : 'View Security Tab',
        });
      }

      const unimplReqs = processedRequirements.filter(r => r.status === 'missing');
      if (unimplReqs.length > 0) {
        insights.push({
          id: insightIdx++,
          type: 'warning' as const,
          title: 'Unimplemented Requirements',
          description: `${unimplReqs.length} requirement(s) unimplemented: ${unimplReqs.slice(0, 2).map(r => r.id).join(', ')}.`,
          action: 'View Requirements',
        });
      }

      if (orphanList.length > 0) {
        insights.push({
          id: insightIdx++,
          type: 'info' as const,
          title: 'Orphan Code Detected',
          description: `${orphanList.length} orphan code block(s) found. Largest: ${orphanList[0].fileName.split('/').pop()}.`,
          action: 'View Orphan Code',
        });
      }

      const precisionNote = resMetrics.calibrated && resMetrics.link_precision != null
        ? ` Link precision is ${Math.round(resMetrics.link_precision * 100)}% (calibrated against ground truth).`
        : ' No ground-truth set for this repo, so link precision is not measured.';
      insights.push({
        id: insightIdx++,
        type: 'success' as const,
        title: 'Coverage Status',
        description: `Overall traceability coverage is at ${averageCoverage}%.${precisionNote}`,
        action: 'View Overview',
      });

      const highestPerfRisk = perfRisks.find(r => r.severity === 'high') || perfRisks[0];
      if (highestPerfRisk) {
        insights.push({
          id: insightIdx++,
          type: 'warning' as const,
          title: 'Performance Issue Detected',
          description: `${highestPerfRisk.issueType} in ${highestPerfRisk.fileName.split('/').pop()}. ${highestPerfRisk.recommendation}`,
          action: 'View Performance Tab',
        });
      }

      setAiInsights(insights);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const handleScanStart = useCallback(
    async (repoUrl: string, branch: string, _zipFile: File | null, reqFile: File | null, token = '', jira: any = null, cr = '') => {
      const url = (repoUrl || '').trim();
      if (!/^https?:\/\//.test(url)) {
        setScanError('Enter a valid repository URL (must start with http:// or https://).');
        setScanComplete(true);
        setTimeout(() => { setScanComplete(false); setScanError(''); }, 4000);
        return;
      }

      setIsScanning(true);
      setScanComplete(false);
      setScanError('');
      setScanMessage('Starting…');
      setScanStartMs(Date.now());
      setScanStatus({ state: 'cloning', stage: 'Starting…', step: 0, total: 0 });

      const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';

      try {
        const payload: any = { repo_url: url, branch: (branch || '').trim() };
        if (token && token.trim()) payload.token = token.trim();
        if (jira && jira.url && jira.email && jira.token) payload.jira = jira;
        if (cr && cr.trim()) payload.cr = cr.trim();
        if (reqFile) {
          payload.requirements_b64 = await fileToBase64(reqFile);
          payload.requirements_name = reqFile.name;
        }

        const res = await fetch(`${API_BASE}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const startData = await res.json();
        if (!res.ok || startData.started === false) {
          throw new Error(startData.error || (startData.busy ? 'A scan is already running.' : 'Scan could not start.'));
        }

        const deadline = Date.now() + 20 * 60 * 1000;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          await new Promise(r => setTimeout(r, 1500));
          const status = await fetch(`${API_BASE}/api/scan/status`).then(r => r.json());
          setScanStatus(status);
          if (status.message) setScanMessage(status.message);
          if (status.state === 'done') break;
          if (status.state === 'error') throw new Error(status.message || 'Scan failed on the server.');
          if (Date.now() > deadline) throw new Error('Scan timed out.');
        }

        await fetchBackendData();
        setScanComplete(true);
        setTimeout(() => setScanComplete(false), 3000);
      } catch (err: any) {
        console.error('Scan Error:', err);
        setScanError(err?.message || 'Scan failed.');
        setScanComplete(true);
        setTimeout(() => { setScanComplete(false); setScanError(''); }, 5000);
      } finally {
        setIsScanning(false);
        setScanMessage('');
      }
    },
    [fetchBackendData]
  );

  const handleSidebarScan = useCallback(async () => {
    setIsScanning(true);
    setScanMessage('Refreshing from engine…');
    setScanError('');
    await fetchBackendData();
    setIsScanning(false);
    setScanMessage('');
    setScanComplete(true);
    setTimeout(() => setScanComplete(false), 2000);
  }, [fetchBackendData]);

  // ── Hash routing: URL reflects the screen, Back button works ──────────────
  const navigate = useCallback((hash: string) => {
    if (window.location.hash !== '#' + hash) window.location.hash = hash;
    else window.dispatchEvent(new HashChangeEvent('hashchange')); // same hash → still apply
  }, []);

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, '', '#/');
    const apply = () => {
      const s = parseHash();
      setShowLanding(s.landing);
      setShowDocs(s.docs);
      setView(s.view);
      if (s.role === null) setRole(null);          // '/' or '/start' clears role
      else setRole(r => r || 'dev');               // '/app' keeps role, defaults to dev
    };
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  // Legacy callers (cards) pass app-tab names; map them to sidebar view ids.
  const TAB_TO_VIEW: Record<string, string> = {
    overview: 'dashboard', traceability: 'requirements', drift: 'issues',
    security: 'risks', performance: 'risks',
  };
  const handleTabChange = useCallback((tab: string) => {
    navigate('/app/' + (TAB_TO_VIEW[tab] || tab));
  }, [navigate]);

  // Approve the latest scan as the regression baseline.
  const setBaseline = useCallback(async () => {
    const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';
    try {
      await fetch(`${API_BASE}/api/baseline`, { method: 'POST' });
      const d = await fetch(`${API_BASE}/api/regressions`).then(r => r.json());
      setRegressionsData(d);
    } catch { /* ignore */ }
  }, []);

  // Grounded AI assistant — answers from the live analysis via the local LLM.
  const askAI = useCallback(async (question: string): Promise<{ ok: boolean; answer?: string; error?: string }> => {
    const API_BASE = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';
    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'Could not reach the engine.' };
    }
  }, []);

  const lastScanLabel = history.length
    ? new Date(history[history.length - 1].ts).toLocaleString()
    : undefined;

  // Real overall health score from live metrics (no hardcoded value).
  const healthScore = kpis ? Math.max(0, Math.min(100, Math.round(
    (kpis.traceabilityCoverage || 0) * 0.5 +
    (kpis.totalRequirements ? (kpis.implementedRequirements / kpis.totalRequirements) * 100 : 0) * 0.35 +
    (100 - Math.min(100, ((kpis.securityRisks || 0) + (kpis.performanceRisks || 0)) * 8)) * 0.15
  ))) : 0;

  if (showDocs) {
    return <DocsPage onBack={() => navigate('/')} onLaunch={() => navigate('/app/dashboard')} />;
  }

  if (showLanding) {
    return (
      <LandingPage
        onLaunch={() => navigate('/start')}
        onScan={() => { setScanJiraOpen(false); setScanModalOpen(true); navigate('/app/dashboard'); }}
        onJira={() => { setScanJiraOpen(true); setScanModalOpen(true); navigate('/app/dashboard'); }}
        onDemo={() => navigate('/app/dashboard')}
        onDocs={() => navigate('/docs')}
        onNav={(hash) => navigate(hash)}
      />
    );
  }

  if (!role) {
    return <RoleSelection onSelect={(r) => { setRole(r); navigate('/app/dashboard'); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar - Left */}
      <Sidebar
        activeTab={view}
        onTabChange={(id: string) => {
          if (id === 'ai_insights') setAiPanelOpen(true);
          else navigate('/app/' + id);
        }}
        lastScanTime={lastScanLabel}
      />

      {/* Main Content */}
      <main className="app-main" style={{
        marginRight: aiPanelOpen ? 320 : 0
      }}>
        <TopBar
          isScanning={isScanning}
          scanMessage={scanMessage}
          onRunScan={() => setScanModalOpen(true)}
          onToggleAI={() => setAiPanelOpen(o => !o)}
          role={role}
          repo={backendMetrics?.repo}
          branch={backendMetrics?.branch}
          requirements={requirements}
          onSelectResult={setSelectedRequirement}
          onSwitchRole={(r) => { setRole(r); navigate('/app/dashboard'); }}
        />

        <div style={{ flex: 1, padding: '24px 26px' }}>
          {['dashboard', 'requirements'].includes(view) && requirements.length === 0 && !isScanning && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16,
              padding: '18px 20px', borderRadius: 14,
              background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.28)',
            }}>
              <AlertCircle size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  No requirements connected
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  This scan has no requirements source, so there is nothing to trace code and tests against.
                  Connect Jira or upload a requirements file to enable traceability. Code, tests and risk
                  analysis below still run against the repository.
                </div>
                <button onClick={() => setScanModalOpen(true)} style={{
                  padding: '8px 16px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.82rem', fontWeight: 600, color: '#fff', border: 'none',
                  background: 'var(--accent)',
                }}>
                  Connect Jira or upload requirements
                </button>
              </div>
            </div>
          )}
          {view === 'dashboard' && regressionsData?.regressions?.length > 0 && (
            <button onClick={() => navigate('/app/regressions')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
              padding: '12px 18px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
            }}>
              <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {regressionsData.regressions.length} regression{regressionsData.regressions.length === 1 ? '' : 's'} vs baseline
                {regressionsData.baseline?.cr ? ` ${regressionsData.baseline.cr}` : ''}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>Review →</span>
            </button>
          )}
          {view === 'dashboard' && role === 'ba' && (
            <BADashboard requirements={requirements} kpis={kpis} history={history} securityRisks={securityRisks} performanceRisks={performanceRisks} onSelectReq={setSelectedRequirement} />
          )}

          {view === 'dashboard' && role !== 'ba' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.35s ease-out' }}>
              <StatCards kpis={kpis} metrics={backendMetrics} history={history} />
              <div className="dashboard-grid-2">
                <TraceabilityMap requirements={requirements} onSelect={setSelectedRequirement} />
                <CoverageTrend history={history} coverage={kpis?.traceabilityCoverage} />
              </div>
              <DriftHighlights kpis={kpis} onTabChange={handleTabChange} />
              <div className="dashboard-grid-2">
                <TopUnlinkedFiles orphanCode={orphanCode} onTabChange={handleTabChange} />
                <RiskDistribution securityRisks={securityRisks} performanceRisks={performanceRisks} />
              </div>
              <SignalFusionCard metrics={backendMetrics} />
            </div>
          )}

          {view === 'requirements' && (
            <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
              <TraceabilityMatrix onRequirementSelect={setSelectedRequirement} requirements={requirements} />
              <div style={{ marginTop: '1.5rem' }}>
                <TraceabilityGraph requirements={requirements} />
              </div>
            </div>
          )}

          {view === 'code_map' && (
            <CodeMapView requirements={requirements} orphanCode={orphanCode} metrics={backendMetrics} />
          )}

          {view === 'tests' && (
            <TestsView requirements={requirements} deadTests={deadTests} kpis={kpis} />
          )}

          {view === 'risks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn 0.35s ease-out' }}>
              <SecurityRisksTab securityRisks={securityRisks} />
              <PerformanceRisksTab performanceRisks={performanceRisks} />
            </div>
          )}

          {view === 'issues' && (
            <DriftDetectionTab requirements={requirements} orphanCode={orphanCode} deadTests={deadTests} />
          )}

          {view === 'reports' && (
            <ReportsView requirements={requirements} securityRisks={securityRisks} performanceRisks={performanceRisks} orphanCode={orphanCode} deadTests={deadTests} kpis={kpis} metrics={backendMetrics} />
          )}

          {view === 'integrations' && (
            <IntegrationsView metrics={backendMetrics} postgresEnabled={postgresEnabled} onConfigureJira={() => setScanModalOpen(true)} />
          )}

          {view === 'audit_logs' && (
            <AuditLogsView history={history} repo={backendMetrics?.repo} />
          )}

          {view === 'settings' && (
            <SettingsView metrics={backendMetrics} />
          )}

          {view === 'team' && (
            <TeamView role={role} onSwitchRole={() => navigate('/start')} />
          )}

          {view === 'regressions' && (
            <RegressionsView data={regressionsData} requirements={requirements}
              onSetBaseline={setBaseline} onScan={() => setScanModalOpen(true)} />
          )}
        </div>
      </main>

      {/* AI Insights - Right Sidebar */}
      {aiPanelOpen && (
        <div className="ai-panel-container">
          <AIInsightsSidebar
            aiInsights={aiInsights}
            overallHealthScore={healthScore}
            onClose={() => setAiPanelOpen(false)}
            askAI={askAI}
          />
        </div>
      )}

      {/* Scan modal */}
      <ScanModal open={scanModalOpen} jiraOpen={scanJiraOpen} onClose={() => setScanModalOpen(false)} onSubmit={handleScanStart} />

      {/* Live scan progress: stage, stepped bar, elapsed vs max time */}
      <ScanProgress active={isScanning} status={scanStatus} startMs={scanStartMs} />

      {/* Requirement detail */}
      {selectedRequirement && (
        <RequirementExplorer
          requirement={selectedRequirement}
          onClose={() => setSelectedRequirement(null)}
          securityRisks={securityRisks}
        />
      )}

      {/* Completion / error toast (bottom center) */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%',
        transform: `translateX(-50%) translateY(${scanComplete ? 0 : 30}px)`,
        opacity: scanComplete ? 1 : 0, pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 250, display: 'flex', alignItems: 'center', gap: 9,
        padding: '10px 16px', borderRadius: 12,
        background: 'var(--bg-elevated)',
        border: `1px solid ${scanError ? 'rgba(244,63,94,0.4)' : 'rgba(34,197,94,0.4)'}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)', maxWidth: 'min(90vw, 560px)',
      }}>
        {scanError
          ? <><AlertCircle size={15} color="var(--danger)" /><span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{scanError}</span></>
          : <><CheckCircle2 size={15} color="var(--success)" /><span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Traceability map updated.</span></>}
      </div>
    </div>
  );
}

export default App;
