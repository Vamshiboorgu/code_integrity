import React from 'react';
import { FileWarning } from 'lucide-react';
import { OrphanCode } from '../data/mockData';

interface Props { orphanCode?: OrphanCode[]; onTabChange?: (t: string) => void; }

const riskBadge = (r: string) => {
  const c = r === 'high' ? '#F43F5E' : r === 'medium' ? '#F59E0B' : '#3B82F6';
  return (
    <span style={{
      fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      padding: '3px 9px', borderRadius: 999, color: c, background: `${c}1f`, border: `1px solid ${c}33`,
    }}>{r}</span>
  );
};

export const TopUnlinkedFiles: React.FC<Props> = ({ orphanCode, onTabChange }) => {
  const rows = (orphanCode || []).slice(0, 6);
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(244,63,94,0.14)', border: '1px solid rgba(244,63,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileWarning size={16} color="var(--danger)" />
          </div>
          <div className="card-title">Top Unlinked Files</div>
        </div>
        <button onClick={() => onTabChange?.('drift')} style={{ fontSize: '0.75rem', color: 'var(--accent-2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
          View all →
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {rows.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orphan code — everything is linked.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Function', 'File', 'Line', 'Match', 'Risk'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Risk' ? 'right' : 'left', padding: '10px 18px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((o, i) => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '11px 18px' }}>
                    <code style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500 }}>{o.functionName}</code>
                  </td>
                  <td style={{ padding: '11px 18px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.fileName.split('/').pop()}
                  </td>
                  <td style={{ padding: '11px 18px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{o.line}</td>
                  <td style={{ padding: '11px 18px', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{o.confidence}%</td>
                  <td style={{ padding: '11px 18px', textAlign: 'right' }}>{riskBadge(o.risk)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
