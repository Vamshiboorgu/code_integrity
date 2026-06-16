import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface Props { securityRisks?: any[]; performanceRisks?: any[]; }

export const RiskDistribution: React.FC<Props> = ({ securityRisks, performanceRisks }) => {
  const all = [...(securityRisks || []), ...(performanceRisks || [])];
  const high = all.filter(r => r.severity === 'high').length;
  const med = all.filter(r => r.severity === 'medium').length;
  const low = all.filter(r => r.severity === 'low').length;
  const total = all.length;

  const data = [
    { name: 'High', value: high, color: '#F43F5E' },
    { name: 'Medium', value: med, color: '#F59E0B' },
    { name: 'Low', value: low, color: '#3B82F6' },
  ].filter(d => d.value > 0);

  const chartData = data.length ? data : [{ name: 'None', value: 1, color: '#22C55E' }];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(124,92,255,0.14)', border: '1px solid rgba(124,92,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieIcon size={16} color="var(--accent-2)" />
          </div>
          <div className="card-title">Risk Distribution</div>
        </div>
      </div>

      <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={data.length > 1 ? 3 : 0} dataKey="value" stroke="none" cornerRadius={4}>
                {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.85)' }} itemStyle={{ color: 'rgba(255,255,255,0.85)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 750, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{total}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Total</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'High', value: high, color: '#F43F5E' },
            { label: 'Medium', value: med, color: '#F59E0B' },
            { label: 'Low', value: low, color: '#3B82F6' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', flex: 1 }}>{r.label}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 38, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {total ? Math.round((r.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
