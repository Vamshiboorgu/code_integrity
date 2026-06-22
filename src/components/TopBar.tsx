import React, { useState, useMemo } from 'react';
import { Search, Bell, Loader2, Sparkles, ScanLine, FileText, X, ChevronDown } from 'lucide-react';
import { Requirement } from '../data/mockData';
import { TypeBadge } from './TypeBadge';

interface TopBarProps {
  isScanning: boolean;
  scanMessage?: string;
  onRunScan: () => void;
  role: 'dev' | 'ba' | 'qa';
  repo?: string;
  branch?: string;
  requirements?: Requirement[];
  onSelectResult?: (req: Requirement) => void;
  onSwitchRole?: (role: 'dev' | 'ba' | 'qa') => void;
}

const ROLE_META = {
  ba: { label: 'Business Analyst', short: 'BA', color: '#007BFF', tint: 'rgba(0, 123, 255,0.2)', text: '#a5f3fc' },
  dev: { label: 'Developer', short: 'DEV', color: '#3B82F6', tint: 'rgba(59,130,246,0.2)', text: '#93c5fd' },
  qa: { label: 'QA Engineer', short: 'QA', color: '#F59E0B', tint: 'rgba(245,158,11,0.2)', text: '#fcd34d' },
};

const statusColor = (s: string) => (s === 'complete' ? '#22C55E' : s === 'partial' ? '#F59E0B' : '#F43F5E');

export const TopBar: React.FC<TopBarProps> = ({ isScanning, scanMessage, onRunScan, role, repo, branch, requirements, onSelectResult, onSwitchRole }) => {
  const rm = ROLE_META[role];
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [roleMenu, setRoleMenu] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return (requirements || []).filter(r =>
      r.id.toLowerCase().includes(term) ||
      r.name.toLowerCase().includes(term) ||
      (r.category || '').toLowerCase().includes(term) ||
      r.codeFiles.some(f => f.toLowerCase().includes(term)) ||
      r.testFiles.some(f => f.toLowerCase().includes(term))
    ).slice(0, 8);
  }, [q, requirements]);
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 26px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10,10,20,0.7)',
      backdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Left: Project + Branch context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Project</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{repo || '—'}</span>
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Branch</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{branch || '—'}</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0, padding: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={e => { setFocused(true); e.currentTarget.style.borderColor = 'var(--border-accent)'; }}
            onBlur={e => { setTimeout(() => setFocused(false), 150); e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            placeholder="Search requirements, files, tests…"
            style={{
              width: '100%', height: 36, paddingLeft: 38, paddingRight: 30,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8125rem',
              outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
            }}
          />
          {q && (
            <button onClick={() => setQ('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={14} />
            </button>
          )}

          {/* Results dropdown (real requirements) */}
          {focused && q.trim() && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
              borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', maxHeight: 360, overflowY: 'auto',
            }}>
              {results.length === 0 ? (
                <div style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No matching requirements.</div>
              ) : results.map(r => (
                <button key={r.id}
                  onMouseDown={() => { onSelectResult?.(r); setQ(''); }}
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid var(--border-subtle)', fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <FileText size={14} color="var(--accent-2)" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                      <TypeBadge type={r.type} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--accent-2)', fontFamily: "'JetBrains Mono', monospace", marginRight: 6 }}>{r.id}</span>{r.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{r.codeFiles.length} code · {r.testFiles.length} tests · {r.category}</div>
                  </div>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor(r.status), flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, flexShrink: 0, flex: 1 }}>
        {isScanning && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999,
            background: 'rgba(0, 123, 255,0.1)', border: '1px solid rgba(0, 123, 255,0.25)',
            maxWidth: 240,
          }}>
            <Loader2 size={13} color="var(--accent-2)" style={{ animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {scanMessage || 'Scanning…'}
            </span>
          </div>
        )}

        <button onClick={onRunScan} style={{
          height: 42, padding: '0 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
          Review Another Repo
        </button>


        {/* Role Switcher */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => setRoleMenu(o => !o)} style={{
            height: 42, padding: '0 12px 0 6px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: roleMenu ? 'rgba(255,255,255,0.08)' : `linear-gradient(90deg, ${rm.tint} 0%, rgba(255,255,255,0.02) 100%)`,
            cursor: 'pointer', transition: 'all 0.15s'
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: rm.tint, border: `1px solid ${rm.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.625rem', fontWeight: 800, color: rm.text,
              boxShadow: `0 0 12px ${rm.color}30`,
            }}>{rm.short}</div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 60 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{rm.label}</div>
            </div>
            <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: roleMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </div>

          {roleMenu && (
            <>
              <div onClick={() => setRoleMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50, minWidth: 180,
                background: '#1A1D24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)', padding: 6,
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 10px 4px' }}>Switch workspace</div>
                {(['ba', 'dev', 'qa'] as const).map(r => {
                  const m = ROLE_META[r];
                  const active = r === role;
                  return (
                    <button key={r} onClick={() => { setRoleMenu(false); if (!active) onSwitchRole?.(r); }} style={{
                      display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left',
                      padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      background: active ? m.tint : 'transparent',
                      transition: 'background 0.12s',
                    }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: m.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: m.text }}>{m.short}</div>
                      <span style={{ flex: 1, fontSize: '0.8rem', color: '#fff', fontWeight: active ? 600 : 400 }}>{m.label}</span>
                      {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
