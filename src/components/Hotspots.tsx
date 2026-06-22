import React from 'react';
import { Flame } from 'lucide-react';

/**
 * Code Hotspots — churn × complexity. Code that changes often AND is complex is
 * where defects concentrate. Data comes from /api/hotspots (the backend combines
 * per-file git churn with per-block cyclomatic complexity).
 */

interface Props {
  hotspots?: Array<{
    file: string; name?: string; short_name?: string; line?: number;
    complexity: number; churn: number; score: number;
  }>;
}

export const Hotspots: React.FC<Props> = ({ hotspots }) => {
  const items = (hotspots || []).slice(0, 8);

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Flame size={15} color="#F97316" /> Code Hotspots
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>churn × complexity</span>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No hotspots yet — needs git history (churn) to surface risky code.
        </div>
      ) : (
        <div>
          {items.map((h, i) => (
            <div key={i} style={{ padding: '10px 18px', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-all' }}>
                  {h.name || h.short_name}
                </code>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F97316', fontVariantNumeric: 'tabular-nums' }}>
                  {h.score}
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace", margin: '2px 0 6px', wordBreak: 'break-all' }}>
                {h.file}{h.line ? ':' + h.line : ''}
              </div>
              <div className="progress-track" style={{ height: 3 }}>
                <div className="progress-fill" style={{ width: `${h.score}%`, background: '#F97316' }} />
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                <span>churn <strong style={{ color: 'var(--text-secondary)' }}>{h.churn}</strong></span>
                <span>complexity <strong style={{ color: 'var(--text-secondary)' }}>{h.complexity}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
