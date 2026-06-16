import React, { useState } from 'react';
import { GitCommit, Upload, FileText, GitBranch, CheckCircle2, ChevronRight, FolderOpen, Globe2, Link2, KeyRound, Plug, GitCompare } from 'lucide-react';

export interface JiraConfig { url: string; email: string; token: string; jql: string; }

interface InputSectionProps {
  onSubmit: (repoUrl: string, branch: string, zipFile: File | null, reqFile: File | null, token: string, jira: JiraConfig | null, cr: string) => void;
  initialJiraOpen?: boolean;
  lastScan?: {
    whenLabel?: string;
    requirements: number;
    branch?: string;
  };
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, initialJiraOpen, lastScan }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [reqFile, setReqFile] = useState<File | null>(null);
  const [token, setToken] = useState('');
  const [cr, setCr] = useState('');
  const [jiraOpen, setJiraOpen] = useState(!!initialJiraOpen);
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [jiraJql, setJiraJql] = useState('');

  const buildJira = (): JiraConfig | null =>
    (jiraUrl && jiraEmail && jiraToken)
      ? { url: jiraUrl.trim().replace(/\/$/, ''), email: jiraEmail.trim(), token: jiraToken.trim(), jql: jiraJql.trim() || 'ORDER BY created DESC' }
      : null;

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setZipFile(e.target.files[0]);
  };

  const handleReqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReqFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Warn up front — before the multi-minute scan — if there is no requirements
    // source. Without Jira or a requirements file there is nothing to trace against,
    // so the analysis would run for minutes only to land on an empty traceability view.
    if (!buildJira() && !reqFile) {
      const proceed = window.confirm(
        'No requirements source connected.\n\n' +
        'You have not connected Jira or uploaded a requirements file, so there is nothing ' +
        'to trace this code and tests against — the traceability view will be empty.\n\n' +
        'Click Cancel to add a requirements file or connect Jira first, or OK to analyze ' +
        'the repository anyway (code, tests and risks only).'
      );
      if (!proceed) return;   // modal stays open, inputs preserved
    }
    onSubmit(repoUrl, 'main', zipFile, reqFile, '', buildJira(), '');
  };

  return (
    <div style={{
      background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }} className="animate-fade-up">

      {/* Subtle top gradient stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 50%, transparent 100%)',
      }} />

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Globe2 size={17} color="#818cf8" />
          </div>
          <div>
            <div className="section-title">Analysis Configuration</div>
            <div className="section-sub">Configure repository scan parameters</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.35rem 0.875rem', borderRadius: 999,
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'block' }} className="animate-pulse" />
          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Ready to Scan</span>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', position: 'relative' }}>

        {/* Repo URL */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            <Link2 size={11} /> Repository URL
          </label>
          <div style={{ position: 'relative' }}>
            <GitCommit size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            <input
              value={repoUrl} onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/org/repo.git"
              className="input mono"
              style={{ paddingLeft: 32, fontSize: '0.8rem', height: 50, width: '100%' }}
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.375rem' }}>Public repo URL — GitHub, GitLab, Bitbucket. Any language.</p>
        </div>

        {/* Requirements */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            <FileText size={11} /> Requirements File
          </label>
          <label
            style={{
              width: '100%', height: 50, borderRadius: 10, cursor: 'pointer',
              border: `1.5px dashed ${reqFile ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: reqFile ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
              color: reqFile ? '#c4b5fd' : 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit',
              margin: 0,
            }}
          >
            <input type="file" style={{ display: 'none' }} accept=".xlsx,.csv,.json" onChange={handleReqChange} />
            {reqFile
              ? <><CheckCircle2 size={14} color="#a78bfa" /> {reqFile.name}</>
              : <><FileText size={14} /> Drop .xlsx, .csv, .json</>}
          </label>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.375rem' }}>Excel, CSV, JSON, or JIRA export</p>
        </div>

      </div>

      {/* Jira connector */}
      <div style={{ marginTop: '1.5rem', width: '100%' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
          <Plug size={11} /> Jira Integration
        </label>
        <button
          onClick={() => setJiraOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 50,
            background: jiraOpen ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px ${jiraOpen ? 'solid' : 'dashed'} ${jiraOpen ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10, padding: '0 1rem', cursor: 'pointer', fontFamily: 'inherit',
            color: jiraOpen ? '#c4b5fd' : 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = jiraOpen ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = jiraOpen ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Plug size={16} color={jiraOpen ? "#a78bfa" : "rgba(255,255,255,0.4)"} />
            <span>{buildJira() ? <span style={{ color: '#10b981', fontWeight: 600 }}>Jira Configured</span> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>Connect to Jira (optional)</span>}</span>
          </div>
          <ChevronRight size={16} style={{ transform: jiraOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease-in-out', color: 'rgba(255,255,255,0.3)' }} />
        </button>

        {jiraOpen && (
          <div style={{
            marginTop: '0.875rem', padding: '1.25rem',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Jira URL</label>
              <input value={jiraUrl} onChange={e => setJiraUrl(e.target.value)} placeholder="https://company.atlassian.net" className="input mono" style={{ marginTop: 6, fontSize: '0.78rem', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
              <input value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} placeholder="you@company.com" className="input" style={{ marginTop: 6, fontSize: '0.78rem', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>API Token</label>
              <input type="password" autoComplete="off" value={jiraToken} onChange={e => setJiraToken(e.target.value)} placeholder="Atlassian API token" className="input mono" style={{ marginTop: 6, fontSize: '0.78rem', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>JQL (optional)</label>
              <input value={jiraJql} onChange={e => setJiraJql(e.target.value)} placeholder="project = ABC AND issuetype = Story" className="input mono" style={{ marginTop: 6, fontSize: '0.78rem', width: '100%' }} />
            </div>
            <p style={{ gridColumn: '1 / -1', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              When set, requirements are pulled live from Jira instead of a file. Token is sent only to your engine, never stored. Create one at id.atlassian.com/manage/api-tokens.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem' }}
        >
          Analyze Repository
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Status Bar — real per-session summary, shown only after a scan exists. */}
      {lastScan && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.125rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          {[
            ...(lastScan.whenLabel ? [{ text: `Last scanned ${lastScan.whenLabel}`, color: '#34d399' }] : []),
            { text: `${lastScan.requirements} requirements loaded`, color: '#34d399' },
            ...(lastScan.branch ? [{ text: `Branch: ${lastScan.branch}`, color: '#60a5fa' }] : []),
          ].map(({ text, color }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
              <CheckCircle2 size={12} color={color} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
