import React, { useState } from 'react';
import { GitBranch, ChevronDown, Search, Bell, Settings, Shield, Zap, Play, Loader2, User, LogOut, HelpCircle } from 'lucide-react';
import { mockRepositories, mockBranches } from '../data/mockData';

interface TopNavProps {
  onScanStart: () => void;
  isScanning: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onScanStart, isScanning }) => {
  const [selectedRepo, setSelectedRepo] = useState('main-api');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggle = (menu: string) => setOpenMenu(openMenu === menu ? null : menu);
  const close = () => setOpenMenu(null);

  const Overlay = () => (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
  );

  const DropdownMenu: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50,
      background: 'linear-gradient(160deg, #0f1824 0%, #0a1220 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
      padding: 4, minWidth: 180,
      ...style,
    }}>
      {children}
    </div>
  );

  const MenuItem: React.FC<{ label: string; active?: boolean; onClick: () => void; icon?: React.ReactNode }> = ({ label, active, onClick, icon }) => (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
      fontSize: '0.8125rem', fontWeight: active ? 600 : 400,
      color: active ? 'white' : 'rgba(255,255,255,0.65)',
      background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
      border: 'none', borderRadius: 8, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      transition: 'all 0.12s',
      fontFamily: 'inherit',
    }}
      onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.background = 'transparent'; }}
    >
      {icon} {label}
    </button>
  );

  return (
    <header style={{
      height: 60,
      display: 'flex', alignItems: 'center',
      padding: '0 1.5rem', gap: '1rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(8,12,20,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
          flexShrink: 0,
        }}>
          <Shield size={17} color="white" strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
            IB Code Integrity
          </span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>
            Traceability Engine
          </span>
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* Repo Selector */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => toggle('repo')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.35rem 0.75rem', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
        }}>
          <span className="status-dot online animate-pulse" />
          <span>{selectedRepo}</span>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </button>
        {openMenu === 'repo' && (
          <>
            <Overlay />
            <DropdownMenu>
              {mockRepositories.map(r => (
                <MenuItem key={r.value} label={r.label} active={selectedRepo === r.value}
                  onClick={() => { setSelectedRepo(r.value); close(); }} />
              ))}
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Branch Selector */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => toggle('branch')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.35rem 0.75rem', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem', fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
        }}>
          <GitBranch size={13} color="rgba(255,255,255,0.4)" />
          <span>{selectedBranch}</span>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </button>
        {openMenu === 'branch' && (
          <>
            <Overlay />
            <DropdownMenu>
              {mockBranches.map(b => (
                <MenuItem key={b.value} label={b.label} active={selectedBranch === b.value}
                  icon={<GitBranch size={11} />}
                  onClick={() => { setSelectedBranch(b.value); close(); }} />
              ))}
            </DropdownMenu>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
        <input
          placeholder="Search requirements, files…"
          className="input"
          style={{ paddingLeft: 30, width: 220, fontSize: '0.8125rem' }}
        />
      </div>

      {/* Actions */}
      <button onClick={onScanStart} disabled={isScanning} className="btn btn-primary" style={{ fontSize: '0.8125rem', gap: '0.4rem' }}>
        {isScanning
          ? <><Loader2 size={13} className="animate-spin" /> Analyzing…</>
          : <><Play size={13} fill="currentColor" /> Run Scan</>}
      </button>


      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => toggle('user')} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
          border: '2px solid rgba(99,102,241,0.3)',
          color: 'white', fontSize: '0.6875rem', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', boxShadow: '0 0 12px rgba(99,102,241,0.3)',
        }}>
          VA
        </button>
        {openMenu === 'user' && (
          <>
            <Overlay />
            <DropdownMenu style={{ left: 'auto', right: 0 }}>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Vamshi Admin</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>vamshi@company.com</div>
              </div>
              <MenuItem label="Profile" icon={<User size={13} />} onClick={close} />
              <MenuItem label="Settings" icon={<Settings size={13} />} onClick={close} />
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <MenuItem label="Sign out" icon={<LogOut size={13} />} onClick={close} />
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};
