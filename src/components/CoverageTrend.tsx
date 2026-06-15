import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Props { history?: any[]; coverage?: number; }

export const CoverageTrend: React.FC<Props> = ({ history, coverage }) => {
  const h = history || [];
  const data = h.map((x: any, i: number) => ({
    idx: i + 1,
    label: (x.repo || 'scan') + ' #' + (i + 1),
    coverage: Number(x.coverage) || 0,
    links: Number(x.links) || 0,
  }));

  const enough = data.length >= 2;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div>
            <div className="card-title">Coverage Trend</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per scan over time</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 750, color: 'var(--success)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{coverage ?? 0}%</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>current</div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 8px', flex: 1, minHeight: 248 }}>
        {!enough ? (
          <div style={{ height: 248, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <TrendingUp size={26} color="var(--text-faint)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{data.length === 1 ? `${data[0].coverage}% at the latest scan` : 'No scan history yet'}</span>
            <span style={{ fontSize: '0.72rem' }}>Trend builds up as you run more scans.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={248}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="covGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="idx" tick={{ fill: '#6B6D85', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6D85', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#14152A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#A6A8C0' }}
                formatter={(v: number) => [`${v}%`, 'Coverage']}
                labelFormatter={(i: number) => data[i - 1]?.label || `Scan ${i}`}
              />
              <Area type="monotone" dataKey="coverage" stroke="#22C55E" strokeWidth={2.5} fill="url(#covGrad)"
                activeDot={{ r: 5, fill: '#fff', stroke: '#22C55E', strokeWidth: 2.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
