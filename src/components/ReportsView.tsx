import React from 'react';
import { FileBarChart, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Requirement, SecurityRisk, PerformanceRisk, OrphanCode, DeadTest } from '../data/mockData';
import { ViewHeader } from './AuditLogsView';

interface Props {
  requirements: Requirement[];
  securityRisks: SecurityRisk[];
  performanceRisks: PerformanceRisk[];
  orphanCode: OrphanCode[];
  deadTests: DeadTest[];
  kpis?: any;
  metrics?: any;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function toCSV(reqs: Requirement[]): string {
  const head = ['id', 'name', 'status', 'coverage', 'severity', 'category', 'code_files', 'test_files'];
  const rows = reqs.map(r => [
    r.id, '"' + (r.name || '').replace(/"/g, '""') + '"', r.status, r.coverage, r.severity,
    '"' + (r.category || '') + '"', r.codeFiles.length, r.testFiles.length,
  ].join(','));
  return [head.join(','), ...rows].join('\n');
}

export const ReportsView: React.FC<Props> = ({ requirements, securityRisks, performanceRisks, orphanCode, deadTests, kpis, metrics }) => {
  const stamp = new Date().toISOString().slice(0, 10);

  const exportJSON = () => {
    const report = {
      generated_at: new Date().toISOString(),
      project: metrics?.repo, branch: metrics?.branch,
      summary: kpis, metrics,
      requirements, security_risks: securityRisks, performance_risks: performanceRisks,
      orphan_code: orphanCode, dead_tests: deadTests,
    };
    download(`traceability-report-${stamp}.json`, JSON.stringify(report, null, 2), 'application/json');
  };
  const exportCSV = () => download(`requirements-${stamp}.csv`, toCSV(requirements), 'text/csv');

  const k = kpis || {};
  const stats = [
    { label: 'Requirements', value: k.totalRequirements ?? 0 },
    { label: 'Implemented', value: k.implementedRequirements ?? 0 },
    { label: 'Coverage', value: (k.traceabilityCoverage ?? 0) + '%' },
    { label: 'Linked tests', value: k.linkedTests ?? 0 },
    { label: 'Orphan code', value: k.orphanCode ?? 0 },
    { label: 'Security risks', value: k.securityRisks ?? 0 },
    { label: 'Performance risks', value: k.performanceRisks ?? 0 },
    { label: 'Dead tests', value: k.deadTests ?? 0 },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<FileBarChart size={18} />} title="Reports" sub="Snapshot of the current analysis, ready to share or export" />

      <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Traceability Summary</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {metrics?.repo || 'project'}{metrics?.branch ? ` · ${metrics.branch}` : ''} · generated {new Date().toLocaleString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={exportJSON} className="btn btn-primary" style={{ padding: '9px 14px', fontSize: '0.8rem' }}><FileJson size={15} /> Export JSON</button>
            <button onClick={exportCSV} className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.8rem' }}><FileSpreadsheet size={15} /> Requirements CSV</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <Download size={16} color="var(--accent-2)" />
        Exports contain the live data from the most recent scan — every requirement, link, risk, and drift finding.
      </div>
    </div>
  );
};
