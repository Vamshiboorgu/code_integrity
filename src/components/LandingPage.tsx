import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onLaunch: () => void;   // nav CTA -> choose a workspace
  onScan: () => void;     // Scan a repository -> app + scan dialog
  onJira: () => void;     // Connect Jira -> app + Jira dialog
  onDemo: () => void;     // See a live demo -> dashboard
  onDocs: () => void;     // Read the docs -> docs page
  onNav: (hash: string) => void; // nav links -> in-app views
}

const NAV_TARGETS: Record<string, string> = {
  Platform: '/app/dashboard',
  Traceability: '/app/requirements',
  Integrations: '/app/integrations',
  Docs: '/docs',
};

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';
const EMAIL = 'hello@codetrace.dev';
const SENSITIVITY = 0.5;

// Dark theme tokens (aligned with the dashboard).
const INK = '#F4F4F8';
const MUTED = '#A6A8C0';
const ACCENT = '#7C5CFF';

// ── typewriter hook ───────────────────────────────────────────
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── responsive breakpoint ─────────────────────────────────────
function useIsDesktop() {
  const [d, setD] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  useEffect(() => {
    const onResize = () => setD(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return d;
}

const NAV_LINKS = ['Platform', 'Traceability', 'Integrations', 'Docs'];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onScan, onJira, onDemo, onDocs, onNav }) => {
  const pillAction: Record<string, () => void> = {
    'Scan a repository': onScan,
    'Connect Jira': onJira,
    'See a live demo': onDemo,
    'Read the docs': onDocs,
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const isDesktop = useIsDesktop();

  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Every requirement, every line, every test — traced. Now, what should we analyze?'
  );

  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // mouse-scrub the background video — smooth via rAF easing (mousemove only
  // updates a target; a render loop eases currentTime toward it and seeks only
  // when the decoder is free, so we never flood the pipeline).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let prevX: number | null = null;
    let display = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (!v.duration) return;
      if (prevX === null) { prevX = e.clientX; return; }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      const t = targetTime.current + (delta / window.innerWidth) * SENSITIVITY * v.duration;
      targetTime.current = Math.max(0, Math.min(v.duration, t));
    };

    const tick = () => {
      if (v.duration) {
        display += (targetTime.current - display) * 0.11;            // ease (softer glide)
        if (Math.abs(targetTime.current - display) < 0.0008) display = targetTime.current;
        if (!v.seeking && Math.abs(v.currentTime - display) > 0.004) {
          v.currentTime = display;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const copyEmail = () => {
    try { navigator.clipboard.writeText(EMAIL); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const hoverOpacity = (el: HTMLElement, v: string) => { el.style.opacity = v; };

  return (
    <div className="landing" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', color: INK, background: '#0A0A14' }}>
      {/* Background video (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, objectFit: 'cover', objectPosition: '70% center', opacity: 0.55 }}
      />

      {/* Dark gradient overlay — blends the video into the theme, darker on the text side */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background:
          'linear-gradient(90deg, rgba(7,7,15,0.96) 0%, rgba(7,7,15,0.82) 38%, rgba(7,7,15,0.5) 66%, rgba(7,7,15,0.72) 100%),' +
          'linear-gradient(180deg, rgba(7,7,15,0.55) 0%, rgba(7,7,15,0) 30%, rgba(7,7,15,0) 60%, rgba(7,7,15,0.85) 100%)',
      }} />
      {/* Violet glow accents */}
      <div style={{ position: 'fixed', top: -160, left: -120, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,255,0.18) 0%, transparent 65%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isDesktop ? '20px 32px' : '16px 20px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: isDesktop ? 26 : 21, letterSpacing: '-0.03em', color: INK, fontWeight: 500 }}>
            CodeTrace<sup style={{ fontSize: '0.5em', color: MUTED }}>®</sup>
          </span>
          <span style={{ fontSize: isDesktop ? 30 : 25, color: ACCENT, userSelect: 'none', letterSpacing: '-0.02em' }}>✳︎</span>
        </div>

        {/* Desktop nav links */}
        {isDesktop && (
          <div style={{ display: 'flex', fontSize: 23, color: INK }}>
            {NAV_LINKS.map((l, i) => (
              <span key={l}>
                <a href="#" onClick={(e) => { e.preventDefault(); onNav(NAV_TARGETS[l]); }}
                  style={{ color: INK, textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => hoverOpacity(e.currentTarget, '0.55')}
                  onMouseLeave={e => hoverOpacity(e.currentTarget, '1')}>{l}</a>
                {i < NAV_LINKS.length - 1 && <span style={{ color: MUTED }}>, </span>}
              </span>
            ))}
          </div>
        )}

        {/* Desktop CTA */}
        {isDesktop && (
          <a href="#" onClick={(e) => { e.preventDefault(); onLaunch(); }}
            style={{ fontSize: 23, color: INK, textDecoration: 'underline', textUnderlineOffset: 2, textDecorationColor: ACCENT, transition: 'opacity 0.2s' }}
            onMouseEnter={e => hoverOpacity(e.currentTarget, '0.6')}
            onMouseLeave={e => hoverOpacity(e.currentTarget, '1')}>Launch app</a>
        )}

        {/* Mobile hamburger */}
        {!isDesktop && (
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
            style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 20 }}>
            <span style={{ width: 24, height: 2, background: INK, transition: 'all 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ width: 24, height: 2, background: INK, transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 24, height: 2, background: INK, transition: 'all 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* Mobile overlay */}
      {!isDesktop && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9,
          background: 'rgba(7,7,15,0.97)', backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
          padding: '0 32px', gap: 32,
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.3s',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNav(NAV_TARGETS[l]); }}
              style={{ fontSize: 32, fontWeight: 500, color: INK, textDecoration: 'none' }}>{l}</a>
          ))}
          <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onLaunch(); }}
            style={{ fontSize: 32, fontWeight: 500, color: INK, textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: ACCENT }}>Launch app</a>
        </div>
      )}

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 2, height: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: isDesktop ? 'center' : 'flex-end',
        padding: isDesktop ? '0 40px' : '0 20px 48px',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 600, position: 'relative', zIndex: 10 }}>
          {/* Blurred intro */}
          <div style={{
            pointerEvents: 'none', userSelect: 'none', marginBottom: 24,
            fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.3, fontWeight: 400,
            color: 'rgba(244,244,248,0.85)', filter: 'blur(4px)',
          }}>
            Hey there, meet A.R.I.A,<br />
            CodeTrace's Analysis &amp; Requirements Intelligence Agent
          </div>

          {/* Typewriter */}
          <p style={{
            color: INK, marginBottom: 26,
            fontSize: 'clamp(20px, 4.2vw, 30px)', lineHeight: 1.35, fontWeight: 400, minHeight: 54,
            letterSpacing: '-0.01em',
          }}>
            {displayed}
            {!done && (
              <span style={{ display: 'inline-block', width: 2, height: '1.1em', background: ACCENT, verticalAlign: 'middle', marginLeft: 2, animation: 'blink 1s step-end infinite' }} />
            )}
          </p>

          {/* Action pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', rowGap: 4,
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}>
            {['Scan a repository', 'Connect Jira', 'See a live demo', 'Read the docs'].map(label => (
              <Pill key={label} onClick={pillAction[label]}>{label}</Pill>
            ))}

            {/* Email pill */}
            <button
              onClick={copyEmail}
              style={{
                ...pillBase, color: INK, background: 'rgba(124,92,255,0.10)', border: `1px solid ${ACCENT}66`,
                gap: isDesktop ? 12 : 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,92,255,0.10)'; e.currentTarget.style.color = INK; e.currentTarget.style.borderColor = `${ACCENT}66`; }}
            >
              <span>Reach us: <span style={{ textDecoration: 'underline', textUnderlineOffset: 1 }}>{EMAIL}</span></span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied && <span style={{ marginLeft: 4 }}>✓</span>}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const pillBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 9999, fontSize: 15, padding: '0.42em 20px',
  margin: '0 0.2em 0.4em', whiteSpace: 'nowrap', cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s', fontFamily: 'inherit',
};

const Pill: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{ ...pillBase, background: 'rgba(255,255,255,0.06)', color: INK, border: '1px solid rgba(255,255,255,0.16)' }}
    onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = ACCENT; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = INK; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
  >
    {children}
  </button>
);
