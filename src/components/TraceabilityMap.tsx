import React, { useState } from 'react';
import { Network, FileCode2, FlaskConical, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Requirement } from '../data/mockData';
import { getSeverityBadgeClass } from '../lib/utils';

interface Props {
  requirements?: Requirement[];
  onSelect?: (r: Requirement) => void;
}

// Increased dimensions to fit richer cards
const VB_W = 1000, VB_H = 450;
const NODE_W = 220, NODE_H = 44;
const COLS = { req: 40, code: 390, test: 740 };

const statusColor = (s: string) => (s === 'complete' ? '#00D084' : s === 'partial' ? '#FF9500' : '#FF3B30');

function shorten(s: string, n = 22) {
  const base = s.split('/').pop() || s;
  return base.length > n ? base.slice(0, n) + '…' : base;
}

export const TraceabilityMap: React.FC<Props> = ({ requirements, onSelect }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const reqs = (requirements || []).filter(r => r.codeFiles.length > 0).slice(0, 6);

  // Build distinct code + test node lists from the chosen requirements.
  const codeFiles: string[] = [];
  const testFiles: string[] = [];
  reqs.forEach(r => {
    r.codeFiles.forEach(f => { if (!codeFiles.includes(f)) codeFiles.push(f); });
    r.testFiles.forEach(f => { if (!testFiles.includes(f)) testFiles.push(f); });
  });
  const codeN = codeFiles.slice(0, 6);
  const testN = testFiles.slice(0, 6);

  const yFor = (i: number, count: number) => {
    const top = 70, usable = VB_H - 120;
    return count <= 1 ? VB_H / 2 : top + (i / (count - 1)) * usable;
  };

  const reqY = (i: number) => yFor(i, reqs.length);
  const codeY = (i: number) => yFor(i, codeN.length);
  const testY = (i: number) => yFor(i, testN.length);

  const edges: { x1: number; y1: number; x2: number; y2: number; color: string; key: string; source: string; target: string }[] = [];
  
  reqs.forEach((r, ri) => {
    r.codeFiles.forEach(cf => {
      const ci = codeN.indexOf(cf);
      if (ci === -1) return;
      edges.push({ 
        x1: COLS.req + NODE_W, y1: reqY(ri), 
        x2: COLS.code, y2: codeY(ci), 
        color: statusColor(r.status), 
        key: `rc-${ri}-${ci}`,
        source: `req-${r.id}`,
        target: `code-${cf}`
      });
    });
    r.testFiles.forEach(tf => {
      const ti = testN.indexOf(tf);
      const firstCode = r.codeFiles.map(c => codeN.indexOf(c)).find(x => x >= 0);
      if (ti === -1 || firstCode === undefined) return;
      edges.push({ 
        x1: COLS.code + NODE_W, y1: codeY(firstCode), 
        x2: COLS.test, y2: testY(ti), 
        color: '#00D084', 
        key: `ct-${ri}-${ti}`,
        source: `code-${codeN[firstCode]}`,
        target: `test-${tf}`
      });
    });
  });

  const Node: React.FC<{ 
    x: number; y: number; id: string; type: 'req'|'code'|'test'; 
    label: string; subLabel?: string; color: string; 
    icon?: React.ReactNode; badge?: React.ReactNode; onClick?: () => void 
  }> = ({ x, y, id, type, label, subLabel, color, icon, badge, onClick }) => {
    
    const isHovered = hoveredNode === id;
    const isFaded = hoveredNode !== null && hoveredNode !== id && 
      !edges.some(e => (e.source === hoveredNode && e.target === id) || (e.target === hoveredNode && e.source === id) || 
                       (e.source === id && e.target === hoveredNode) || (e.target === id && e.source === hoveredNode) ||
                       // Also highlight transitive paths if we hover a req -> code -> test
                       (type === 'test' && hoveredNode.startsWith('req-') && edges.some(e1 => e1.source === hoveredNode && e1.target.startsWith('code-') && edges.some(e2 => e2.source === e1.target && e2.target === id))) ||
                       (type === 'req' && hoveredNode.startsWith('test-') && edges.some(e1 => e1.target === hoveredNode && e1.source.startsWith('code-') && edges.some(e2 => e2.target === e1.source && e2.source === id)))
      );

    return (
      <foreignObject 
        x={x} y={y - NODE_H / 2} 
        width={NODE_W} height={NODE_H}
        onMouseEnter={() => setHoveredNode(id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default', transition: 'opacity 0.2s', opacity: isFaded ? 0.25 : 1 }}
      >
        <div style={{
          width: '100%', height: '100%',
          background: 'var(--bg-elevated)',
          border: `1px solid ${isHovered ? color : 'var(--border-subtle)'}`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', padding: '0 10px',
          boxShadow: isHovered ? `0 4px 12px ${color}20` : '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          gap: 8,
          boxSizing: 'border-box'
        }}>
          {icon && <div style={{ color: 'var(--text-faint)', display: 'flex' }}>{icon}</div>}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label}
            </div>
            {subLabel && (
              <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subLabel}
              </div>
            )}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      </foreignObject>
    );
  };

  const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} /> {label}
    </div>
  );

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0, 123, 255,0.14)', border: '1px solid rgba(0, 123, 255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={16} color="var(--accent-2)" />
          </div>
          <div>
            <div className="card-title">Interactive Traceability Map</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hover nodes to trace relationships</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Legend color="#00D084" label="Complete" />
          <Legend color="#FF9500" label="Partial" />
          <Legend color="#FF3B30" label="Missing" />
        </div>
      </div>

      <div style={{ padding: '8px 12px 14px', flex: 1 }}>
        {reqs.length === 0 ? (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No linked requirements yet — run a scan with a requirements file.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
            <div style={{ minWidth: 800 }}>
              <svg width="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ display: 'block', overflow: 'visible' }}>
                {/* Column headers */}
                {[['REQUIREMENTS', COLS.req], ['CODE BLOCKS', COLS.code], ['TESTS', COLS.test]].map(([t, x]) => (
                  <text key={t as string} x={(x as number) + NODE_W / 2} y={28} fontSize="9.5" fontWeight="700"
                    fill="#6B6D85" textAnchor="middle" letterSpacing="1.5">{t}</text>
                ))}
                
                {/* Edges */}
                {edges.map(e => {
                  const mx = (e.x1 + e.x2) / 2;
                  
                  // Check if this edge should be highlighted or faded based on hover state
                  let isHighlighted = false;
                  let isFaded = false;
                  
                  if (hoveredNode) {
                    if (e.source === hoveredNode || e.target === hoveredNode) {
                      isHighlighted = true;
                    } else {
                      // Transitive check (Req -> Code -> Test)
                      if (hoveredNode.startsWith('req-')) {
                        isHighlighted = edges.some(e1 => e1.source === hoveredNode && e1.target === e.source);
                      } else if (hoveredNode.startsWith('test-')) {
                        isHighlighted = edges.some(e1 => e1.target === hoveredNode && e1.source === e.target);
                      }
                    }
                    if (!isHighlighted) isFaded = true;
                  }

                  return (
                    <path key={e.key} d={`M${e.x1},${e.y1} C${mx},${e.y1} ${mx},${e.y2} ${e.x2},${e.y2}`}
                      fill="none" 
                      stroke={isHighlighted ? e.color : (isFaded ? 'var(--border-subtle)' : e.color)} 
                      strokeWidth={isHighlighted ? 2.5 : 1.4} 
                      strokeOpacity={isHighlighted ? 0.9 : (isFaded ? 0.15 : 0.45)}
                      style={{ 
                        strokeDasharray: 600, strokeDashoffset: 600, 
                        animation: 'dash 1.1s ease-out forwards',
                        transition: 'all 0.2s ease'
                      }} />
                  );
                })}

                {/* Nodes */}
                {reqs.map((r, i) => (
                  <Node 
                    key={r.id} id={`req-${r.id}`} type="req"
                    x={COLS.req} y={reqY(i)} 
                    label={r.id} subLabel={r.name}
                    color={statusColor(r.status)} 
                    onClick={() => onSelect?.(r)} 
                    badge={
                      r.status === 'complete' ? <CheckCircle2 size={14} color="#00D084" /> :
                      r.status === 'missing' ? <AlertCircle size={14} color="#FF3B30" /> : null
                    }
                  />
                ))}
                {codeN.map((f, i) => (
                  <Node 
                    key={f} id={`code-${f}`} type="code"
                    x={COLS.code} y={codeY(i)} 
                    label={shorten(f, 24)} color="#3B82F6" 
                    icon={<FileCode2 size={16} />}
                  />
                ))}
                {testN.map((f, i) => (
                  <Node 
                    key={f} id={`test-${f}`} type="test"
                    x={COLS.test} y={testY(i)} 
                    label={shorten(f, 24)} color="#00D084" 
                    icon={<FlaskConical size={16} />}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
