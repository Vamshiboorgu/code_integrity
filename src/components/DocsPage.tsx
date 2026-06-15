import React from 'react';
import {
  ArrowLeft, Rocket, GitBranch, Layers, Boxes, ShieldAlert, Plug, Database,
  Cpu, Bot, Tags, FileCode2, FlaskConical, GitMerge,
} from 'lucide-react';

interface DocsPageProps {
  onBack: () => void;
  onLaunch: () => void;
}

const Section: React.FC<{ id: string; icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ id, icon, title, children }) => (
  <section id={id} style={{ marginBottom: 44, scrollMarginTop: 90 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(124,92,255,0.14)', border: '1px solid rgba(124,92,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-2)' }}>{icon}</div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
    </div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>{children}</div>
  </section>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82em', color: 'var(--code-green)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 5 }}>{children}</code>
);

const Pill: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 600, color, background: `${color}1a`, border: `1px solid ${color}33`, padding: '3px 9px', borderRadius: 999, marginRight: 6, marginBottom: 6 }}>{children}</span>
);

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'how', label: 'How it works' },
  { id: 'requirements', label: 'Requirement sources' },
  { id: 'taxonomy', label: 'Standardized taxonomy' },
  { id: 'languages', label: 'Multi-language analysis' },
  { id: 'drift', label: 'Drift detection' },
  { id: 'risk', label: 'Risk lens' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'workspaces', label: 'Workspaces & views' },
  { id: 'api', label: 'API reference' },
  { id: 'quickstart', label: 'Quick start' },
];

export const DocsPage: React.FC<DocsPageProps> = ({ onBack, onLaunch }) => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 26px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(16px)',
      }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #7C5CFF, #6D4AF0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCode2 size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>CodeTrace Docs</span>
        </div>
        <button onClick={onLaunch} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
          <Rocket size={14} /> Launch app
        </button>
      </header>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', gap: 40, padding: '40px 26px 80px' }}>
        {/* TOC */}
        <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 90, alignSelf: 'flex-start', display: 'none' }} className="docs-toc">
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>On this page</div>
          {TOC.map(t => (
            <button key={t.id} onClick={() => scrollTo(t.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 0', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>{t.label}</button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-2)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Documentation</span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '8px 0 12px', lineHeight: 1.1 }}>
              Requirements → Code → Tests, fully traced.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 640 }}>
              CodeTrace is a precision traceability engine. It links every requirement to the code that
              implements it and the tests that verify it, then flags the gaps — orphan code, unimplemented
              requirements, dead tests — and ranks security &amp; performance risk. Deterministic by design,
              with optional local AI. No data leaves your machine.
            </p>
          </div>

          <Section id="overview" icon={<Layers size={18} />} title="What CodeTrace does">
            It builds a bidirectional graph between three artifact layers and detects <em>drift</em> in all directions:
            <ul style={{ margin: '12px 0', paddingLeft: 20 }}>
              <li><strong>Requirements</strong> — from a file, Jira, or a repo's own docs.</li>
              <li><strong>Code blocks</strong> — functions/methods parsed from the source.</li>
              <li><strong>Tests</strong> — mapped to the code they exercise.</li>
            </ul>
            The win is <strong>accuracy with low false positives</strong> — links are scored by fused signals and
            gated by a calibrated threshold, not open-ended prompting.
          </Section>

          <Section id="how" icon={<GitMerge size={18} />} title="How linking works — signal fusion">
            Each requirement→code link gets a confidence score fusing multiple signals:
            <div style={{ margin: '14px 0' }}>
              <Pill color="#7C5CFF">Semantic similarity · 65%</Pill>
              <Pill color="#22C55E">Lexical overlap · 35%</Pill>
              <Pill color="#F59E0B">Coverage bonus · +8%</Pill>
              <Pill color="#A78BFA">LLM adjudication · optional</Pill>
            </div>
            Semantic similarity uses a local code-embedding model; lexical overlap matches identifiers and tokens;
            a small bonus is added when the code is test-covered. When a repo ships a ground-truth set, the link
            threshold is <strong>calibrated to maximize F1</strong> — on the bundled sample that yields
            <Code>precision = recall = F1 = 1.0</Code> with zero false positives.
          </Section>

          <Section id="requirements" icon={<FileCode2 size={18} />} title="Where requirements come from">
            Resolution order when you run a scan:
            <ol style={{ margin: '12px 0', paddingLeft: 20 }}>
              <li>An uploaded requirements <strong>file</strong> (<Code>.json / .csv / .xlsx</Code>)</li>
              <li><strong>Jira</strong> — pulled live via the REST API (when configured)</li>
              <li>A <Code>requirements.json</Code> inside the repo</li>
              <li><strong>Doc extraction</strong> — headings in <Code>README.md</Code> / <Code>docs/*.md</Code> become requirements</li>
              <li>Otherwise empty — all code shows as orphan</li>
            </ol>
            Every requirement records its origin (<Code>via file / jira / doc</Code>) so nothing is a black box.
          </Section>

          <Section id="taxonomy" icon={<Tags size={18} />} title="Standardized taxonomy">
            Every artifact is classified into a typed taxonomy with a standardized, type-prefixed key:
            <div style={{ margin: '14px 0' }}>
              <Pill color="#A855F7">EPIC-</Pill><Pill color="#3B82F6">FEAT-</Pill><Pill color="#06B6D4">STORY-</Pill>
              <Pill color="#7C5CFF">REQ-</Pill><Pill color="#14B8A6">NFR-</Pill><Pill color="#F43F5E">BUG-</Pill><Pill color="#F59E0B">TASK-</Pill>
            </div>
            Type is decided <strong>source-first</strong> (a Jira issue type or a <Code>type</Code> column),
            then inferred from keywords, defaulting to <Code>REQ</Code>. Items with a real external key (Jira
            <Code>PROJ-123</Code>) keep their key and get a type badge; engine-generated items are re-prefixed
            (<Code>FEAT-002</Code>).
          </Section>

          <Section id="languages" icon={<Boxes size={18} />} title="Multi-language analysis">
            Code is parsed with <strong>tree-sitter</strong> (real syntax trees, not regex) across 15+ languages —
            JavaScript, TypeScript/TSX, Java, Go, Rust, C/C++, C#, Ruby, PHP, Swift, Kotlin, Scala, and more.
            Python uses the stdlib <Code>ast</Code> for maximum fidelity. Unknown files still get a whole-file
            block so every file is traceable.
          </Section>

          <Section id="drift" icon={<GitBranch size={18} />} title="Drift detection">
            Three gaps, gated by the calibrated threshold:
            <ul style={{ margin: '12px 0', paddingLeft: 20 }}>
              <li><strong>Orphan code</strong> — functions with no linked requirement.</li>
              <li><strong>Unimplemented requirements</strong> — requirements with no code.</li>
              <li><strong>Dead tests</strong> — tests that only cover orphan code.</li>
            </ul>
          </Section>

          <Section id="risk" icon={<ShieldAlert size={18} />} title="Risk lens">
            Deterministic security &amp; performance scanners rank flags by severity, complexity, git churn, and
            test-coverage gaps. Python uses precise AST rules; other languages use cross-language patterns
            (eval/shell-exec, SQL injection, weak hashing, XSS, hard-coded secrets, nested loops, N+1, …) — each tied
            back to its requirement (or shown as a gap).
          </Section>

          <Section id="integrations" icon={<Plug size={18} />} title="Integrations">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 10 }}>
              {[
                { icon: <Plug size={15} />, name: 'Jira', desc: 'Live requirement sync via REST API + token.' },
                { icon: <Database size={15} />, name: 'PostgreSQL', desc: 'Durable per-project scan history.' },
                { icon: <Cpu size={15} />, name: 'Embeddings', desc: 'Local code-embedding model, air-gapped.' },
                { icon: <Bot size={15} />, name: 'Local LLM', desc: 'Optional Qwen via Ollama for adjudication + Ask AI.' },
                { icon: <GitBranch size={15} />, name: 'Git', desc: 'Clone any public/private repo; churn signals.' },
                { icon: <FlaskConical size={15} />, name: 'CI (planned)', desc: 'PR-level traceability checks.' },
              ].map(i => (
                <div key={i.name} style={{ padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-2)', marginBottom: 6 }}>{i.icon}<span style={{ fontWeight: 650, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{i.name}</span></div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{i.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="workspaces" icon={<Layers size={18} />} title="Workspaces & views">
            Pick a role on entry — <strong>Business Analyst</strong>, <strong>Developer</strong>, or <strong>QA Engineer</strong> —
            for a tailored dashboard. Navigate Requirements, Code Map, Tests, Risks, Issues (drift), Reports
            (JSON/CSV export), Integrations, Audit Logs, and Settings. The right-hand <strong>AI Insights</strong> panel
            shows a live health score and a grounded assistant.
          </Section>

          <Section id="api" icon={<Cpu size={18} />} title="API reference">
            A zero-framework HTTP server exposes JSON endpoints:
            <ul style={{ margin: '12px 0', paddingLeft: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', lineHeight: 1.9 }}>
              <li><Code>GET /api/metrics</Code> — fusion weights, calibration, backends, counts</li>
              <li><Code>GET /api/map</Code> — requirements, code blocks, links</li>
              <li><Code>GET /api/drift</Code> — orphan / unimplemented / dead</li>
              <li><Code>GET /api/risks</Code> — ranked security &amp; performance flags</li>
              <li><Code>GET /api/trace?req=KEY</Code> — one requirement's links</li>
              <li><Code>GET /api/history</Code> · <Code>/api/projects</Code> — scan history (Postgres)</li>
              <li><Code>POST /api/scan</Code> — scan a repo (url, branch, token, jira)</li>
              <li><Code>POST /api/ask</Code> — grounded AI assistant</li>
            </ul>
          </Section>

          <Section id="quickstart" icon={<Rocket size={18} />} title="Quick start">
            <pre style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '16px 18px', overflowX: 'auto', fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
{`# build the graph + serve the dashboard
python run.py

# analyze a different repo
python run.py build --repo /path/to/repo

# enterprise tier (optional)
pip install tree-sitter tree-sitter-language-pack psycopg2-binary`}
            </pre>
            Then open the dashboard, hit <strong>Run Scan</strong>, paste a repo URL (or connect Jira), and analyze.
          </Section>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ready to trace your codebase?</span>
            <button onClick={onLaunch} className="btn btn-primary" style={{ padding: '10px 20px' }}><Rocket size={15} /> Launch CodeTrace</button>
          </div>
        </main>
      </div>
    </div>
  );
};
