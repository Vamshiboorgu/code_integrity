import React from 'react';
import { X, FileCode2, FlaskConical, ShieldAlert, ChevronRight, ExternalLink, BookOpen } from 'lucide-react';
import { Requirement } from '../data/mockData';
import { getStatusBadgeClass, getSeverityBadgeClass } from '../lib/utils';
import { TypeBadge } from './TypeBadge';

interface RequirementExplorerProps {
  requirement: Requirement;
  onClose: () => void;
  securityRisks?: any[];
}

export const RequirementExplorer: React.FC<RequirementExplorerProps> = ({ requirement, onClose, securityRisks }) => {
  const risks = securityRisks || [];
  const linkedSecurityRisks = risks.filter((r) => r.linkedRequirement === requirement.id);

  // Link evidence: map each code file to the reason its block was linked, so the
  // trace isn't a black box — hover a code file to see WHY it satisfies the requirement.
  const evidenceByFile = new Map<string, string>();
  const roleByFile = new Map<string, string>();
  (requirement.codeBlocks || []).forEach((b) => {
    if (b.file && b.reason && !evidenceByFile.has(b.file)) evidenceByFile.set(b.file, b.reason);
    if (b.file && b.service_role && !roleByFile.has(b.file)) {
      roleByFile.set(b.file, b.service_detail ? `${b.service_role} · ${b.service_detail}` : b.service_role);
    }
  });

  // Explain WHY this requirement has its status. "partial" = implemented in code but
  // not fully test-covered; the detail names exactly which blocks lack a linked test.
  const blocks = requirement.codeBlocks || [];
  const untested = blocks.filter((b) => b.tested === false);
  const testedCount = blocks.length - untested.length;
  let statusInfo: { color: string; title: string; detail: string; untestedNames?: string[] } | null = null;
  if (requirement.status === 'partial') {
    statusInfo = {
      color: '#f59e0b',
      title: 'Partially verified — implemented but under-tested',
      detail: requirement.testFiles.length === 0
        ? `Code implements this requirement, but no test is linked to any of its ${blocks.length} code block(s) — ${requirement.coverage}% coverage.`
        : `Only ${testedCount} of ${blocks.length} implementing code block(s) have a linked test (${requirement.coverage}% coverage). It needs ≥80% to count as complete.`,
      untestedNames: untested.map((b) => b.name || '').filter(Boolean).slice(0, 8),
    };
  } else if (requirement.status === 'missing') {
    statusInfo = {
      color: '#ef4444',
      title: 'Not implemented',
      detail: 'No code block was confirmed to satisfy this requirement (best match fell below the link threshold).',
    };
  } else if (requirement.status === 'complete') {
    statusInfo = {
      color: '#10b981',
      title: 'Implemented & verified',
      detail: `Traced to ${requirement.codeFiles.length} code file(s) with ${requirement.coverage}% of its code blocks covered by tests.`,
    };
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up"
        style={{
          width: '100%', maxWidth: '840px',
          background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.6) 50%, transparent 90%)' }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
              <BookOpen size={22} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: 6 }}>
                <span className="code-tag code-tag-blue">{requirement.id}</span>
                <TypeBadge type={requirement.type} size="md" />
                <span className={getStatusBadgeClass(requirement.status)}>{requirement.status}</span>
                {requirement.source && (
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>via {requirement.source}</span>
                )}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>{requirement.name}</h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{requirement.description}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflow: 'auto', flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Why this status (esp. why "partial") */}
          {statusInfo && (
            <div style={{
              background: `${statusInfo.color}12`, border: `1px solid ${statusInfo.color}33`,
              borderRadius: 14, padding: '1rem 1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusInfo.color, boxShadow: `0 0 8px ${statusInfo.color}` }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: statusInfo.color }}>{statusInfo.title}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                {statusInfo.detail}
              </p>
              {statusInfo.untestedNames && statusInfo.untestedNames.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Untested code blocks
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {statusInfo.untestedNames.map((n) => (
                      <span key={n} style={{ fontSize: '0.6875rem', fontFamily: 'JetBrains Mono, monospace', color: '#fcd34d', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 6, padding: '2px 7px' }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coverage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 90 }}>Coverage</span>
            <div className="progress-track" style={{ flex: 1, height: 8 }}>
              <div className="progress-fill" style={{
                background: requirement.coverage >= 80 ? '#10b981' : requirement.coverage >= 40 ? '#f59e0b' : '#ef4444',
                width: `${requirement.coverage}%`,
                boxShadow: `0 0 12px ${requirement.coverage >= 80 ? 'rgba(16,185,129,0.5)' : requirement.coverage >= 40 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}`,
              }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', minWidth: 50, textAlign: 'right' }}>{requirement.coverage}%</span>
          </div>

          {/* Traceability Flow */}
          <div>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
              Traceability Flow
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              
              <div style={{ flexShrink: 0, padding: '1rem', borderRadius: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', minWidth: 160 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Requirement</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>{requirement.id}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{requirement.name}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}><ChevronRight size={16} color="rgba(255,255,255,0.2)" /></div>

              <div style={{ flexShrink: 0, padding: '1rem', borderRadius: 12, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', minWidth: 180 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#00D4FF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileCode2 size={12} /> Code Files
                </div>
                {requirement.codeFiles.length === 0
                  ? <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>No implementations</div>
                  : requirement.codeFiles.map((f) => {
                    const why = evidenceByFile.get(f);
                    const role = roleByFile.get(f);
                    return (
                    <div key={f} style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160, cursor: why ? 'help' : 'default' }} title={why ? `${f}\n\nWhy linked: ${why}` : f}>
                        {f.split('/').pop()}{why ? ' ⓘ' : ''}
                      </div>
                      {role && (
                        <span style={{ display: 'inline-block', marginTop: 2, fontSize: '0.625rem', fontWeight: 700, color: '#fcd34d', background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 5, padding: '1px 6px', letterSpacing: '0.04em' }} title="Detected service role (boundary the requirement maps to)">
                          {role}
                        </span>
                      )}
                    </div>
                    );
                  })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}><ChevronRight size={16} color="rgba(255,255,255,0.2)" /></div>

              <div style={{ flexShrink: 0, padding: '1rem', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', minWidth: 180 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FlaskConical size={12} /> Test Files
                </div>
                {requirement.testFiles.length === 0
                  ? <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>No tests</div>
                  : requirement.testFiles.map((f) => (
                    <div key={f} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160, marginBottom: 2 }} title={f}>
                      {f.split('/').pop()}
                    </div>
                  ))}
              </div>

              {linkedSecurityRisks.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}><ChevronRight size={16} color="rgba(255,255,255,0.2)" /></div>
                  <div style={{ flexShrink: 0, padding: '1rem', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', minWidth: 160 }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldAlert size={12} /> Risks
                    </div>
                    {linkedSecurityRisks.map((r) => (
                      <div key={r.id} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{r.riskType}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Implementation Files */}
          {requirement.codeFiles.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode2 size={14} /> Implementation Files
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {requirement.codeFiles.map((file) => (
                  <div key={file} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                    borderRadius: 10, background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <FileCode2 size={15} color="#00D4FF" style={{ flexShrink: 0 }} />
                    <code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Risks */}
          {linkedSecurityRisks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={14} color="#f87171" /> Associated Security Risks
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {linkedSecurityRisks.map((risk) => (
                  <div key={risk.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem',
                    borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                  }}>
                    <span className={getSeverityBadgeClass(risk.severity)} style={{ flexShrink: 0 }}>{risk.severity}</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{risk.riskType}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', marginTop: 4, marginBottom: 8, lineHeight: 1.5 }}>{risk.description}</div>
                      <code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>{risk.file}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Close</button>
        </div>
      </div>
    </div>
  );
};
