import React from 'react';
import { Users, BarChart3, Code2, ShieldCheck, Check, Info } from 'lucide-react';
import { ViewHeader } from './AuditLogsView';

interface Props {
  role: 'dev' | 'ba' | 'qa';
  onSwitchRole: () => void;
}

const ROLES = [
  { id: 'ba', label: 'Business Analyst', icon: BarChart3, color: '#007BFF', desc: 'Tracks requirement coverage and business impact.' },
  { id: 'dev', label: 'Developer', icon: Code2, color: '#3B82F6', desc: 'Works traceability graphs, orphan code, and risk maps.' },
  { id: 'qa', label: 'QA Engineer', icon: ShieldCheck, color: '#F59E0B', desc: 'Owns dead-test detection and test traceability.' },
];

export const TeamView: React.FC<Props> = ({ role, onSwitchRole }) => (
  <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
    <ViewHeader
      icon={<Users size={18} />} title="Workspace & Roles"
      sub="Each role gets a dashboard tailored to its workflow"
      right={<button onClick={onSwitchRole} className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: '0.8rem' }}>Switch role</button>}
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {ROLES.map(r => {
        const active = r.id === role;
        const Icon = r.icon;
        return (
          <div key={r.id} className="card" style={{
            padding: '20px', position: 'relative',
            border: active ? `1px solid ${r.color}55` : '1px solid var(--border-default)',
            boxShadow: active ? `0 0 30px ${r.color}18` : undefined,
          }}>
            {active && (
              <span style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', fontWeight: 700, color: r.color, background: `${r.color}1f`, border: `1px solid ${r.color}40`, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Check size={11} /> Current
              </span>
            )}
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}1a`, border: `1px solid ${r.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Icon size={26} color={r.color} />
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>{r.desc}</div>
          </div>
        );
      })}
    </div>

    <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(0, 123, 255,0.06)', border: '1px solid rgba(0, 123, 255,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 11, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
      <Info size={17} color="var(--accent-2)" style={{ flexShrink: 0 }} />
      Roles are presentation workspaces — each gets a tailored dashboard, but they all analyze the same project and data. Switch any time from here or the top bar.
    </div>
  </div>
);
