import React from 'react';
import { Code2, FlaskConical, FileWarning, ArrowUpRight } from 'lucide-react';

interface Props { kpis?: any; onTabChange?: (t: string) => void; }

const Highlight: React.FC<{
  icon: React.ReactNode; value: number | string; label: string; sub: string;
  color: string; onClick?: () => void;
}> = ({ icon, value, label, sub, color, onClick }) => (
  <div className="card" onClick={onClick} style={{
    padding: '18px 20px', cursor: onClick ? 'pointer' : 'default',
    position: 'relative', overflow: 'hidden', transition: 'transform 0.15s, border-color 0.15s',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${color}55`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: color }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}1f`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <ArrowUpRight size={16} color="var(--text-faint)" />
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 14, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</div>
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>
  </div>
);

export const DriftHighlights: React.FC<Props> = ({ kpis, onTabChange }) => {
  const k = kpis || {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Highlight icon={<Code2 size={22} />} value={k.orphanCode ?? 0} label="Orphan Code"
        sub="Blocks with no requirement" color="#F43F5E" onClick={() => onTabChange?.('drift')} />
      <Highlight icon={<FlaskConical size={22} />} value={k.deadTests ?? 0} label="Unlinked Tests"
        sub="Tests covering only orphan code" color="#F59E0B" onClick={() => onTabChange?.('drift')} />
      <Highlight icon={<FileWarning size={22} />} value={k.missingRequirements ?? 0} label="Unimplemented Reqs"
        sub="Requirements with no code" color="#007BFF" onClick={() => onTabChange?.('drift')} />
    </div>
  );
};
