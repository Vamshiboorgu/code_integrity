import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronRight, Send, Loader2 } from 'lucide-react';

interface AIInsightsSidebarProps {
  aiInsights: any[];
  overallHealthScore?: number;
  onClose?: () => void;
  askAI?: (question: string) => Promise<{ ok: boolean; answer?: string; error?: string }>;
}

export const AIInsightsSidebar: React.FC<AIInsightsSidebarProps> = ({ aiInsights, overallHealthScore = 0, onClose, askAI }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ text: string; error: boolean } | null>(null);
  const [asking, setAsking] = useState(false);

  const submitAsk = async () => {
    const q = question.trim();
    if (!q || !askAI || asking) return;
    setAsking(true);
    setAnswer(null);
    const res = await askAI(q);
    setAnswer({ text: res.ok ? (res.answer || '') : (res.error || 'No answer.'), error: !res.ok });
    setAsking(false);
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(overallHealthScore);
  const insights = aiInsights || [];
  // Recommendations derived from the real findings (no canned copy).
  const recommendations = insights
    .filter((x: any) => x.type === 'critical' || x.type === 'warning')
    .slice(0, 4)
    .map((x: any) => ({ title: x.title }));

  return (
    <div style={{
      width: 320, height: '100vh', position: 'fixed', top: 0, right: 0, zIndex: 90,
      background: 'rgba(10,12,16,0.95)', backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="#818cf8" />
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>AI Insights</span>
          <span style={{ marginLeft: 8, fontSize: '0.625rem', fontWeight: 800, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '0.15rem 0.4rem', borderRadius: 4, letterSpacing: '0.05em' }}>BETA</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        
        {/* Health Score */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Overall Health Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="40" cy="40" r="36" fill="none" stroke={scoreColor} strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * overallHealthScore) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{overallHealthScore}</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: scoreColor, marginBottom: '0.25rem' }}>{overallHealthScore >= 80 ? 'Healthy' : overallHealthScore >= 60 ? 'Needs Attention' : 'Critical'}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                {overallHealthScore >= 80
                  ? 'Strong code integrity with good traceability across the board.'
                  : overallHealthScore >= 60
                  ? 'Traceability is fair — some requirements or tests need attention.'
                  : 'Significant gaps in traceability, coverage, or risk. Review the findings below.'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Key Insights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {insights.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>No insights available yet.</div>
            ) : insights.slice(0, 4).map((insight, idx) => {
              let Icon = Info;
              let color = '#3b82f6';
              if (insight.type === 'critical' || insight.title.toLowerCase().includes('critical')) { Icon = AlertCircle; color = '#ef4444'; }
              else if (insight.type === 'warning' || insight.title.toLowerCase().includes('orphan')) { Icon = AlertTriangle; color = '#f59e0b'; }
              else if (insight.type === 'success' || insight.title.toLowerCase().includes('improve')) { Icon = CheckCircle2; color = '#10b981'; }

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ marginTop: 2 }}><Icon size={14} color={color} /></div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                    {insight.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Recommendations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(recommendations.length ? recommendations : [{ title: 'No action needed — traceability is clean', tab: 'overview' }]).map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <CheckCircle2 size={13} color="rgba(255,255,255,0.3)" />
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{rec.title}</div>
                </div>
                <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
              </div>
            ))}
          </div>
        </div>

        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #7C5CFF 0%, #6D4AF0 100%)', borderRadius: 8, border: '1px solid rgba(124,92,255,0.3)', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,92,255,0.25)' }}>
            <Sparkles size={14} /> Ask AI Assistant
          </button>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ask about this analysis</span>
              <button onClick={() => { setChatOpen(false); setAnswer(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit' }}>Close</button>
            </div>
            {answer && (
              <div style={{ fontSize: '0.76rem', lineHeight: 1.5, color: answer.error ? 'var(--warning)' : 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', marginBottom: 8, maxHeight: 200, overflowY: 'auto' }}>
                {answer.text}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitAsk(); }}
                placeholder="e.g. which requirements are unimplemented?"
                style={{ flex: 1, height: 36, padding: '0 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.76rem', outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={submitAsk} disabled={asking || !question.trim()} style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: asking ? 'default' : 'pointer', flexShrink: 0, opacity: asking || !question.trim() ? 0.5 : 1 }}>
                {asking ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={15} />}
              </button>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-faint)', marginTop: 7 }}>Grounded in your live analysis · runs on the local LLM</div>
          </div>
        )}
      </div>
    </div>
  );
};
