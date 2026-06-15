import React from 'react';
import { Network } from 'lucide-react';
import { Requirement } from '../data/mockData';

interface Props {
  requirements?: Requirement[];
  onSelect?: (r: Requirement) => void;
}

const VB_W = 640, VB_H = 320;
const COLS = { req: 40, code: 260, test: 480 };
const NODE_W = 128, NODE_H = 30;

const statusColor = (s: string) => (s === 'complete' ? '#22C55E' : s === 'partial' ? '#F59E0B' : '#F43F5E');

function shorten(s: string, n = 16) {
  const base = s.split('/').pop() || s;
  return base.length > n ? base.slice(0, n) + '…' : base;
}

export const TraceabilityMap: React.FC<Props> = ({ requirements, onSelect }) => {
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
    const top = 56, usable = VB_H - 80;
    return count <= 1 ? VB_H / 2 : top + (i / (count - 1)) * usable;
  };

  const reqY = (i: number) => yFor(i, reqs.length);
  const codeY = (i: number) => yFor(i, codeN.length);
  const testY = (i: number) => yFor(i, testN.length);

  const edges: { x1: number; y1: number; x2: number; y2: number; color: string; key: string }[] = [];
  reqs.forEach((r, ri) => {
    r.codeFiles.forEach(cf => {
      const ci = codeN.indexOf(cf);
      if (ci === -1) return;
      edges.push({ x1: COLS.req + NODE_W, y1: reqY(ri), x2: COLS.code, y2: codeY(ci), color: statusColor(r.status), key: `rc-${ri}-${ci}` });
    });
    r.testFiles.forEach(tf => {
      const ti = testN.indexOf(tf);
      const firstCode = r.codeFiles.map(c => codeN.indexOf(c)).find(x => x >= 0);
      if (ti === -1 || firstCode === undefined) return;
      edges.push({ x1: COLS.code + NODE_W, y1: codeY(firstCode), x2: COLS.test, y2: testY(ti), color: '#22C55E', key: `ct-${ri}-${ti}` });
    });
  });

  const Node: React.FC<{ x: number; y: number; label: string; color: string; onClick?: () => void }> =
    ({ x, y, label, color, onClick }) => (
      <g style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
        <rect x={x} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={8}
          fill="#1A1B2A" stroke={color} strokeOpacity={0.5} strokeWidth={1} />
        <rect x={x} y={y - NODE_H / 2} width={3} height={NODE_H} rx={1.5} fill={color} />
        <text x={x + 12} y={y + 4} fontSize="10.5" fill="#C9CBE0" fontFamily="'JetBrains Mono', monospace">
          {label}
        </text>
      </g>
    );

  const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} /> {label}
    </div>
  );

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-hd">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(124,92,255,0.14)', border: '1px solid rgba(124,92,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={16} color="var(--accent-2)" />
          </div>
          <div>
            <div className="card-title">Traceability Map</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Requirements → Code → Tests</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Legend color="#7C5CFF" label="Requirements" />
          <Legend color="#3B82F6" label="Code" />
          <Legend color="#22C55E" label="Tests" />
        </div>
      </div>

      <div style={{ padding: '8px 12px 14px', flex: 1 }}>
        {reqs.length === 0 ? (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No linked requirements yet — run a scan with a requirements file.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
            <div style={{ minWidth: 600 }}>
              <svg width="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ display: 'block', overflow: 'visible' }}>
                {/* Column headers */}
                {[['REQUIREMENTS', COLS.req], ['CODE BLOCKS', COLS.code], ['TESTS', COLS.test]].map(([t, x]) => (
                  <text key={t as string} x={(x as number) + NODE_W / 2} y={28} fontSize="9.5" fontWeight="700"
                    fill="#6B6D85" textAnchor="middle" letterSpacing="1.5">{t}</text>
                ))}
                {/* Edges */}
                {edges.map(e => {
                  const mx = (e.x1 + e.x2) / 2;
                  return <path key={e.key} d={`M${e.x1},${e.y1} C${mx},${e.y1} ${mx},${e.y2} ${e.x2},${e.y2}`}
                    fill="none" stroke={e.color} strokeWidth="1.4" strokeOpacity="0.45"
                    style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: 'dash 1.1s ease-out forwards' }} />;
                })}
                {/* Nodes */}
                {reqs.map((r, i) => <Node key={r.id} x={COLS.req} y={reqY(i)} label={r.id} color="#7C5CFF" onClick={() => onSelect?.(r)} />)}
                {codeN.map((f, i) => <Node key={f} x={COLS.code} y={codeY(i)} label={shorten(f)} color="#3B82F6" />)}
                {testN.map((f, i) => <Node key={f} x={COLS.test} y={testY(i)} label={shorten(f)} color="#22C55E" />)}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
