import React from 'react';
import { Code2, BarChart3, ShieldCheck, Shield } from 'lucide-react';

interface RoleSelectionProps {
  onSelect: (role: 'dev' | 'ba' | 'qa') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0, 123, 255,0.08) 0%, rgba(10,10,20,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -200, width: 800, height: 800, background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(10,10,20,0) 70%)', pointerEvents: 'none' }} />

      <div style={{ zIndex: 10, textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #007BFF 0%, #0055FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 123, 255,0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Shield size={24} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>CodeTrace</h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginTop: 4 }}>Integrity Engine</p>
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Select your workspace
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 400, margin: '0 auto' }}>
          Choose your role to get a customized dashboard tailored to your workflow.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 1rem' }}>
        {[
          { id: 'ba', icon: BarChart3, title: 'Business Analyst', desc: 'Track requirement coverage and analyze business impact.', color: '#10B981' },
          { id: 'dev', icon: Code2, title: 'Developer', desc: 'Traceability graphs, orphan code detection, and risk maps.', color: '#3B82F6' },
          { id: 'qa', icon: ShieldCheck, title: 'QA Engineer', desc: 'Dead test detection and test case traceability matrices.', color: '#F59E0B' }
        ].map(role => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id as any)}
            style={{
              width: 280,
              padding: '2rem 1.5rem',
              borderRadius: 20,
              background: 'rgba(20,21,33,0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = role.color + '50';
              e.currentTarget.style.background = 'rgba(20,21,33,0.8)';
              e.currentTarget.style.boxShadow = `0 16px 40px ${role.color}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.background = 'rgba(20,21,33,0.5)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: `${role.color}15`,
              border: `1px solid ${role.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <role.icon size={28} color={role.color} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
              {role.title}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {role.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
