import React, { useEffect, useState } from 'react';
import { Loader2, GitBranch, Clock, AlertTriangle } from 'lucide-react';

export interface ScanStatus {
  state?: string;          // cloning | analyzing | done | error | idle
  message?: string;
  repo?: string;
  stage?: string;          // human label of the phase running now
  step?: number;           // 1..total once analysis starts
  total?: number;          // number of analysis phases
  limit_seconds?: number;  // hard ceiling for the whole scan
}

interface Props {
  active: boolean;
  status: ScanStatus | null;
  startMs: number;         // client clock when this scan began
}

const mmss = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, '0')}`;
};

export const ScanProgress: React.FC<Props> = ({ active, status, startMs }) => {
  // Tick once a second so the elapsed clock advances between status polls.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active || !status) return null;

  const total = status.total || 0;
  const step = status.step || 0;
  const cloning = status.state === 'cloning';
  // Cloning is phase 0; analysis fills step/total. Keep a sliver visible while cloning.
  const pct = total > 0 ? Math.max(4, Math.round((step / total) * 100)) : 6;

  const elapsed = Math.max(0, Math.floor((now - startMs) / 1000));
  const limit = status.limit_seconds || 0;
  const overBudget = limit > 0 && elapsed > limit;

  const stageLabel = status.stage || (cloning ? 'Cloning repository' : 'Analyzing…');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 220,
      background: 'rgba(5,5,12,0.72)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
        borderRadius: 20, padding: 28, boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
        animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Loader2 size={20} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {status.state === 'cloning' ? 'Cloning repository' : 'Analyzing repository'}
          </div>
        </div>
        {status.repo && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
            fontSize: '0.8rem', color: 'var(--text-secondary)',
          }}>
            <GitBranch size={13} /> <span className="mono">{status.repo}</span>
          </div>
        )}

        {/* Current stage */}
        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          {stageLabel}
          {total > 0 && step > 0 && (
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {'  ·  step '}{step} of {total}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div style={{
          height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden', marginBottom: 8,
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: 999,
            background: 'linear-gradient(90deg, var(--accent), #00D4FF)',
            transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>

        {/* Segmented phase ticks */}
        {total > 0 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < step ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.4s ease',
              }} />
            ))}
          </div>
        )}

        {/* Timers */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={15} color={overBudget ? 'var(--danger)' : 'var(--text-secondary)'} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {mmss(elapsed)} elapsed
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {limit > 0 ? <>max <span style={{ fontWeight: 600 }}>{mmss(limit)}</span></> : null}
          </div>
        </div>

        {/* Honest note: we can't promise an exact ETA, but we can scope it. */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14,
          fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          <AlertTriangle size={13} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Time depends on repository size — the <strong>“Linking requirements to code”</strong> step
            (embeddings) is the longest. The scan is cancelled automatically if it passes the max above.
          </span>
        </div>
      </div>
    </div>
  );
};
