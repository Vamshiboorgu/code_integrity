import React, { useMemo } from 'react';
import { TestTube2, FlaskConical, Skull, CheckCircle2 } from 'lucide-react';
import { Requirement, DeadTest } from '../data/mockData';
import { ViewHeader } from './AuditLogsView';

interface Props {
  requirements: Requirement[];
  deadTests: DeadTest[];
  kpis?: any;
}

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string }> = ({ icon, label, value, color }) => (
  <div className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}1f`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: 750, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  </div>
);

export const TestsView: React.FC<Props> = ({ requirements, deadTests, kpis }) => {
  // Test file -> requirements it covers (real, from requirement.testFiles).
  const testMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    requirements.forEach(r => r.testFiles.forEach(f => {
      (map[f] = map[f] || new Set()).add(r.id);
    }));
    return Object.entries(map).map(([file, reqs]) => ({ file, reqs: Array.from(reqs) }))
      .sort((a, b) => b.reqs.length - a.reqs.length);
  }, [requirements]);

  const k = kpis || {};
  const tested = requirements.filter(r => r.testFiles.length > 0).length;

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<TestTube2 size={18} />} title="Tests" sub="Test coverage and test-to-requirement linkage" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        <Stat icon={<FlaskConical size={20} />} label="Linked tests" value={k.linkedTests ?? testMap.length} color="#06B6D4" />
        <Stat icon={<CheckCircle2 size={20} />} label="Requirements with tests" value={`${tested}/${requirements.length}`} color="#22C55E" />
        <Stat icon={<Skull size={20} />} label="Dead tests" value={deadTests.length} color="#F43F5E" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-hd"><div className="card-title">Test → Requirement Coverage</div></div>
          {testMap.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No linked tests found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={{ textAlign: 'left', padding: '10px 18px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Test File</th>
                <th style={{ textAlign: 'left', padding: '10px 18px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Covers</th>
              </tr></thead>
              <tbody>
                {testMap.map(({ file, reqs }) => (
                  <tr key={file} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '11px 18px' }}><code style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>{file.split('/').pop()}</code></td>
                    <td style={{ padding: '11px 18px' }}>{reqs.map(id => <span key={id} className="code-tag code-tag-blue" style={{ marginRight: 5 }}>{id}</span>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-hd"><div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Skull size={15} color="var(--danger)" /> Dead Tests</div></div>
          <div style={{ padding: deadTests.length ? 0 : 40 }}>
            {deadTests.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--success)', fontSize: '0.85rem' }}>✓ No dead tests</div>
            ) : deadTests.map(t => (
              <div key={t.id} style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
                <code style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{t.testFile}</code>
                {t.coversOnly.length > 0 && (
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-faint)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>→ covers only orphan: {t.coversOnly.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
