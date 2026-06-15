import React, { useMemo } from 'react';
import { Boxes, FileCode2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Requirement, OrphanCode } from '../data/mockData';
import { TraceabilityGraph } from './TraceabilityGraph';
import { ViewHeader } from './AuditLogsView';

interface Props {
  requirements: Requirement[];
  orphanCode: OrphanCode[];
  metrics?: any;
}

export const CodeMapView: React.FC<Props> = ({ requirements, orphanCode, metrics }) => {
  // Invert requirements → code file → linked requirement ids.
  const fileMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    requirements.forEach(r => r.codeFiles.forEach(f => {
      (map[f] = map[f] || new Set()).add(r.id);
    }));
    return Object.entries(map).map(([file, reqs]) => ({ file, reqs: Array.from(reqs) }))
      .sort((a, b) => b.reqs.length - a.reqs.length);
  }, [requirements]);

  const orphanFiles = new Set(orphanCode.map(o => o.fileName));
  const totalBlocks = metrics?.counts?.code_blocks ?? '—';

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <ViewHeader icon={<Boxes size={18} />} title="Code Map" sub="How source code links back to requirements and tests" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TraceabilityGraph requirements={requirements} />

        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-hd">
            <div className="card-title">Code Files</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{totalBlocks} blocks analyzed</span>
          </div>
          {fileMap.length === 0 && orphanCode.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No code analyzed yet — run a scan.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['File', 'Linked Requirements', 'Status'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '10px 18px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileMap.map(({ file, reqs }) => (
                  <tr key={file} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '11px 18px' }}>
                      <FileCode2 size={12} color="var(--blue-light)" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                      <code style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{file.split('/').pop()}</code>
                    </td>
                    <td style={{ padding: '11px 18px' }}>
                      {reqs.map(id => <span key={id} className="code-tag code-tag-violet" style={{ marginRight: 5 }}>{id}</span>)}
                    </td>
                    <td style={{ padding: '11px 18px', textAlign: 'right' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)' }}>
                        <CheckCircle2 size={12} /> Linked
                      </span>
                    </td>
                  </tr>
                ))}
                {orphanCode.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(245,158,11,0.03)' }}>
                    <td style={{ padding: '11px 18px' }}>
                      <FileCode2 size={12} color="var(--warning)" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                      <code style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{o.functionName}</code>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginLeft: 8, fontFamily: "'JetBrains Mono', monospace" }}>{o.fileName.split('/').pop()}:{o.line}</span>
                    </td>
                    <td style={{ padding: '11px 18px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>none (best match {o.confidence}%)</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 600, color: 'var(--warning)' }}>
                        <AlertTriangle size={12} /> Orphan
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
