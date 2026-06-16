import React from 'react';
import { Settings, Sliders, Cpu, Target, Info } from 'lucide-react';
import { ViewHeader } from './AuditLogsView';

interface Props { metrics?: any; }

const Row: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit' }}>{value}</span>
  </div>
);

const Panel: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="card" style={{ padding: '18px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
      <span style={{ color: 'var(--accent-2)' }}>{icon}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 650, color: 'var(--text-primary)' }}>{title}</span>
    </div>
    {children}
  </div>
);

export const SettingsView: React.FC<Props> = ({ metrics }) => {
  const m = metrics || {};
  const w = m.weights || {};
  const pct = (v: number) => v != null ? (v * 100).toFixed(0) + '%' : '—';

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<Settings size={18} />} title="Engine Settings" sub="Live configuration of the traceability engine (read-only)" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Panel icon={<Sliders size={16} />} title="Signal Fusion Weights">
          <Row label="Semantic similarity" value={pct(w.semantic)} mono />
          <Row label="Lexical overlap" value={pct(w.lexical)} mono />
          <Row label="Coverage bonus" value={w.coverage_bonus != null ? '+' + pct(w.coverage_bonus) : '—'} mono />
          <Row label="LLM adjudication" value={pct(w.llm)} mono />
          <Row label="Candidates per requirement (top-K)" value={m.top_k ?? '—'} mono />
        </Panel>

        <Panel icon={<Target size={16} />} title="Calibration">
          <Row label="Calibrated against ground truth" value={m.calibrated ? 'Yes' : 'No'} />
          <Row label="Link threshold" value={m.threshold != null ? m.threshold.toFixed(2) : '—'} mono />
          <Row label="Precision" value={m.calibrated && m.link_precision != null ? pct(m.link_precision) : 'n/a'} mono />
          <Row label="Recall" value={m.calibrated && m.link_recall != null ? pct(m.link_recall) : 'n/a'} mono />
          <Row label="F1 score" value={m.calibrated && m.link_f1 != null ? m.link_f1.toFixed(3) : 'n/a'} mono />
        </Panel>

        <Panel icon={<Cpu size={16} />} title="Analysis Backends">
          <Row label="Embeddings model" value={(m.embeddings_backend || '—').split('/').pop()} mono />
          <Row label="LLM adjudicator" value={String(m.llm_active) === 'True' ? (m.llm_model || 'on') : 'offline'} mono />
          <Row label="Project" value={m.repo || '—'} mono />
          <Row label="Branch" value={m.branch || '—'} mono />
        </Panel>

        <Panel icon={<Settings size={16} />} title="Graph Inventory">
          <Row label="Requirements" value={m.counts?.requirements ?? '—'} mono />
          <Row label="Code blocks" value={m.counts?.code_blocks ?? '—'} mono />
          <Row label="Tests" value={m.counts?.tests ?? '—'} mono />
          <Row label="Links" value={m.counts?.links ?? '—'} mono />
          <Row label="Risk flags" value={m.counts?.flags ?? '—'} mono />
        </Panel>
      </div>

      <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(0, 123, 255,0.06)', border: '1px solid rgba(0, 123, 255,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 11, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <Info size={17} color="var(--accent-2)" style={{ flexShrink: 0 }} />
        These values reflect the live engine. Fusion weights live in <code style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--code-green)' }}>engine/config.py</code>; the link threshold is recalibrated automatically against ground truth on every scan.
      </div>
    </div>
  );
};
