import React, { useState } from 'react';
import { ShieldAlert, ShieldX, Shield, AlertTriangle, ExternalLink, BarChart2 } from 'lucide-react';
import { mockSecurityRisks } from '../data/mockData';
import { getSeverityBadgeClass } from '../lib/utils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0f1824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.85)', boxShadow: '0 16px 32px rgba(0,0,0,0.5)' },
  labelStyle: { color: 'white', fontWeight: 600 },
  itemStyle: { color: 'rgba(255,255,255,0.65)' },
};

export const SecurityRisksTab: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const counts = {
    high: mockSecurityRisks.filter((r) => r.severity === 'high').length,
    medium: mockSecurityRisks.filter((r) => r.severity === 'medium').length,
    low: mockSecurityRisks.filter((r) => r.severity === 'low').length,
  };

  const filtered = severityFilter === 'all' ? mockSecurityRisks : mockSecurityRisks.filter((r) => r.severity === severityFilter);

  const summaryCards = [
    { label: 'High Severity', count: counts.high, icon: ShieldX, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', key: 'high' as const },
    { label: 'Medium Severity', count: counts.medium, icon: ShieldAlert, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', key: 'medium' as const },
    { label: 'Low Severity', count: counts.low, icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', key: 'low' as const },
  ];

  const pieData = [
    { name: 'High', value: counts.high, color: '#ef4444' },
    { name: 'Medium', value: counts.medium, color: '#f59e0b' },
    { name: 'Low', value: counts.low, color: '#3b82f6' },
  ];

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {summaryCards.map(({ label, count, icon: Icon, color, bg, key }, i) => {
          const active = severityFilter === key;
          return (
            <div
              key={key}
              onClick={() => setSeverityFilter(active ? 'all' : key)}
              style={{
                animationDelay: `${i * 40}ms`,
                background: active ? `${color}15` : 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)',
                border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: '1.25rem', cursor: 'pointer',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '1rem',
                boxShadow: active ? `0 0 30px ${color}10` : 'none',
              }}
              className="animate-fade-up"
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: active ? color : 'white', lineHeight: 1.1 }}>{count}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
        <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <BarChart2 size={16} color="#ef4444" />
            <span className="section-title">Risk Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.9} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.9) 0%, rgba(13,17,23,0.95) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <Shield size={16} color="#f59e0b" />
            <span className="section-title">Risk Categories</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {Object.entries(mockSecurityRisks.reduce((acc, r) => { acc[r.riskType] = (acc[r.riskType] || 0) + 1; return acc; }, {} as Record<string, number>))
              .sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                const risk = mockSecurityRisks.find((r) => r.riskType === type);
                const maxCount = Math.max(...mockSecurityRisks.map((_, __, arr) => arr.filter((r) => r.riskType === type).length));
                const barColor = risk?.severity === 'high' ? '#ef4444' : risk?.severity === 'medium' ? '#f59e0b' : '#3b82f6';
                return (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 140, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{type}</div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ background: barColor, width: `${(count / 4) * 100}%` }} />
                    </div>
                    <div style={{ width: 24, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right', fontWeight: 600 }}>{count}</div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 10%, rgba(239,68,68,0.4) 50%, transparent 90%)' }} />
        
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} color="#ef4444" />
          <h3 className="section-title">Security Findings ({filtered.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th><th>Risk Type</th><th>Severity</th><th>Linked Req.</th><th>Test Coverage</th><th>Description</th><th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((risk, i) => (
                <tr key={risk.id} style={{ animationDelay: `${i * 20}ms` }} className="animate-fade-in">
                  <td>
                    <code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{risk.file.split('/').pop()}</code>
                    {risk.line && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Line {risk.line}</div>}
                  </td>
                  <td style={{ fontWeight: 500, color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>{risk.riskType}</td>
                  <td><span className={getSeverityBadgeClass(risk.severity)}>{risk.severity.toUpperCase()}</span></td>
                  <td><span className="code-tag code-tag-blue">{risk.linkedRequirement}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-track" style={{ width: 48 }}>
                        <div className="progress-fill" style={{ background: risk.testCoverage < 20 ? '#ef4444' : '#f59e0b', width: `${risk.testCoverage}%` }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{risk.testCoverage}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', maxWidth: 260 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{risk.description}</span>
                  </td>
                  <td><ExternalLink size={13} color="rgba(255,255,255,0.2)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
