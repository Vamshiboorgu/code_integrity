import React from 'react';
import { ScrollText, GitCommit } from 'lucide-react';

interface Props { history?: any[]; repo?: string; }

export const AuditLogsView: React.FC<Props> = ({ history, repo }) => {
  const rows = [...(history || [])].reverse(); // newest first

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<ScrollText size={18} />} title="Audit Logs" sub="Every analysis run recorded in Postgres, newest first" />

      <div className="card" style={{ overflow: 'hidden' }}>
        {rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No scan runs recorded yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['When', 'Project', 'Coverage', 'Requirements', 'Blocks', 'Links', 'Orphans', 'Flags'].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 || i === 1 ? 'left' : 'right', padding: '11px 18px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '11px 18px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                    {r.ts ? new Date(r.ts).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '11px 18px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                    <GitCommit size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />{repo || r.repo || 'project'}
                  </td>
                  <td style={{ padding: '11px 18px', fontSize: '0.8rem', textAlign: 'right', fontWeight: 600, color: (r.coverage || 0) >= 80 ? 'var(--success)' : (r.coverage || 0) >= 50 ? 'var(--warning)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>{r.coverage ?? '—'}%</td>
                  {['requirements', 'blocks', 'links', 'orphans', 'flags'].map(k => (
                    <td key={k} style={{ padding: '11px 18px', fontSize: '0.8rem', textAlign: 'right', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{r[k] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const ViewHeader: React.FC<{ icon: React.ReactNode; title: string; sub: string; right?: React.ReactNode }> = ({ icon, title, sub, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(0, 123, 255,0.14)', border: '1px solid rgba(0, 123, 255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-2)' }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{sub}</p>
      </div>
    </div>
    {right}
  </div>
);
