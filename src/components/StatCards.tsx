import React from 'react';
import { BookOpen, Target, FlaskConical, Boxes, GitMerge, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardsProps {
  kpis?: any;
  metrics?: any;
  history?: any[];
}

// Lightweight real-data sparkline (no chart lib).
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) {
    return <div style={{ height: 34 }} />;
  }
  const w = 120, h = 34, pad = 3;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = pad + (1 - (v - min) / span) * (h - 2 * pad);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const gid = 'spark' + color.replace(/[^a-z0-9]/gi, '');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface OneCard {
  label: string; value: string; icon: React.ReactNode; color: string;
  series: number[]; trend: number | null;
}

const Card: React.FC<OneCard> = ({ label, value, icon, color, series, trend }) => (
  <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: `${color}1f`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>{icon}</div>
      {trend !== null && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6875rem', fontWeight: 700,
          padding: '3px 7px', borderRadius: 8,
          color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
          background: trend >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.12)',
        }}>
          {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
    </div>
    <Sparkline data={series} color={color} />
  </div>
);

export const StatCards: React.FC<StatCardsProps> = ({ kpis, metrics, history }) => {
  const k = kpis || {};
  const h = history || [];
  const counts = metrics?.counts || {};

  const series = (key: string) => h.map((x: any) => Number(x[key]) || 0);
  const trend = (key: string): number | null => {
    const s = series(key);
    if (s.length < 2) return null;
    const prev = s[s.length - 2], last = s[s.length - 1];
    if (!prev) return null;
    return ((last - prev) / prev) * 100;
  };

  const cards: OneCard[] = [
    { label: 'Total Requirements', value: String(k.totalRequirements ?? '—'), icon: <BookOpen size={18} />, color: '#7C5CFF', series: series('requirements'), trend: trend('requirements') },
    { label: 'Coverage Rate', value: (k.traceabilityCoverage ?? 0) + '%', icon: <Target size={18} />, color: '#22C55E', series: series('coverage'), trend: trend('coverage') },
    { label: 'Linked Tests', value: String(k.linkedTests ?? '—'), icon: <FlaskConical size={18} />, color: '#06B6D4', series: series('linked'), trend: trend('linked') },
    { label: 'Code Blocks', value: String(counts.code_blocks ?? '—'), icon: <Boxes size={18} />, color: '#3B82F6', series: series('blocks'), trend: trend('blocks') },
    { label: 'Active Links', value: String(counts.links ?? '—'), icon: <GitMerge size={18} />, color: '#F59E0B', series: series('links'), trend: trend('links') },
  ];

  return (
    <div className="dashboard-kpi-grid">
      {cards.map(c => <Card key={c.label} {...c} />)}
    </div>
  );
};
