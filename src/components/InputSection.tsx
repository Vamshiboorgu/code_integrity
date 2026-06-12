import React, { useState, useRef } from 'react';
import { GitCommit, Upload, FileText, GitBranch, CheckCircle2, ChevronRight, FolderOpen, Globe2, Link2 } from 'lucide-react';

interface InputSectionProps {
  onSubmit: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/company/main-api.git');
  const [branch, setBranch] = useState('main');
  
  const [zipName, setZipName] = useState('');
  const [reqName, setReqName] = useState('');

  const zipInputRef = useRef<HTMLInputElement>(null);
  const reqInputRef = useRef<HTMLInputElement>(null);

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipName(e.target.files[0].name);
      setRepoUrl('');
    }
  };

  const handleReqUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReqName(e.target.files[0].name);
    }
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

      {/* Hidden File Inputs */}
      <input type="file" accept=".zip" ref={zipInputRef} style={{ display: 'none' }} onChange={handleZipUpload} />
      <input type="file" accept=".csv,.xlsx,.pdf,.json" ref={reqInputRef} style={{ display: 'none' }} onChange={handleReqUpload} />

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
              style={{ paddingLeft: 32, fontSize: '0.8rem', height: 44 }}
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.375rem' }}>GitHub, GitLab, Azure DevOps, Bitbucket</p>
        </div>

        {/* ZIP Upload */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            <Upload size={11} /> Repository ZIP
          </label>
          <button
            onClick={() => zipInputRef.current?.click()}
            style={{
              width: '100%', height: 44, borderRadius: 10, cursor: 'pointer',
              border: `1.5px dashed ${zipName ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: zipName ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
              color: zipName ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          >
            {zipName
              ? <><CheckCircle2 size={14} color="#818cf8" /> {zipName}</>
              : <><FolderOpen size={14} /> Drop ZIP or click to browse</>}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.375rem' }}>Optional. Overrides URL if provided.</p>
        </div>

        {/* Requirements */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            <FileText size={11} /> Requirements File
          </label>
          <button
            onClick={() => reqInputRef.current?.click()}
            style={{
              width: '100%', height: 44, borderRadius: 10, cursor: 'pointer',
              border: `1.5px dashed ${reqName ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: reqName ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
              color: reqName ? '#c4b5fd' : 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          >
            {reqName
              ? <><CheckCircle2 size={14} color="#a78bfa" /> {reqName}</>
              : <><FileText size={14} /> Drop .xlsx, .csv, .json</>}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.375rem' }}>Excel, CSV, JSON, or JIRA export</p>
        </div>

        {/* Branch + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            <GitBranch size={11} /> Target Branch
          </label>
          <div style={{ position: 'relative' }}>
            <GitBranch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            <input
              value={branch} onChange={e => setBranch(e.target.value)}
              placeholder="main"
              className="input"
              style={{ paddingLeft: 32, height: 44 }}
            />
          </div>
          <button
            onClick={onSubmit}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '0.6875rem' }}
          >
            Analyze Repository
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1.125rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
      }}>
        {[
          { text: 'Last scanned 2h ago', color: '#34d399' },
          { text: 'Commit: a4f3b91', color: '#818cf8', mono: true },
          { text: '12 requirements loaded', color: '#34d399' },
          { text: 'Branch: main', color: '#60a5fa' },
        ].map(({ text, color, mono }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            <CheckCircle2 size={12} color={color} />
            <span style={{ fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
