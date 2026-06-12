import React from 'react';
import { Zap, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockPerformanceRisks } from '../data/mockData';
import { getSeverityBadgeClass } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0f1824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.85)', boxShadow: '0 16px 32px rgba(0,0,0,0.5)' },
  labelStyle: { color: 'white', fontWeight: 600 },
  itemStyle: { color: 'rgba(255,255,255,0.65)' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

export const PerformanceRisksTab: React.FC = () => {
  const highRisks = mockPerformanceRisks.filter((r) => r.severity === 'high');

  const issueTypeCounts = mockPerformanceRisks.reduce((acc, r) => {
    acc[r.issueType] = (acc[r.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(issueTypeCounts).map(([name, count]) => ({
    name: name.length > 14 ? name.slice(0, 14) + '…' : name,
    fullName: name,
    count,
    color: count > 1 ? '#ef4444' : '#f59e0b',
  }));

  const summaryCards = [
    { label: 'High Impact', count: highRisks.length, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { label: 'Medium Impact', count: mockPerformanceRisks.filter((r) => r.severity === 'medium').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Low Impact', count: mockPerformanceRisks.filter((r) => r.severity === 'low').length, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  ];

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {summaryCards.map(({ label, count, color, bg }, i) => (
          <div key={label} style={{
            animationDelay: `${i * 40}ms`,
            background: 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }} className="animate-fade-up">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>{count}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <TrendingUp size={16} color="#fbbf24" />
            <span className="section-title">Issue Type Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value: number, _name: string, props: { payload?: { fullName?: string } }) => [value, props.payload?.fullName ?? _name]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.9} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span className="section-title">Critical Issues Requiring Action</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {highRisks.map((risk) => (
              <div key={risk.id} style={{
                padding: '0.875rem', borderRadius: 12,
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: 6 }}>
                  <code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{risk.fileName.split('/').pop()}</code>
                  <span className={getSeverityBadgeClass('high')} style={{ flexShrink: 0 }}>{risk.issueType}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{risk.impact}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 500 }}>
                  <CheckCircle2 size={12} /> {risk.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.4) 50%, transparent 90%)' }} />
        
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={16} color="#fbbf24" />
          <h3 className="section-title">All Performance Issues ({mockPerformanceRisks.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>File Name</th><th>Issue Type</th><th>Severity</th><th>Impact</th><th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {mockPerformanceRisks.map((risk, i) => (
                <tr key={risk.id} style={{ animationDelay: `${i * 20}ms` }} className="animate-fade-in">
                  <td>
                    <code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{risk.fileName.split('/').pop()}</code>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{risk.fileName.split('/').slice(0, -1).join('/')}/</div>
                  </td>
                  <td style={{ fontWeight: 500, color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>{risk.issueType}</td>
                  <td><span className={getSeverityBadgeClass(risk.severity)}>{risk.severity.toUpperCase()}</span></td>
                  <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{risk.impact}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      <ArrowRight size={13} color="#60a5fa" style={{ marginTop: 1, flexShrink: 0 }} />
                      {risk.recommendation}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
