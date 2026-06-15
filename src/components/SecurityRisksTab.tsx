import React, { useState } from 'react';
import { ShieldAlert, ShieldX, Shield, ExternalLink, BarChart2 } from 'lucide-react';
import { SecurityRisk } from '../data/mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.85)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
  },
  labelStyle: { color: 'white', fontWeight: 600 },
  itemStyle: { color: 'rgba(255,255,255,0.65)' },
};

const SEV_CONFIG = {
  high:   { color: 'var(--danger)',   glow: 'rgba(255,59,48,0.15)',  bg: 'rgba(255,59,48,0.08)',  label: 'HIGH',   icon: ShieldX },
  medium: { color: 'var(--warning)',  glow: 'rgba(255,149,0,0.12)',  bg: 'rgba(255,149,0,0.08)',  label: 'MEDIUM', icon: ShieldAlert },
  low:    { color: '#7B9FFF',         glow: 'rgba(79,110,247,0.12)', bg: 'rgba(79,110,247,0.06)', label: 'LOW',    icon: Shield },
};

interface SecurityRisksTabProps {
  securityRisks?: SecurityRisk[];
}

export const SecurityRisksTab: React.FC<SecurityRisksTabProps> = ({ securityRisks }) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const risks = securityRisks || [];

  const counts = {
    high:   risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low:    risks.filter(r => r.severity === 'low').length,
  };

  const filtered = severityFilter === 'all' ? risks : risks.filter(r => r.severity === severityFilter);

  const coveredCount = risks.filter(r => r.testCoverage > 0).length;
  const pieData = [
    { name: 'High',   value: counts.high,   color: 'var(--danger)' },
    { name: 'Medium', value: counts.medium, color: 'var(--warning)' },
    { name: 'Low',    value: counts.low,    color: '#7B9FFF' },
  ];

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Summary row */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px rgba(79,110,247,0.5)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{coveredCount}</strong>
            {' '}of{' '}
            <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{risks.length}</strong>
            {' '}risks have test coverage
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'high', 'medium', 'low'] as const).map(f => (
            <button key={f} onClick={() => setSeverityFilter(f)} style={{
              padding: '0.2rem 0.625rem', borderRadius: 999,
              background: severityFilter === f
                ? (f === 'all' ? 'rgba(255,255,255,0.1)' : SEV_CONFIG[f]?.bg || 'rgba(255,255,255,0.1)')
                : 'transparent',
              border: `1px solid ${severityFilter === f
                ? (f === 'all' ? 'rgba(255,255,255,0.15)' : (SEV_CONFIG[f]?.color || 'rgba(255,255,255,0.15)') + '35')
                : 'transparent'}`,
              color: severityFilter === f
                ? (f === 'all' ? 'var(--text-primary)' : SEV_CONFIG[f]?.color || 'var(--text-primary)')
                : 'var(--text-muted)',
              fontSize: '0.6875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: severity cards + distribution + list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem' }}>

        {/* Left: severity cards + pie */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', width: 180 }}>
          {(['high', 'medium', 'low'] as const).map(sev => {
            const cfg = SEV_CONFIG[sev];
            const Icon = cfg.icon;
            const isActive = severityFilter === sev;
            return (
              <div key={sev} onClick={() => setSeverityFilter(isActive ? 'all' : sev)} style={{
                padding: '0.875rem',
                background: isActive ? cfg.bg : 'var(--bg-surface)',
                border: `1px solid ${isActive ? cfg.color + '35' : 'var(--border-default)'}`,
                borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 24px ${cfg.glow}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Icon size={14} color={cfg.color} />
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cfg.label}
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: cfg.color, lineHeight: 1, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                  {counts[sev]}
                </div>
              </div>
            );
          })}

          {/* Mini pie */}
          <div style={{
            padding: '0.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <BarChart2 size={11} color="var(--text-faint)" />
              <span style={{ fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Distribution
              </span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: risk cards grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 14, overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,59,48,0.35) 40%, transparent 95%)',
            }} />

            {/* Header */}
            <div style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <ShieldAlert size={14} color="var(--danger)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Security Findings
              </span>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700,
                background: 'rgba(255,59,48,0.1)', color: 'var(--danger)',
                border: '1px solid rgba(255,59,48,0.2)',
                padding: '0.1rem 0.45rem', borderRadius: 999,
              }}>
                {filtered.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No data available. Run a scan to view results.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {filtered.map((risk, i) => {
                  const cfg = SEV_CONFIG[risk.severity];
                  const isLast = i === filtered.length - 1;
                  const isOdd = i % 2 === 1;
                  return (
                    <div key={risk.id} style={{
                      padding: '1rem 1.125rem',
                      borderLeft: `3px solid ${cfg.color}`,
                      borderBottom: isLast || (i === filtered.length - 2 && filtered.length % 2 === 0) ? 'none' : '1px solid var(--border-subtle)',
                      borderRight: isOdd ? 'none' : '1px solid var(--border-subtle)',
                      transition: 'background 0.12s',
                      boxShadow: risk.severity === 'high' ? `inset 3px 0 0 0 ${cfg.color}` : 'none',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      {/* Top row: severity + ID + external link */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.5625rem', fontWeight: 800,
                          background: cfg.bg, color: cfg.color,
                          border: `1px solid ${cfg.color}30`,
                          padding: '0.1rem 0.4rem', borderRadius: 999,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          boxShadow: risk.severity === 'high' ? `0 0 8px ${cfg.glow}` : 'none',
                        }}>
                          {risk.severity}
                        </span>
                        <span className="code-tag" style={{ fontSize: '0.5625rem' }}>{risk.id}</span>
                        <div style={{ flex: 1 }} />
                        <ExternalLink size={11} color="var(--text-faint)" />
                      </div>

                      {/* Risk type */}
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>
                        {risk.riskType}
                      </div>

                      {/* File + line */}
                      <div style={{ marginBottom: '0.4rem' }}>
                        <code style={{ fontSize: '0.6875rem', color: cfg.color, opacity: 0.8 }}>
                          {risk.file.split('/').pop()}
                        </code>
                        {risk.line && (
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)', marginLeft: '0.375rem' }}>
                            :{risk.line}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div style={{
                        fontSize: '0.6875rem', color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                        marginBottom: '0.5rem',
                      }}>
                        {risk.description}
                      </div>

                      {/* Footer: linked req + coverage */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {risk.linkedRequirement === 'NONE' ? (
                          <span className="code-tag code-tag-muted" style={{ fontSize: '0.5625rem' }}>UNLINKED</span>
                        ) : (
                          <span className="code-tag code-tag-blue" style={{ fontSize: '0.5625rem' }}>{risk.linkedRequirement}</span>
                        )}
                        <div style={{ flex: 1 }} />
                        <span style={{
                          fontSize: '0.5625rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          padding: '0.1rem 0.4rem', borderRadius: 999,
                          background: risk.testCoverage > 0 ? 'rgba(0,208,132,0.1)' : 'rgba(255,255,255,0.04)',
                          color: risk.testCoverage > 0 ? 'var(--success)' : 'var(--text-faint)',
                          border: `1px solid ${risk.testCoverage > 0 ? 'rgba(0,208,132,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        }}>
                          {risk.testCoverage > 0 ? 'tested' : 'no test'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
