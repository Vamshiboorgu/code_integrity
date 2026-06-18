import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

/**
 * QA test-case verification panel (the QA role's first screen when a test-cases
 * file was uploaded). Shows each uploaded rule judged against the actual code —
 * pass / partial / fail — plus a per-requirement rollup. Data comes from /api/qa.
 */

interface QAData {
  available: boolean;
  summary?: { total: number; passed: number; partial: number; failed: number; unknown: number };
  test_cases?: Array<{
    tc_id: string; rule: string; expected?: string; requirement_key?: string;
    verdict: string; confidence?: number; reason?: string;
    code_name?: string; code_file?: string;
  }>;
  requirements?: Array<{
    key: string; summary?: string; status: string;
    pass: number; partial: number; fail: number; unknown: number; total: number;
  }>;
}

const V = {
  pass: { color: '#22C55E', label: 'Pass', icon: CheckCircle2 },
  partial: { color: '#F59E0B', label: 'Partial', icon: AlertTriangle },
  fail: { color: '#F43F5E', label: 'Fail', icon: XCircle },
  unknown: { color: '#64748B', label: 'Unknown', icon: HelpCircle },
} as const;

const verdictOf = (v: string) => (V as any)[v] || V.unknown;

const Badge: React.FC<{ verdict: string }> = ({ verdict }) => {
  const m = verdictOf(verdict);
  const Icon = m.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px',
      borderRadius: 999, background: `${m.color}1f`, border: `1px solid ${m.color}40`,
      color: m.color, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <Icon size={12} /> {m.label}
    </span>
  );
};

const Stat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="card" style={{ padding: '14px 16px' }}>
    <div style={{ fontSize: '1.6rem', fontWeight: 750, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
  </div>
);

const statusColor = (s: string) => (s === 'green' ? '#22C55E' : s === 'red' ? '#F43F5E' : '#F59E0B');

const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 18px', fontSize: '0.625rem', fontWeight: 700,
  color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em',
};
const td: React.CSSProperties = { padding: '12px 18px', verticalAlign: 'top' };

export const QATestCases: React.FC<{ data: QAData }> = ({ data }) => {
  const s = data.summary || { total: 0, passed: 0, partial: 0, failed: 0, unknown: 0 };
  const cases = data.test_cases || [];
  const reqs = data.requirements || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.35s ease-out' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Stat label="Total test cases" value={s.total} color="var(--text-primary)" />
        <Stat label="Pass" value={s.passed} color="#22C55E" />
        <Stat label="Partial" value={s.partial} color="#F59E0B" />
        <Stat label="Fail" value={s.failed} color="#F43F5E" />
      </div>

      {/* Per-test-case verdicts */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-hd">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <ShieldCheck size={15} color="#F59E0B" /> Test Case Verification
          </div>
        </div>
        {cases.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No test cases found in the uploaded file.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={th}>ID</th>
                <th style={th}>Rule</th>
                <th style={th}>Requirement</th>
                <th style={th}>Verdict</th>
                <th style={th}>Evidence</th>
              </tr></thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.tc_id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <code style={{ fontSize: '0.74rem', color: 'var(--text-primary)' }}>{c.tc_id}</code>
                    </td>
                    <td style={{ ...td, maxWidth: 360 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{c.rule}</div>
                      {c.expected ? (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                          Expected: {c.expected}
                        </div>
                      ) : null}
                    </td>
                    <td style={td}>
                      {c.requirement_key
                        ? <span className="code-tag code-tag-blue">{c.requirement_key}</span>
                        : <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>—</span>}
                    </td>
                    <td style={td}><Badge verdict={c.verdict} /></td>
                    <td style={{ ...td, maxWidth: 320 }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {c.reason || '—'}
                      </div>
                      {c.code_name ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 3 }}>
                          <code>{c.code_name}</code>{c.code_file ? ` · ${c.code_file}` : ''}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-requirement rollup */}
      {reqs.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-hd"><div className="card-title">QA Status by Requirement</div></div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>Requirement</th>
              <th style={th}>Test cases</th>
              <th style={th}>Status</th>
            </tr></thead>
            <tbody>
              {reqs.map(r => (
                <tr key={r.key} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={td}>
                    <span className="code-tag code-tag-blue" style={{ marginRight: 8 }}>{r.key}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.summary}</span>
                  </td>
                  <td style={{ ...td, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {r.pass}✓ {r.partial}~ {r.fail}✗ <span style={{ color: 'var(--text-faint)' }}>/ {r.total}</span>
                  </td>
                  <td style={td}>
                    <span style={{
                      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                      background: statusColor(r.status), marginRight: 7,
                    }} />
                    <span style={{ fontSize: '0.78rem', color: statusColor(r.status), fontWeight: 600, textTransform: 'capitalize' }}>
                      {r.status === 'green' ? 'All passing' : r.status === 'red' ? 'Failing' : 'Partial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
