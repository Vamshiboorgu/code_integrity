import React from 'react';
import { LayoutDashboard, FileText, Network, TestTube2, ShieldAlert, AlertTriangle, FileBarChart, Sparkles, Settings, Plug, ScrollText, Users, GitCompare, ChevronRight, BookOpen } from 'lucide-react';
import { CustomLogo } from './CustomLogo';

const ROLE_META = {
  ba:  { label: 'Business Analyst', short: 'BA',  color: '#007BFF', tint: 'rgba(0, 123, 255,0.18)', text: '#a5f3fc' },
  dev: { label: 'Developer',        short: 'DEV', color: '#3B82F6', tint: 'rgba(59,130,246,0.18)', text: '#93c5fd' },
  qa:  { label: 'QA Engineer',      short: 'QA',  color: '#F59E0B', tint: 'rgba(245,158,11,0.18)', text: '#fcd34d' },
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lastScanTime?: string;
  role?: 'dev' | 'ba' | 'qa';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, lastScanTime }) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'code_map', label: 'Code Map', icon: Network },
    { id: 'tests', label: 'Tests', icon: TestTube2 },
    { id: 'risks', label: 'Risks', icon: ShieldAlert },
    { id: 'issues', label: 'Issues', icon: AlertTriangle },
    { id: 'regressions', label: 'Regressions', icon: GitCompare },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  const systemNav = [
    { id: 'integrations', label: 'Integrations', icon: Plug, disabled: true },
    { id: 'audit_logs', label: 'Audit Logs', icon: ScrollText, disabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, disabled: true },
    { id: 'team', label: 'Team', icon: Users, disabled: true },
    { id: 'docs', label: 'Read Docs', icon: BookOpen },
  ];

  const NavItem = ({ item }: { item: typeof mainNav[0] & { disabled?: boolean } }) => {
    const active = activeTab === item.id;
    return (
      <button
        disabled={item.disabled}
        onClick={() => !item.disabled && onTabChange(item.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          width: '100%', padding: '0.625rem 1rem',
          background: active ? 'linear-gradient(90deg, rgba(79,70,229,0.15) 0%, transparent 100%)' : 'transparent',
          border: 'none', borderLeft: `3px solid ${active ? '#6366f1' : 'transparent'}`,
          color: item.disabled ? 'rgba(255,255,255,0.15)' : active ? '#fff' : 'rgba(255,255,255,0.45)',
          cursor: item.disabled ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all 0.15s',
          fontSize: '0.875rem', fontWeight: active ? 600 : 500,
        }}
        onMouseEnter={e => { if (!active && !item.disabled) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={e => { if (!active && !item.disabled) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
      >
        <item.icon size={18} color={active ? '#818cf8' : 'currentColor'} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.disabled && <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WIP</span>}
      </button>
    );
  };

  return (
    <div style={{
      width: 250, height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100,
      background: 'rgba(10,12,16,0.95)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo Area */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(79,70,229,0.4)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CustomLogo size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>IB Code Trace</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Integrity Engine</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1rem', marginBottom: '0.5rem' }}>Overview</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
          {mainNav.map(item => <NavItem key={item.id} item={item} />)}
        </div>

        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1rem', marginBottom: '0.5rem' }}>System</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {systemNav.map(item => <NavItem key={item.id} item={item} />)}
        </div>
      </div>

      {/* Last Scan status */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Last Scan</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.5)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{lastScanTime || 'Not run yet'}</span>
        </div>
      </div>

    </div>
  );
};
