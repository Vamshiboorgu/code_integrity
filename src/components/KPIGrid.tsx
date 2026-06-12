import React from 'react';
import {
  BookOpen, CheckCircle2, XCircle, FlaskConical, Skull,
  Code2, ShieldAlert, Zap, Target, TrendingUp, TrendingDown, AlertTriangle,
} from 'lucide-react';
import { mockKPIs } from '../data/mockData';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  description?: string;
  onClick?: () => void;
  delay?: number;
}

const KPICard: React.FC<KPICardProps> = ({
  icon, label, value, trend, accentColor, gradientFrom, gradientTo, description, onClick, delay = 0,
}) => (
  <div
    onClick={onClick}
    className="kpi-card animate-fade-up"
    style={{ animationDelay: `${delay}ms`, cursor: onClick ? 'pointer' : 'default' }}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.borderColor = accentColor + '33';
      el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}22`;
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.borderColor = 'rgba(255,255,255,0.08)';
      el.style.boxShadow = '';
    }}
  >
    {/* Background glow */}
    <div style={{
      position: 'absolute', top: -30, right: -30,
      width: 120, height: 120, borderRadius: '50%',
      background: `radial-gradient(circle, ${accentColor}14 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />

    {/* Icon */}
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      border: `1px solid ${accentColor}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginBottom: 4,
      boxShadow: `0 4px 12px ${accentColor}20`,
    }}>
      <div style={{ color: accentColor }}>{icon}</div>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
      <div>
        <div style={{
          fontSize: '1.625rem', fontWeight: 800, color: 'white',
          letterSpacing: '-0.04em', lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }} className="animate-count-up">
          {value}
        </div>
        <div style={{
          fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)',
          textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4,
        }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{description}</div>
        )}
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          fontSize: '0.7rem', fontWeight: 700,
          color: trend >= 0 ? '#34d399' : '#f87171',
          background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          padding: '0.15rem 0.4rem', borderRadius: 5,
          flexShrink: 0, marginTop: 2,
        }}>
          {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

interface KPIGridProps {
  onTabChange: (tab: string) => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ onTabChange }) => {
  const k = mockKPIs;

  const cards = [
    { icon: <BookOpen size={19} />, label: 'Requirements', value: k.totalRequirements, trend: 8, accentColor: '#3b82f6', gradientFrom: 'rgba(59,130,246,0.15)', gradientTo: 'rgba(59,130,246,0.05)', description: 'Total loaded', tab: 'traceability' },
    { icon: <CheckCircle2 size={19} />, label: 'Implemented', value: k.implementedRequirements, trend: 12, accentColor: '#10b981', gradientFrom: 'rgba(16,185,129,0.15)', gradientTo: 'rgba(16,185,129,0.05)', description: 'Fully implemented', tab: 'traceability' },
    { icon: <AlertTriangle size={19} />, label: 'Partial', value: k.partialRequirements, trend: -2, accentColor: '#f59e0b', gradientFrom: 'rgba(245,158,11,0.15)', gradientTo: 'rgba(245,158,11,0.05)', description: 'In progress', tab: 'drift' },
    { icon: <XCircle size={19} />, label: 'Missing', value: k.missingRequirements, trend: -5, accentColor: '#ef4444', gradientFrom: 'rgba(239,68,68,0.15)', gradientTo: 'rgba(239,68,68,0.05)', description: 'Not implemented', tab: 'drift' },
    { icon: <FlaskConical size={19} />, label: 'Linked Tests', value: k.linkedTests, trend: 7, accentColor: '#8b5cf6', gradientFrom: 'rgba(139,92,246,0.15)', gradientTo: 'rgba(139,92,246,0.05)', description: 'With requirements', tab: 'traceability' },
    { icon: <Skull size={19} />, label: 'Dead Tests', value: k.deadTests, trend: -15, accentColor: '#f97316', gradientFrom: 'rgba(249,115,22,0.15)', gradientTo: 'rgba(249,115,22,0.05)', description: 'Orphaned', tab: 'drift' },
    { icon: <Code2 size={19} />, label: 'Orphan Code', value: k.orphanCode, trend: -3, accentColor: '#eab308', gradientFrom: 'rgba(234,179,8,0.15)', gradientTo: 'rgba(234,179,8,0.05)', description: 'No requirements', tab: 'drift' },
    { icon: <ShieldAlert size={19} />, label: 'Sec Risks', value: k.securityRisks, trend: -20, accentColor: '#ef4444', gradientFrom: 'rgba(239,68,68,0.18)', gradientTo: 'rgba(239,68,68,0.06)', description: 'Vulnerabilities', tab: 'security' },
    { icon: <Zap size={19} />, label: 'Perf Risks', value: k.performanceRisks, trend: -10, accentColor: '#f59e0b', gradientFrom: 'rgba(245,158,11,0.15)', gradientTo: 'rgba(245,158,11,0.05)', description: 'Performance issues', tab: 'performance' },
  ];

  return (
    <div>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={16} color="#818cf8" />
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'white', letterSpacing: '-0.02em' }}>Overview</span>
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 80%)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.875rem' }}>
        {cards.map((card, i) => (
          <KPICard
            key={card.label}
            {...card}
            delay={i * 40}
            onClick={() => onTabChange(card.tab)}
          />
        ))}

        {/* Coverage Card — special */}
        <div className="kpi-card animate-fade-up" style={{
          animationDelay: `${cards.length * 40}ms`,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(99,102,241,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 30px rgba(99,102,241,0.08)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
              <Target size={19} color="#818cf8" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.7rem', fontWeight: 700, color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.4rem', borderRadius: 5 }}>
              <TrendingUp size={10} /> +9%
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a5b4fc', letterSpacing: '-0.04em', lineHeight: 1 }}>{k.traceabilityCoverage}%</div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(165,180,252,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Coverage</div>
          </div>
          <div className="progress-track" style={{ marginTop: 'auto', marginBottom: 4 }}>
            <div className="progress-fill" style={{
              width: `${k.traceabilityCoverage}%`,
              background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
              boxShadow: '0 0 8px rgba(99,102,241,0.5)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
