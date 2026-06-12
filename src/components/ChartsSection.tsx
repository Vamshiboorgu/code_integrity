import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, ShieldAlert } from 'lucide-react';
import { mockKPIs, mockTrendData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0a0f18',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}>
        {label && <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {payload.map((entry: any, index: number) => {
            const color = entry.color || entry.payload?.color || 'white';
            return (
              <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '13px' }}>
                  {entry.name}: <span style={{ color: 'white', fontWeight: 700 }}>{entry.value}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const CardHeader: React.FC<{ icon: React.ReactNode; title: string; sub?: string; iconColor: string; iconBg: string }> = ({ icon, title, sub, iconColor, iconBg }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
    <div style={{ width: 32, height: 32, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${iconColor}30` }}>
      <div style={{ color: iconColor }}>{icon}</div>
    </div>
    <div>
      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'white', letterSpacing: '-0.01em' }}>{title}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{sub}</div>}
    </div>
  </div>
);

const ChartCard: React.FC<{ children: React.ReactNode; header: React.ReactNode; delay?: number; span?: number }> = ({ children, header, delay = 0, span = 1 }) => (
  <div className="animate-fade-up" style={{
    animationDelay: `${delay}ms`,
    background: 'linear-gradient(145deg, rgba(17,24,39,0.7) 0%, rgba(13,17,23,0.9) 100%)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    gridColumn: `span ${span}`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)', pointerEvents: 'none' }} />
    {header}
    {children}
  </div>
);

const CustomLegend = (props: { payload?: Array<{ color: string; value: string }> }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 16 }}>
    {(props.payload || []).map((entry) => (
      <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, boxShadow: `0 0 8px ${entry.color}60` }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export const ChartsSection: React.FC = () => {
  const { implementedRequirements, totalRequirements, missingRequirements, partialRequirements } = mockKPIs;

  const coverageData = [
    { name: 'Implemented', value: implementedRequirements, color: '#10b981' },
    { name: 'Partial', value: partialRequirements, color: '#f59e0b' },
    { name: 'Missing', value: missingRequirements, color: '#ef4444' },
  ];

  // Combined Security & Performance for a sleek modern grouped Bar Chart
  const riskComparisonData = [
    { severity: 'High', Security: 4, Performance: 3 },
    { severity: 'Medium', Security: 3, Performance: 3 },
    { severity: 'Low', Security: 1, Performance: 1 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>

      {/* Coverage Donut */}
      <ChartCard delay={0} header={
        <CardHeader icon={<PieIcon size={16} />} title="Coverage Distribution"
          sub="Current implementation status of all requirements" iconColor="#818cf8" iconBg="rgba(99,102,241,0.12)" />
      }>
        <div style={{ position: 'relative', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coverageData} cx="50%" cy="50%"
                innerRadius={75} outerRadius={105}
                paddingAngle={4} dataKey="value" stroke="none"
                cornerRadius={6}
              >
                {coverageData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.9} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend content={<CustomLegend />} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
          {/* Donut Center Text */}
          <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.04em' }}>{totalRequirements}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: 4 }}>Total Req</div>
          </div>
        </div>
      </ChartCard>

      {/* Modern Grouped Bar Chart for Risks */}
      <ChartCard delay={60} header={
        <CardHeader icon={<ShieldAlert size={16} />} title="Risk Analysis"
          sub="Security vs Performance risks by severity level" iconColor="#f87171" iconBg="rgba(239,68,68,0.12)" />
      }>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="severity" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="bottom" />
              <Bar dataKey="Security" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="Performance" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Traceability Trend (Spans full width) */}
      <ChartCard delay={120} header={
        <CardHeader icon={<TrendingUp size={16} />} title="Traceability Trend & Drift"
          sub="Historical requirement coverage over time" iconColor="#34d399" iconBg="rgba(16,185,129,0.12)" />
      }>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Area
                type="monotone"
                dataKey="coverage"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCoverage)"
                activeDot={{ r: 6, fill: '#fff', stroke: '#818cf8', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
