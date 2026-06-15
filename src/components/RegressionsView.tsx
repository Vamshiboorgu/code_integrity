import React from 'react';
import { GitCompare, AlertTriangle, ShieldCheck, FlagTriangleRight, CheckCircle2, FileWarning, FlaskConical, Code2, ShieldAlert } from 'lucide-react';
import { Requirement } from '../data/mockData';
import { ViewHeader } from './AuditLogsView';

interface Props {
  data: any;                 // /api/regressions response
  requirements: Requirement[];
  onSetBaseline: () => void;
  onScan: () => void;
}

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  lost_impl:     { label: 'Lost implementation', icon: <Code2 size={14} />, color: '#F43F5E' },
  coverage_drop: { label: 'Coverage dropped',    icon: <FlaskConical size={14} />, color: '#F43F5E' },
  dead_test:     { label: 'Test went dead',      icon: <FlaskConical size={14} />, color: '#F59E0B' },
  new_orphan:    { label: 'New orphan code',     icon: <FileWarning size={14} />, color: '#F59E0B' },
  new_risk:      { label: 'New risk introduced', icon: <ShieldAlert size={14} />, color: '#F43F5E' },
};

export const RegressionsView: React.FC<Props> = ({ data, requirements, onSetBaseline, onScan }) => {
  const d = data || {};
  const regs: any[] = d.regressions || [];
  const reqName = (key: string) => requirements.find(r => r.id === key)?.name || '';

  const baselineLabel = d.baseline
    ? (d.baseline.cr || new Date(d.baseline.ts).toLocaleString()) + (d.baseline.approved ? ' · approved' : ' · previous scan')
    : '—';
  const currentLabel = d.current ? (d.current.cr || new Date(d.current.ts).toLocaleString()) : '—';

  // group regressions by type, in a stable order
  const order = ['lost_impl', 'coverage_drop', 'dead_test', 'new_orphan', 'new_risk'];
  const groups = order
    .map(t => ({ type: t, items: regs.filter(r => r.type === t) }))
    .filter(g => g.items.length > 0);

  const highCount = regs.filter(r => r.severity === 'high').length;

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader
        icon={<GitCompare size={18} />} title="Regressions" sub="What this CR broke vs the approved baseline"
        right={<button onClick={onSetBaseline} className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.8rem' }}>
          <FlagTriangleRight size={14} /> Approve current as baseline
        </button>}
      />

      {/* Baseline → Current comparison bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Baseline</span>
          <span className="code-tag" style={{ fontSize: '0.78rem' }}>{baselineLabel}</span>
        </div>
        <GitCompare size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current</span>
          <span className="code-tag code-tag-violet" style={{ fontSize: '0.78rem' }}>{currentLabel}</span>
        </div>
        <div style={{ flex: 1 }} />
        {d.available !== false && d.baseline && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', fontWeight: 700,
            color: regs.length ? 'var(--danger)' : 'var(--success)',
          }}>
            {regs.length
              ? <><AlertTriangle size={15} /> {regs.length} regression{regs.length === 1 ? '' : 's'} ({highCount} high)</>
              : <><ShieldCheck size={15} /> No regressions</>}
          </span>
        )}
      </div>

      {/* States */}
      {d.available === false ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Regression tracking needs the Postgres store. (It records a detailed snapshot per scan.)
        </div>
      ) : !d.baseline ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          <GitCompare size={28} color="var(--text-faint)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Nothing to compare yet</div>
          <div style={{ fontSize: '0.8rem' }}>{d.note || 'Run a second scan (ideally tagged with a CR) to detect regressions.'}</div>
          <button onClick={onScan} className="btn btn-primary" style={{ marginTop: 16, padding: '9px 16px' }}>Run a scan</button>
        </div>
      ) : regs.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--success)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--success)', marginBottom: 6 }}>No regressions detected</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Everything the baseline satisfied is still satisfied in the current scan.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map(g => {
            const m = TYPE_META[g.type];
            return (
              <div key={g.type} className="card" style={{ overflow: 'hidden' }}>
                <div className="card-hd">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ color: m.color }}>{m.icon}</span>
                    <span className="card-title">{m.label}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: m.color, background: `${m.color}1a`, border: `1px solid ${m.color}33`, padding: '3px 9px', borderRadius: 999 }}>{g.items.length}</span>
                </div>
                <div>
                  {g.items.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', borderLeft: `3px solid ${m.color}` }}>
                      <code style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.key}</code>
                      {reqName(r.key) && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reqName(r.key)}</span>}
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
