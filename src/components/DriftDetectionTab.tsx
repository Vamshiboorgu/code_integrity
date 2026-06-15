import React, { useState } from 'react';
import { GitMerge, Code2, Skull, AlertCircle, ExternalLink } from 'lucide-react';
import { mockRequirements, mockOrphanCode, mockDeadTests } from '../data/mockData';
import { getSeverityBadgeClass, getTestStatusBadgeClass } from '../lib/utils';

const TabButton: React.FC<{
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number; color: string; bg: string
}> = ({ active, onClick, icon, label, count, color, bg }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.4rem 0.75rem', borderRadius: 8,
    background: active ? bg : 'transparent',
    border: `1px solid ${active ? color + '40' : 'transparent'}`,
    color: active ? 'white' : 'rgba(255,255,255,0.4)',
    fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: 'inherit',
  }}
    onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
    onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
  >
    <div style={{ color }}>{icon}</div>
    {label}
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: active ? color : 'rgba(255,255,255,0.3)', background: active ? 'transparent' : 'rgba(255,255,255,0.05)', padding: '0.1rem 0.35rem', borderRadius: 5 }}>
      {count}
    </span>
  </button>
);

export const DriftDetectionTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'unimplemented' | 'orphan' | 'dead'>('unimplemented');
  const unimplemented = mockRequirements.filter(r => r.status === 'missing');

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.4) 50%, transparent 90%)' }} />

      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitMerge size={17} color="#fbbf24" />
          </div>
          <div>
            <div className="section-title">Drift Detection</div>
            <div className="section-sub">Identify misalignments between requirements, code, and tests</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', padding: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
          <TabButton active={activeSection === 'unimplemented'} onClick={() => setActiveSection('unimplemented')} icon={<AlertCircle size={14} />} label="Unimplemented" count={unimplemented.length} color="#ef4444" bg="rgba(239,68,68,0.15)" />
          <TabButton active={activeSection === 'orphan'} onClick={() => setActiveSection('orphan')} icon={<Code2 size={14} />} label="Orphan Code" count={mockOrphanCode.length} color="#f59e0b" bg="rgba(245,158,11,0.15)" />
          <TabButton active={activeSection === 'dead'} onClick={() => setActiveSection('dead')} icon={<Skull size={14} />} label="Dead Tests" count={mockDeadTests.length} color="#f97316" bg="rgba(249,115,22,0.15)" />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {activeSection === 'unimplemented' && (
          <table className="data-table animate-fade-in">
            <thead>
              <tr>
                <th>Req ID</th><th>Description</th><th>Category</th><th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {unimplemented.map((req, i) => (
                <tr key={req.id} style={{ animationDelay: `${i * 20}ms` }}>
                  <td><span className="code-tag code-tag-red">{req.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{req.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</div>
                  </td>
                  <td><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: 5 }}>{req.category}</span></td>
                  <td><span className={getSeverityBadgeClass(req.severity)}>{req.severity.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeSection === 'orphan' && (
          <table className="data-table animate-fade-in">
            <thead>
              <tr>
                <th>File Name</th><th>Lines</th><th>Last Modified</th><th>Confidence</th><th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {mockOrphanCode.map((item, i) => (
                <tr key={item.id} style={{ animationDelay: `${i * 20}ms` }}>
                  <td><code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>{item.fileName}</code></td>
                  <td><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{item.linesOfCode.toLocaleString()} LOC</span></td>
                  <td><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{item.lastModified}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-track" style={{ width: 48 }}>
                        <div className="progress-fill" style={{ width: `${item.confidence}%`, background: '#f59e0b' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{item.confidence}%</span>
                    </div>
                  </td>
                  <td><span className={getSeverityBadgeClass(item.risk)}>{item.risk.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeSection === 'dead' && (
          <table className="data-table animate-fade-in">
            <thead>
              <tr>
                <th>Test File</th><th>Linked Requirement</th><th>Last Run</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDeadTests.map((test, i) => (
                <tr key={test.id} style={{ animationDelay: `${i * 20}ms` }}>
                  <td><code style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>{test.testFile}</code></td>
                  <td>
                    {test.linkedRequirement === 'NONE'
                      ? <span className="code-tag code-tag-muted">NONE</span>
                      : <span className="code-tag code-tag-orange">{test.linkedRequirement}</span>}
                  </td>
                  <td><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{test.lastRun}</span></td>
                  <td><span className={getTestStatusBadgeClass(test.status)}>{test.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
