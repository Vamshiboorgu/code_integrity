import React from 'react';
import { LayoutDashboard, FileText, Network, TestTube2, ShieldAlert, AlertTriangle, FileBarChart, Sparkles, Settings, Plug, ScrollText, Users, GitCompare } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lastScanTime?: string;
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
    { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
  ];

  const systemNav = [
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'audit_logs', label: 'Audit Logs', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'team', label: 'Team', icon: Users },
  ];

  const NavItem = ({ item }: { item: typeof mainNav[0] }) => {
    const active = activeTab === item.id;
    return (
      <button
        onClick={() => onTabChange(item.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          width: '100%', padding: '0.625rem 1rem',
          background: active ? 'linear-gradient(90deg, rgba(79,70,229,0.15) 0%, transparent 100%)' : 'transparent',
          border: 'none', borderLeft: `3px solid ${active ? '#6366f1' : 'transparent'}`,
          color: active ? '#fff' : 'rgba(255,255,255,0.45)',
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
          fontSize: '0.875rem', fontWeight: active ? 600 : 500,
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
      >
        <item.icon size={18} color={active ? '#818cf8' : 'currentColor'} />
        {item.label}
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
          <Network size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>CodeTrace</div>
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

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Last Scan</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>Completed</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{lastScanTime || 'Not run yet'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
