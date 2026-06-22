import React from 'react';
import { GitPullRequest } from 'lucide-react';

/**
 * Change Risk — a 0-10 defect-risk score for the latest change, from the shape of
 * the diff (size, diffusion, fix-type, hotspot overlap). Data from /api/changerisk
 * (JIT defect-prediction heuristic). Shows "needs history" when the clone is shallow.
 */

interface Props {
  data?: {
    available?: boolean; range?: string; score?: number; level?: string;
    factors?: Record<string, any>;
  };
}

const LEVEL_COLOR: Record<string, string> = { high: '#F43F5E', medium: '#F59E0B', low: '#22C55E' };

export const ChangeRisk: React.FC<Props> = ({ data }) => {
  const d = data || {};

  if (!d.available) {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-hd">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <GitPullRequest size={15} color="#3B82F6" /> Change Risk
          </div>
        </div>
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Needs git history to score the latest change.
        </div>
      </div>
    );
  }

  const color = LEVEL_COLOR[d.level || 'medium'] || '#F59E0B';
  const f = d.factors || {};
  const facts: [string, any][] = [
    ['Files changed', f.files_changed],
    ['Lines', `+${f.lines_added} / -${f.lines_deleted}`],
    ['Directories', f.directories],
    ['Spread (entropy)', f.entropy],
    ['Touches hotspots', f.hotspot_hits],
    ['Bug fix', f.is_fix ? 'yes' : 'no'],
  ];

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <GitPullRequest size={15} color="#3B82F6" /> Change Risk
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace" }}>{d.range}</span>
      </div>
      <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.score}</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>/ 10</div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.level}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-track" style={{ height: 6, marginBottom: 12 }}>
            <div className="progress-fill" style={{ width: `${(d.score || 0) * 10}%`, background: color }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
            {facts.map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
