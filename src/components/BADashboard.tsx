import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, CheckCircle2, AlertCircle, XCircle, Clock, ArrowRight, Activity, ArrowUpRight, CheckSquare, Target, Briefcase } from 'lucide-react';
import { Requirement } from '../data/mockData';
import { TYPE_META, TYPE_ORDER } from './TypeBadge';

interface BADashboardProps {
  requirements: Requirement[];
  kpis: any;
  history?: any[];
  securityRisks?: any[];
  performanceRisks?: any[];
  onSelectReq: (req: Requirement) => void;
}

const CAT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];

export const BADashboard: React.FC<BADashboardProps> = ({ requirements, kpis, history, securityRisks, performanceRisks, onSelectReq }) => {
  // Headline counts come from the latest backend snapshot so the KPI cards, the
  // trend chart, and the traceability summary all agree (single source of truth).
  // Falls back to the requirement statuses when no scan history exists yet.
  const latest = history && history.length ? history[history.length - 1] : null;
  const total = (latest?.requirements ?? requirements.length) || 1;
  const impl = latest?.implemented ?? requirements.filter(r => r.status === 'complete').length;
  const partial = latest?.partial ?? requirements.filter(r => r.status === 'partial').length;
  const missing = latest?.missing ?? requirements.filter(r => r.status === 'missing').length;
  const review = 0; // we don't track a separate "under review" state yet

  const formatPct = (val: number) => ((val / total) * 100).toFixed(1) + '%';

  // Real coverage trend from scan history (implemented/partial/missing per scan).
  const trendData = useMemo(() => {
    const h = history || [];
    return h.map((x: any, i: number) => ({
      date: x.ts ? new Date(x.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Scan ${i + 1}`,
      implemented: Number(x.implemented ?? x.linked ?? 0),
      partial: Number(x.partial ?? 0),
      missing: Number(x.missing ?? Math.max(0, (x.requirements || 0) - (x.linked || 0))),
    }));
  }, [history]);
  const hasTrend = trendData.length >= 2;

  // Real distribution by standardized artifact type (REQ/FEAT/STORY/...).
  const donutData = useMemo(() => {
    const counts = requirements.reduce((acc, req) => {
      const t = req.type || 'REQ';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return TYPE_ORDER.filter(t => counts[t]).map((t, i) => ({
      name: TYPE_META[t]?.label || t,
      value: counts[t],
      color: TYPE_META[t]?.color || CAT_COLORS[i % CAT_COLORS.length],
    }));
  }, [requirements]);

  const riskCount = (securityRisks?.length || 0) + (performanceRisks?.length || 0);

  // Top Gaps
  const gaps = useMemo(() => {
    return requirements.filter(r => r.status !== 'complete').sort((a, b) => {
      const s = { critical: 4, high: 3, medium: 2, low: 1 };
      return s[b.severity] - s[a.severity];
    }).slice(0, 5);
  }, [requirements]);

  const StatCard = ({ title, val, pct, icon: Icon, color, bg }: any) => (
    <div className="card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: color }}>{pct} <span style={{ color: 'var(--text-muted)' }}>coverage</span></div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Header Area */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
          <Briefcase size={26} color="#7C5CFF" />
          Business Analyst Workspace <span style={{ fontWeight: 'normal' }}>👋</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track requirement implementation and ensure business objectives are met.</p>
      </div>

      {/* KPIs */}
      <div className="dashboard-kpi-grid">
        <StatCard title="Total Requirements" val={total} pct="100%" icon={FileText} color="#3b82f6" bg="rgba(59,130,246,0.15)" />
        <StatCard title="Implemented" val={impl} pct={formatPct(impl)} icon={CheckCircle2} color="#10b981" bg="rgba(16,185,129,0.15)" />
        <StatCard title="Partially Implemented" val={partial} pct={formatPct(partial)} icon={AlertCircle} color="#f59e0b" bg="rgba(245,158,11,0.15)" />
        <StatCard title="Not Implemented" val={missing} pct={formatPct(missing)} icon={XCircle} color="#ef4444" bg="rgba(239,68,68,0.15)" />
        <StatCard title="Under Review / TBD" val={review} pct="--" icon={Clock} color="#8b5cf6" bg="rgba(139,92,246,0.15)" />
      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'stretch' }}>
        
        {/* Coverage Trend */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-hd">
            <div className="card-title">Requirement Coverage Trend</div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}/> Implemented</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}/> Partially Implemented</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}/> Not Implemented</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '16px 16px 0', minHeight: 260 }}>
            {!hasTrend ? (
              <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
                <Activity size={26} color="var(--text-faint)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {trendData.length === 1 ? `${trendData[0].implemented} implemented at the latest scan` : 'No scan history yet'}
                </span>
                <span style={{ fontSize: '0.72rem' }}>The trend builds up as you run more scans.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="implGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6B6D85', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B6D85', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#14152A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="implemented" stroke="#10b981" strokeWidth={2} fill="url(#implGrad)" />
                  <Area type="monotone" dataKey="partial" stroke="#f59e0b" strokeWidth={2} fill="none" />
                  <Area type="monotone" dataKey="missing" stroke="#ef4444" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-hd">
            <div className="card-title">Coverage By Requirement Type</div>
            <span className="hover-link" style={{ fontSize: '0.75rem' }}>View details</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '1rem' }}>
            <div style={{ width: 180, height: 180, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{total}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</span>
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: 16 }}>
              {donutData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#fff', fontWeight: 500 }}>{d.value}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>({((d.value/total)*100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Tables & Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'stretch' }}>
        
        {/* Gaps Table */}
        <div className="card">
          <div className="card-hd">
            <div className="card-title">Top Requirement Gaps</div>
            <span className="hover-link" style={{ fontSize: '0.75rem' }}>View all gaps <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }}/></span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Requirement</th>
                <th>Business Impact</th>
                <th>Status</th>
                <th>Linked To</th>
              </tr>
            </thead>
            <tbody>
              {gaps.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No gaps found! Everything is implemented.</td></tr>
              ) : gaps.map(req => (
                <tr key={req.id} onClick={() => onSelectReq(req)}>
                  <td style={{ color: 'var(--accent-2)', fontWeight: 500 }}><FileText size={12} style={{ display: 'inline', marginRight: 4 }}/> {req.id}</td>
                  <td style={{ color: '#fff' }}>{req.name}</td>
                  <td>
                    <span className={`badge badge-${req.severity}`}>
                      {req.severity.charAt(0).toUpperCase() + req.severity.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: req.status === 'missing' ? 'var(--danger)' : 'var(--warning)', fontSize: '0.75rem', fontWeight: 500 }}>
                      {req.status === 'missing' ? 'Not Implemented' : 'Partially Implemented'}
                    </span>
                  </td>
                  <td>
                    <span className="code-tag">{req.codeFiles.length} Code</span> <span className="code-tag">{req.testFiles.length} Test</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Traceability Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-hd">
            <div className="card-title">Traceability Summary</div>
            <span className="hover-link" style={{ fontSize: '0.75rem' }}>View RTM Matrix <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }}/></span>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Linked to Code', val: impl + partial, pct: (((impl + partial) / total) * 100).toFixed(1), color: '#10b981', icon: CheckSquare },
                { label: 'Linked to Tests', val: impl, pct: ((impl / total) * 100).toFixed(1), color: '#3b82f6', icon: Activity },
                { label: 'Open Risks', val: riskCount, pct: ((riskCount / total) * 100).toFixed(1), color: '#f59e0b', icon: AlertCircle },
                { label: 'Unimplemented', val: missing, pct: ((missing / total) * 100).toFixed(1), color: '#ef4444', icon: Target },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <row.icon size={16} color={row.color} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 500, width: 30, textAlign: 'right' }}>{row.val}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>{row.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ width: 120, height: 120, position: 'relative', marginLeft: 24 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#7C5CFF" strokeWidth="8" strokeDasharray="314" strokeDashoffset={314 - (314 * kpis?.traceabilityCoverage / 100)} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{kpis?.traceabilityCoverage}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4, lineHeight: 1.2 }}>Overall<br/>Traceability</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
