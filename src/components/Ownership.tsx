import React from 'react';
import { Users } from 'lucide-react';

/**
 * Ownership & Bus Factor — from git blame (/api/ownership). Shows who owns each
 * file and the bus factor (how few people hold the knowledge). Bus factor 1 = a
 * single-point-of-failure: one person understands that code.
 */

interface Props {
  data?: Array<{
    file: string; top_owner: string; ownership: number;
    contributors: number; bus_factor: number; lines: number;
  }>;
}

const th: React.CSSProperties = {
  textAlign: 'left', padding: '9px 14px', fontSize: '0.6rem', fontWeight: 700,
  color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.07em',
};
const td: React.CSSProperties = { padding: '9px 14px', fontSize: '0.74rem' };

export const Ownership: React.FC<Props> = ({ data }) => {
  const items = (data || []).slice(0, 10);
  const bf1 = (data || []).filter(o => o.bus_factor === 1).length;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Users size={15} color="#8B5CF6" /> Ownership &amp; Bus Factor
        </div>
        {bf1 > 0 && (
          <span style={{ fontSize: '0.7rem', color: '#F43F5E', fontWeight: 700 }}>
            {bf1} at bus-factor 1
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          No ownership data — needs git history.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>File</th>
              <th style={th}>Owner</th>
              <th style={th}>Own&nbsp;%</th>
              <th style={th}>Contrib</th>
              <th style={th}>Bus</th>
            </tr></thead>
            <tbody>
              {items.map((o, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={td}>
                    <code style={{ fontSize: '0.72rem', color: 'var(--text-primary)' }} title={o.file}>
                      {o.file.split('/').pop()}
                    </code>
                  </td>
                  <td style={{ ...td, color: 'var(--text-secondary)' }}>{o.top_owner}</td>
                  <td style={td}>{o.ownership}%</td>
                  <td style={{ ...td, textAlign: 'center' }}>{o.contributors}</td>
                  <td style={td}>
                    <span style={{
                      fontWeight: 700,
                      color: o.bus_factor === 1 ? '#F43F5E' : 'var(--text-secondary)',
                    }}>
                      {o.bus_factor}{o.bus_factor === 1 ? ' ⚠' : ''}
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
