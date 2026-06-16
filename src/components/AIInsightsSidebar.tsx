import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronRight, Send, Loader2, X } from 'lucide-react';

interface AIInsightsSidebarProps {
  aiInsights: any[];
  overallHealthScore?: number;
  isOpen: boolean;
  onToggle: () => void;
  askAI?: (question: string) => Promise<{ ok: boolean; answer?: string; error?: string }>;
}

export const AIInsightsSidebar: React.FC<AIInsightsSidebarProps> = ({ aiInsights, overallHealthScore = 0, isOpen, onToggle, askAI }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; error?: boolean }>>([]);
  const [asking, setAsking] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 140 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Keep button within screen bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setPos(p => ({
        x: Math.min(Math.max(20, p.x), window.innerWidth - 60),
        y: Math.min(Math.max(20, p.y), window.innerHeight - 60)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: pos.x,
      posY: pos.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!e.buttons) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDragging.current = true;
      setPos({
        x: Math.min(Math.max(20, dragStart.current.posX + dx), window.innerWidth - 60),
        y: Math.min(Math.max(20, dragStart.current.posY + dy), window.innerHeight - 60)
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (!isDragging.current) {
      onToggle();
    }
    isDragging.current = false;
  };

  const submitAsk = async () => {
    const q = question.trim();
    if (!q || !askAI || asking) return;
    setAsking(true);
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    const res = await askAI(q);
    setMessages(prev => [...prev, { role: 'ai', text: res.ok ? (res.answer || '') : (res.error || 'No answer.'), error: !res.ok }]);
    setAsking(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(overallHealthScore);
  const insights = aiInsights || [];
  const recommendations = insights
    .filter((x: any) => x.type === 'critical' || x.type === 'warning')
    .slice(0, 4)
    .map((x: any) => ({ title: x.title }));

  const isBottomHalf = pos.y > window.innerHeight / 2;
  const isRightHalf = pos.x > window.innerWidth / 2;

  return (
    <div style={{
      position: 'fixed',
      left: pos.x,
      top: pos.y,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Popover Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          ...(isBottomHalf ? { bottom: '100%', marginBottom: 16 } : { top: '100%', marginTop: 16 }),
          ...(isRightHalf ? { right: 0 } : { left: 0 }),
          width: 420,
          height: 700,
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, rgba(20,22,35,0.97) 0%, rgba(15,18,25,0.98) 100%)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(124,92,255,0.3)',
          borderRadius: 16,
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(124,92,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'default',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onPointerDown={e => e.stopPropagation()} /* Prevent drag when clicking inside popover */
        >
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--accent-2)" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>AI Insights</span>
              <span style={{ marginLeft: 8, fontSize: '0.625rem', fontWeight: 800, background: 'rgba(124,92,255,0.15)', color: 'var(--accent-2)', padding: '0.15rem 0.4rem', borderRadius: 4, letterSpacing: '0.05em' }}>BETA</span>
            </div>
            <button onClick={onToggle} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {/* Health Score */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={scoreColor} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * overallHealthScore) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{overallHealthScore}</span>
                </div>
              </div>
              <div style={{ maxWidth: '85%' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: scoreColor, marginBottom: '0.4rem' }}>{overallHealthScore >= 80 ? 'Healthy System' : overallHealthScore >= 60 ? 'Needs Attention' : 'Critical Risks'}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {overallHealthScore >= 80 ? 'Strong code integrity and good traceability.' : 'Significant gaps in traceability or coverage found.'}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Key Insights</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {insights.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>No insights available yet.</div>
                ) : insights.slice(0, 3).map((insight, idx) => {
                  let Icon = Info;
                  let color = '#3b82f6';
                  if (insight.type === 'critical' || insight.title.toLowerCase().includes('critical')) { Icon = AlertCircle; color = '#ef4444'; }
                  else if (insight.type === 'warning' || insight.title.toLowerCase().includes('orphan')) { Icon = AlertTriangle; color = '#f59e0b'; }
                  else if (insight.type === 'success' || insight.title.toLowerCase().includes('improve')) { Icon = CheckCircle2; color = '#10b981'; }

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <div style={{ marginTop: 2 }}><Icon size={14} color={color} /></div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{insight.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Suggested Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(recommendations.length ? recommendations : [{ title: 'No action needed — traceability is clean' }]).map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{rec.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div> {/* End Scrollable Area */}

          {/* Ask AI Input & Conversation - Fixed at Bottom */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Conversation History */}
            {(messages.length > 0 || asking) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 200, overflowY: 'auto', paddingRight: '0.25rem' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 12,
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                    borderTopLeftRadius: msg.role === 'ai' ? 4 : 12,
                    background: msg.role === 'user' ? 'rgba(124,92,255,0.2)' : (msg.error ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)'),
                    border: `1px solid ${msg.role === 'user' ? 'rgba(124,92,255,0.3)' : (msg.error ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)')}`
                  }}>
                    <div style={{ fontSize: '0.8125rem', color: msg.error ? '#fca5a5' : '#e0e7ff', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {asking && (
                  <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '0.625rem 0.875rem', borderRadius: 12, borderTopLeftRadius: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.8125rem' }}>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitAsk();
                  }
                }}
                placeholder="Ask AI about issues..."
                style={{
                  flex: 1, minHeight: 40, maxHeight: 120, resize: 'none',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '0.5rem 0.75rem',
                  color: '#fff', fontSize: '0.8125rem', fontFamily: 'inherit',
                  outline: 'none', overflowY: 'auto'
                }}
              />
              <button
                onClick={submitAsk}
                disabled={asking || !question.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  background: (asking || !question.trim()) ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
                  border: 'none', color: (asking || !question.trim()) ? 'rgba(255,255,255,0.3)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (asking || !question.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #7C5CFF 0%, #6D4AF0 100%)',
          border: 'none',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          boxShadow: '0 8px 24px rgba(124,92,255,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
          position: 'relative',
          touchAction: 'none' /* Prevents scroll when dragging on mobile */
        }}
        title="Toggle AI Insights"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        {!isOpen && overallHealthScore < 80 && (
          <span style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: '#ef4444', borderRadius: '50%', border: '2px solid #6D4AF0' }} />
        )}
      </button>
    </div>
  );
};
