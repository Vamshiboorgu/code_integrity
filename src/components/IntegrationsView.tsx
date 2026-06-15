import React from 'react';
import { Plug, Database, Cpu, Bot, GitBranch, CheckCircle2, XCircle } from 'lucide-react';
import { ViewHeader } from './AuditLogsView';

interface Props { metrics?: any; postgresEnabled?: boolean; onConfigureJira?: () => void; }

const Card: React.FC<{
  icon: React.ReactNode; name: string; desc: string; connected: boolean;
  detail?: string; action?: React.ReactNode;
}> = ({ icon, name, desc, connected, detail, action }) => (
  <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>{icon}</div>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.6875rem', fontWeight: 700,
        padding: '4px 9px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em',
        background: connected ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
        color: connected ? 'var(--success)' : 'var(--text-muted)',
        border: `1px solid ${connected ? 'rgba(34,197,94,0.22)' : 'var(--border-default)'}`,
      }}>
        {connected ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
        {connected ? 'Connected' : 'Not configured'}
      </span>
    </div>
    <div>
      <div style={{ fontSize: '0.95rem', fontWeight: 650, color: 'var(--text-primary)' }}>{name}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
    </div>
    {detail && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.03)', padding: '7px 10px', borderRadius: 8, wordBreak: 'break-all' }}>{detail}</div>}
    {action}
  </div>
);

export const IntegrationsView: React.FC<Props> = ({ metrics, postgresEnabled, onConfigureJira }) => {
  const m = metrics || {};
  const embeddingsOn = m.embeddings_backend && m.embeddings_backend !== 'lexical-fallback';
  const llmOn = String(m.llm_active) === 'True';
  const gitConnected = !!(m.repo && m.repo !== '—');

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<Plug size={18} />} title="Integrations" sub="External systems and analysis backends wired into the engine" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <Card
          icon={<Plug size={20} />} name="Jira" connected={false}
          desc="Pull requirements live from Jira Cloud as the source of truth for traceability."
          action={<button onClick={onConfigureJira} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '7px 14px', fontSize: '0.78rem' }}>Configure in scan</button>}
        />
        <Card
          icon={<Database size={20} />} name="PostgreSQL" connected={!!postgresEnabled}
          desc="Durable per-project scan history and the multi-project system of record."
          detail={postgresEnabled ? 'localhost:5432 · codeintegrity' : 'Set DATABASE_URL to enable'}
        />
        <Card
          icon={<Cpu size={20} />} name="Code Embeddings" connected={!!embeddingsOn}
          desc="Semantic similarity between requirements and code via a local transformer model."
          detail={m.embeddings_backend || 'lexical fallback'}
        />
        <Card
          icon={<Bot size={20} />} name="LLM Adjudicator" connected={llmOn}
          desc="Local Qwen model confirms the strongest candidate links (air-gapped, optional)."
          detail={llmOn ? m.llm_model : `${m.llm_model || 'qwen2.5-coder:3b'} · offline`}
        />
        <Card
          icon={<GitBranch size={20} />} name="Git" connected={gitConnected}
          desc="Repositories are cloned and analyzed; per-file churn feeds the risk ranking."
          detail={gitConnected ? `${m.repo}${m.branch ? ' · ' + m.branch : ''}` : 'Run a scan on a repo URL'}
        />
      </div>
    </div>
  );
};
