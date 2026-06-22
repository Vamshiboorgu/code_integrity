import React from 'react';
import { AlertCircle, Code2, Skull, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react';
import { getSeverityBadgeClass, getTestStatusBadgeClass } from '../lib/utils';

interface DriftDetectionTabProps {
  requirements?: any[];
  orphanCode?: any[];
  deadTests?: any[];
  deadCode?: any[];
  deleteCandidates?: any[];   // untraceable AND uncalled — strongest remove signal
}

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  bg: string;
}> = ({ icon, label, count, color, bg }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${color}18`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        {label}
      </span>
    </div>
    <span style={{
      fontSize: '0.625rem', fontWeight: 800,
      background: count > 0 ? bg : 'rgba(0,208,132,0.1)',
      color: count > 0 ? color : 'var(--success)',
      border: `1px solid ${count > 0 ? color + '30' : 'rgba(0,208,132,0.2)'}`,
      padding: '0.15rem 0.5rem', borderRadius: 999,
      letterSpacing: '0.04em',
    }}>
      {count}
    </span>
  </div>
);

const EmptyState: React.FC = () => (
  <div style={{
    padding: '2rem 1rem', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
  }}>
    <CheckCircle2 size={20} color="var(--success)" />
    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Clean</span>
    <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>No issues detected</span>
  </div>
);

const CardItem: React.FC<{
  leftColor: string;
  children: React.ReactNode;
}> = ({ leftColor, children }) => (
  <div style={{
    borderLeft: `3px solid ${leftColor}`,
    padding: '0.75rem 0.875rem',
    background: 'rgba(255,255,255,0.01)',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background 0.12s',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.01)'; }}
  >
    {children}
  </div>
);

export const DriftDetectionTab: React.FC<DriftDetectionTabProps> = ({ requirements, orphanCode, deadTests, deadCode, deleteCandidates }) => {
  const reqs = requirements || [];
  const orphans = orphanCode || [];
  const dead = deadTests || [];
  const code = deadCode || [];
  const removable = deleteCandidates || [];
  const unimplemented = reqs.filter(r => r.status === 'missing');

  const totalIssues = unimplemented.length + orphans.length + dead.length + code.length;
  const driftScoreColor = totalIssues === 0 ? 'var(--success)' : totalIssues <= 5 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Drift score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        padding: '0.875rem 1.25rem',
        background: 'var(--bg-surface)',
        border: `1px solid ${totalIssues > 5 ? 'rgba(255,59,48,0.15)' : totalIssues > 0 ? 'rgba(255,149,0,0.15)' : 'rgba(0,208,132,0.15)'}`,
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: driftScoreColor,
            boxShadow: `0 0 8px ${driftScoreColor}`,
            animation: totalIssues > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Drift Score
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: driftScoreColor, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {totalIssues}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>total issues</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { label: 'Unimplemented', count: unimplemented.length, color: 'var(--danger)' },
            { label: 'Untraceable Code', count: orphans.length,    color: 'var(--warning)' },
            { label: 'Dead Tests',    count: dead.length,          color: '#FF9500' },
            { label: 'Dead Code',     count: code.length,          color: '#A855F7' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: s.count > 0 ? s.color : 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>
                {s.count}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safe-to-delete: code that is BOTH untraceable AND unreachable (highest-confidence removal) */}
      {removable.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(168,85,247,0.06) 100%)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', borderBottom: '1px solid rgba(239,68,68,0.18)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={15} color="#f87171" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5' }}>Delete Candidates</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                untraced <b>and</b> uncalled — review first (getters/handlers may be framework-called)
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f87171', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.15rem 0.55rem', borderRadius: 999 }}>
              {removable.length}
            </span>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {removable.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', padding: '0.55rem 1.1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-all' }}>{item.name || item.short_name}</code>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all' }}>
                  {item.file}{item.line ? ':' + item.line : ''}
                </span>
                <div style={{ flex: 1 }} />
                <span className="code-tag code-tag-muted">untraced</span>
                <span className="code-tag code-tag-muted">unreachable</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drift findings layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>

        {/* Unimplemented Requirements */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,59,48,0.1)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <SectionHeader
            icon={<AlertCircle size={13} />}
            label="Unimplemented"
            count={unimplemented.length}
            color="var(--danger)"
            bg="rgba(255,59,48,0.1)"
          />
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {unimplemented.length === 0 ? <EmptyState /> : unimplemented.map(req => (
              <CardItem key={req.id} leftColor="var(--danger)">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                      <span className="code-tag code-tag-red">{req.id}</span>
                      <span className={getSeverityBadgeClass(req.severity)}>{req.severity.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', lineHeight: 1.3 }}>
                      {req.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {req.category}
                    </div>
                  </div>
                </div>
              </CardItem>
            ))}
          </div>
        </div>

        {/* Orphan Code */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,149,0,0.1)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <SectionHeader
            icon={<Code2 size={13} />}
            label="Untraceable Code"
            count={orphans.length}
            color="var(--warning)"
            bg="rgba(255,149,0,0.1)"
          />
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {orphans.length === 0 ? <EmptyState /> : orphans.map(item => (
              <CardItem key={item.id} leftColor="var(--warning)">
                <div style={{ marginBottom: '0.35rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-all', lineHeight: 1.3 }}>
                    {item.functionName}
                  </code>
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                  {item.fileName}:{item.line}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)' }}>best match</span>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--warning)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '3px' }}>
                      <div className="progress-fill" style={{ width: `${item.confidence}%`, background: 'var(--warning)' }} />
                    </div>
                  </div>
                  <span className={getSeverityBadgeClass(item.risk)} style={{ flexShrink: 0 }}>
                    {item.risk.toUpperCase()}
                  </span>
                </div>
              </CardItem>
            ))}
          </div>
        </div>

        {/* Dead Tests */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <SectionHeader
            icon={<Skull size={13} />}
            label="Dead Tests"
            count={dead.length}
            color="var(--text-secondary)"
            bg="rgba(255,255,255,0.06)"
          />
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {dead.length === 0 ? <EmptyState /> : dead.map(test => (
              <CardItem key={test.id} leftColor="var(--text-faint)">
                <div style={{ marginBottom: '0.4rem' }}>
                  <code style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {test.testFile}
                  </code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap', marginBottom: test.coversOnly.length > 0 ? '0.4rem' : 0 }}>
                  <span className={getTestStatusBadgeClass(test.status)}>
                    {test.status}
                  </span>
                  <span className="code-tag code-tag-muted">covers only orphan code</span>
                </div>
                {test.coversOnly.length > 0 && (
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, wordBreak: 'break-all' }}>
                    → {test.coversOnly.join(', ')}
                  </div>
                )}
              </CardItem>
            ))}
          </div>
        </div>

        {/* Dead Code (reachability — uncalled by anything) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(168,85,247,0.12)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <SectionHeader
            icon={<Trash2 size={13} />}
            label="Dead Code"
            count={code.length}
            color="#A855F7"
            bg="rgba(168,85,247,0.12)"
          />
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {code.length === 0 ? <EmptyState /> : code.map((item, i) => (
              <CardItem key={i} leftColor="#A855F7">
                <div style={{ marginBottom: '0.35rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-all', lineHeight: 1.3 }}>
                    {item.name || item.short_name}
                  </code>
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                  {item.file}{item.line ? ':' + item.line : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                  <span className="code-tag code-tag-muted">unreachable</span>
                  {item.verdict && item.verdict !== 'unverified' && (
                    <span className="code-tag" style={{
                      color: item.verdict === 'dead' ? '#A855F7' : 'var(--text-muted)',
                      borderColor: item.verdict === 'dead' ? 'rgba(168,85,247,0.3)' : undefined,
                    }}>AI: {item.verdict}</span>
                  )}
                </div>
                {item.reason && (
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-faint)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {item.reason}
                  </div>
                )}
              </CardItem>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
