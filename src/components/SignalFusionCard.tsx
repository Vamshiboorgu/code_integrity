import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface SignalFusionCardProps {
  metrics?: any;
}

interface SignalRowProps {
  label: string;
  sub: string;
  weight: number;      // real fusion weight, 0..1
  color: string;
  delay: number;
  prefix?: string;
  inactive?: boolean;
  inactiveNote?: string;
}

const SignalRow: React.FC<SignalRowProps> = ({
  label, sub, weight, color, delay, prefix, inactive, inactiveNote,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Bar width is proportional to the real weight (relative to 1.0).
  const widthPct = Math.min(weight * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{
            fontSize: '0.6875rem', fontWeight: 700,
            color: inactive ? 'var(--text-faint)' : 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {label}
          </span>
          <span style={{
            fontSize: '0.625rem', color: 'var(--text-faint)',
            marginLeft: '0.5rem', letterSpacing: '0.01em',
          }}>
            {sub}
          </span>
        </div>
        {inactive ? (
          <span style={{
            fontSize: '0.6rem', fontWeight: 700,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'var(--text-faint)',
            padding: '0.1rem 0.45rem', borderRadius: 999,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {inactiveNote || 'OFF'}
          </span>
        ) : (
          <span style={{
            fontSize: '0.6875rem', fontWeight: 800,
            color, fontFamily: "'JetBrains Mono', monospace",
          }}>
            {prefix}{(weight * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div style={{
        height: '5px', background: 'rgba(255,255,255,0.05)',
        borderRadius: 99, overflow: 'hidden',
      }}>
        {!inactive && (
          <div style={{
            height: '100%', borderRadius: 99, background: color,
            boxShadow: `0 0 8px ${color}55`,
            width: mounted ? `${widthPct}%` : '0%',
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
          }} />
        )}
      </div>
    </div>
  );
};

export const SignalFusionCard: React.FC<SignalFusionCardProps> = ({ metrics }) => {
  const m = metrics || {};
  const w = m.weights || {};

  // Real values, with graceful fallbacks only when the field is genuinely absent.
  const wSemantic = typeof w.semantic === 'number' ? w.semantic : null;
  const wLexical = typeof w.lexical === 'number' ? w.lexical : null;
  const wCoverage = typeof w.coverage_bonus === 'number' ? w.coverage_bonus : null;
  const wLlm = typeof w.llm === 'number' ? w.llm : null;

  const embeddingsBackend: string = m.embeddings_backend || '—';
  const usingRealEmbeddings = embeddingsBackend !== 'lexical-fallback' && embeddingsBackend !== '—';
  const llmActive = String(m.llm_active) === 'True';
  const llmModel: string = m.llm_model || 'ollama';

  const calibrated = m.calibrated === true;
  const threshold = typeof m.threshold === 'number' ? m.threshold.toFixed(2) : '—';
  const f1 = calibrated && typeof m.link_f1 === 'number' ? m.link_f1.toFixed(3) : null;
  const precision = calibrated && typeof m.link_precision === 'number' ? Math.round(m.link_precision * 100) + '%' : null;
  const recall = calibrated && typeof m.link_recall === 'number' ? Math.round(m.link_recall * 100) + '%' : null;
  const fp = calibrated && typeof m.false_positives === 'number' ? m.false_positives : null;

  const hasData = wSemantic != null;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid rgba(79,110,247,0.15)',
      borderRadius: 14,
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(79,110,247,0.05)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 5%, rgba(79,110,247,0.4) 40%, rgba(107,91,255,0.3) 70%, transparent 95%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(79,110,247,0.12)',
            border: '1px solid rgba(79,110,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={14} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Signal Fusion Engine
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              How requirement→code links are scored
            </div>
          </div>
        </div>
        {/* Calibration state — honest */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: '0.5625rem', fontWeight: 700,
          background: calibrated ? 'rgba(0,208,132,0.1)' : 'rgba(255,149,0,0.1)',
          border: `1px solid ${calibrated ? 'rgba(0,208,132,0.2)' : 'rgba(255,149,0,0.2)'}`,
          color: calibrated ? 'var(--success)' : 'var(--warning)',
          padding: '0.2rem 0.55rem', borderRadius: 999,
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          {calibrated
            ? <><CheckCircle2 size={9} /> Calibrated</>
            : <><AlertCircle size={9} /> Uncalibrated</>}
        </div>
      </div>

      {!hasData ? (
        <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          Run an analysis to load engine parameters.
        </div>
      ) : (
        <>
          {/* Signal rows — real weights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <SignalRow
              label="Semantic Similarity"
              sub={usingRealEmbeddings ? embeddingsBackend.split('/').pop()! : 'lexical fallback'}
              weight={wSemantic!}
              color="var(--accent)"
              delay={100}
            />
            <SignalRow
              label="Lexical Overlap"
              sub="token + identifier matching"
              weight={wLexical ?? 0}
              color="var(--success)"
              delay={250}
            />
            <SignalRow
              label="Coverage Bonus"
              sub="test→block linkage prior"
              weight={wCoverage ?? 0}
              color="var(--warning)"
              delay={400}
              prefix="+"
            />
            <SignalRow
              label="LLM Adjudication"
              sub={llmActive ? llmModel : `${llmModel} · disabled`}
              weight={wLlm ?? 0}
              color="#A78BFA"
              delay={550}
              inactive={!llmActive}
              inactiveNote="OFFLINE"
            />
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1rem 0 0.875rem' }} />

          {/* Footer — real calibration metrics or honest absence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <FooterStat label="Threshold" value={threshold} />
            {calibrated ? (
              <>
                <FooterStat label="F1" value={f1!} />
                <FooterStat label="Precision" value={precision!} />
                <FooterStat label="Recall" value={recall!} />
                <FooterStat label="False Pos" value={String(fp)} />
              </>
            ) : (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                No ground-truth set loaded — precision/recall unavailable for this repo.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FooterStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
    <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </span>
    <span style={{
      fontSize: '0.75rem', fontWeight: 800,
      color: 'var(--text-secondary)',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {value}
    </span>
  </div>
);
