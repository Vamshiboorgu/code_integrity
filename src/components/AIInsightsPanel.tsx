import React from 'react';
import { Bot, AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { mockAIInsights } from '../data/mockData';

interface AIInsightsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const insightConfig = {
  critical: { icon: AlertCircle, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  warning: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  info: { icon: Info, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  success: { icon: CheckCircle2, color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
};

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Toggle Tab */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 40, padding: '1.25rem 0.5rem', borderRadius: '12px 0 0 12px',
          border: `1px solid ${isOpen ? 'rgba(165,180,252,0.6)' : 'rgba(255,255,255,0.1)'}`,
          borderRight: 'none',
          background: isOpen ? 'linear-gradient(180deg, #6366f1, #4f46e5)' : 'rgba(17,24,39,0.9)',
          backdropFilter: 'blur(10px)',
          color: isOpen ? 'white' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer', writingMode: 'vertical-rl',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: isOpen ? '-4px 0 20px rgba(99,102,241,0.4)' : '-4px 0 10px rgba(0,0,0,0.2)',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { if (!isOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(31,41,55,0.9)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'; } }}
        onMouseLeave={e => { if (!isOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(17,24,39,0.9)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; } }}
      >
        <Sparkles size={14} style={{ writingMode: 'horizontal-tb' }} />
        <span>AI Insights</span>
      </button>

      {/* Panel */}
      <div className={`ai-panel ${isOpen ? 'open' : 'closed'}`}>
        {/* Panel Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(160deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>AI Insights</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Powered by Gemini</div>
            </div>
          </div>
          <button onClick={onToggle} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Top Findings */}
          <section>
            <h3 className="section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Top Findings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockAIInsights.slice(0, 3).map((insight) => {
                const { icon: Icon, color, bg, border } = insightConfig[insight.type];
                return (
                  <div key={insight.id} style={{
                    padding: '1rem', borderRadius: 12, border: `1px solid ${border}`,
                    background: bg, cursor: 'pointer', transition: 'all 0.15s',
                  }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${color}15`; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: 6 }}>
                      <Icon size={15} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', lineHeight: 1.3 }}>{insight.title}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, paddingLeft: '1.625rem' }}>{insight.description}</p>
                    <button style={{
                      paddingLeft: '1.625rem', marginTop: 8, fontSize: '0.75rem', color, background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontFamily: 'inherit',
                    }}>
                      {insight.action} <ChevronRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="divider" />

          {/* Recommendations */}
          <section>
            <h3 className="section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { text: 'Implement rate limiting (REQ-004) immediately — missing critical security control', priority: 'critical' },
                { text: 'Fix SQL injection in UserController.ts before next release', priority: 'critical' },
                { text: 'Add test coverage for audit logging (REQ-003 at 45%)', priority: 'high' },
                { text: 'Archive or link 6 orphaned code files to reduce technical debt', priority: 'medium' },
              ].map((rec, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem',
                  borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: rec.priority === 'critical' ? '#ef4444' : rec.priority === 'high' ? '#f59e0b' : '#3b82f6',
                    boxShadow: `0 0 6px ${rec.priority === 'critical' ? '#ef4444' : rec.priority === 'high' ? '#f59e0b' : '#3b82f6'}`,
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{rec.text}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* Coverage Gaps */}
          <section>
            <h3 className="section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Coverage Gaps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { req: 'REQ-004', name: 'Rate Limiting', coverage: 0 },
                { req: 'REQ-008', name: 'Performance Monitoring', coverage: 0 },
                { req: 'REQ-011', name: 'Backup & Recovery', coverage: 0 },
                { req: 'REQ-007', name: 'Data Export Compliance', coverage: 30 },
              ].map((gap) => (
                <div key={gap.req}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="code-tag code-tag-muted">{gap.req}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{gap.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5' }}>{gap.coverage}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ background: '#ef4444', width: `${gap.coverage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} className="animate-pulse" />
            Analysis updated 2 hours ago
          </div>
        </div>
      </div>
    </>
  );
};
