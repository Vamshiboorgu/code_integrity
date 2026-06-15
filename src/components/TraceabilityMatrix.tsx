import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, ArrowUpDown, FileCode2, FlaskConical, ChevronRight,
  SlidersHorizontal, Network, Table2,
} from 'lucide-react';
import { Requirement } from '../data/mockData';
import { getStatusBadgeClass } from '../lib/utils';
import { TypeBadge, TYPE_META, TYPE_ORDER } from './TypeBadge';

interface TraceabilityMatrixProps {
  onRequirementSelect: (req: Requirement) => void;
  requirements?: Requirement[];
}

const filterConfig = [
  { key: 'complete' as const, label: 'Complete', dot: '#00D084' },
  { key: 'partial'  as const, label: 'Partial',  dot: '#FF9500' },
  { key: 'missing'  as const, label: 'Missing',  dot: '#FF3B30' },
];

// ─── Graph View ──────────────────────────────────────────────
const REQ_H    = 36;
const REQ_GAP  = 8;
const COL_W    = 200;
const COL_GAP  = 120;
const PAD      = 24;
const HEADER_H = 40;

const statusColor = (s: string) =>
  s === 'complete' ? '#00D084' : s === 'partial' ? '#FF9500' : '#FF3B30';

const GraphView: React.FC<{ requirements: Requirement[] }> = ({ requirements }) => {
  const [drawn, setDrawn] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const reqs = requirements.slice(0, 12); // cap at 12 nodes for clarity

  // Collect unique code files and test files from all reqs
  const codeFilesAll: string[] = useMemo(() => {
    const s = new Set<string>();
    reqs.forEach(r => r.codeFiles.forEach(f => s.add(f)));
    return Array.from(s).slice(0, 10);
  }, [reqs]);

  const testFilesAll: string[] = useMemo(() => {
    const s = new Set<string>();
    reqs.forEach(r => r.testFiles.forEach(f => s.add(f)));
    return Array.from(s).slice(0, 10);
  }, [reqs]);

  // Row heights for each column
  const rowH = (count: number) => Math.max(reqs.length, count) * (REQ_H + REQ_GAP);
  const svgH = Math.max(reqs.length, codeFilesAll.length, testFilesAll.length) * (REQ_H + REQ_GAP) + HEADER_H + PAD * 2;
  const svgW = COL_W * 3 + COL_GAP * 2 + PAD * 2;

  const reqX = PAD;
  const codeX = PAD + COL_W + COL_GAP;
  const testX = PAD + COL_W * 2 + COL_GAP * 2;

  const reqY  = (i: number) => HEADER_H + PAD + i * (REQ_H + REQ_GAP);
  const codeY = (i: number) => HEADER_H + PAD + i * (REQ_H + REQ_GAP);
  const testY = (i: number) => HEADER_H + PAD + i * (REQ_H + REQ_GAP);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Build lines: req → code file, code file → test file
  const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number; color: string; delay: number }[] = [];
  let lineIdx = 0;
  reqs.forEach((req, ri) => {
    const ry = reqY(ri) + REQ_H / 2;
    req.codeFiles.forEach(cf => {
      const ci = codeFilesAll.indexOf(cf);
      if (ci === -1) return;
      const cy = codeY(ci) + REQ_H / 2;
      const conf = req.coverage / 100;
      lines.push({
        x1: reqX + COL_W, y1: ry,
        x2: codeX, y2: cy,
        opacity: 0.2 + conf * 0.7,
        color: statusColor(req.status),
        delay: lineIdx++ * 40,
      });
    });
    req.testFiles.forEach(tf => {
      const ti = testFilesAll.indexOf(tf);
      if (ti === -1) return;
      const ty = testY(ti) + REQ_H / 2;
      // Simplified: draw from code column mid to test column
      lines.push({
        x1: codeX + COL_W, y1: ty,
        x2: testX, y2: ty,
        opacity: 0.5,
        color: '#7B61FF',
        delay: lineIdx++ * 40,
      });
    });
  });

  const short = (path: string) => {
    const p = path.split('/');
    return p[p.length - 1] || path;
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        style={{ display: 'block', minWidth: svgW }}
      >
        {/* Column headers */}
        {[
          { label: 'REQUIREMENTS', count: reqs.length,            x: reqX + COL_W / 2,  color: 'var(--accent)' },
          { label: 'CODE BLOCKS',  count: codeFilesAll.length,    x: codeX + COL_W / 2, color: '#7B9FFF' },
          { label: 'TESTS',        count: testFilesAll.length,    x: testX + COL_W / 2, color: 'var(--success)' },
        ].map(col => (
          <g key={col.label}>
            <text
              x={col.x} y={18}
              textAnchor="middle"
              fill="rgba(255,255,255,0.25)"
              fontSize={9} fontWeight={700}
              fontFamily="Inter, sans-serif"
              letterSpacing="0.1em"
            >
              {col.label}
            </text>
            <text
              x={col.x} y={32}
              textAnchor="middle"
              fill={col.color}
              fontSize={11} fontWeight={800}
              fontFamily="Inter, sans-serif"
            >
              {col.count}
            </text>
          </g>
        ))}

        {/* Lines */}
        {drawn && lines.map((line, i) => {
          const mx = (line.x1 + line.x2) / 2;
          const path = `M ${line.x1} ${line.y1} C ${mx} ${line.y1} ${mx} ${line.y2} ${line.x2} ${line.y2}`;
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth={1.5}
              strokeOpacity={line.opacity}
              style={{
                strokeDasharray: 400,
                strokeDashoffset: drawn ? 0 : 400,
                transition: `stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) ${line.delay}ms, stroke-dasharray 0s`,
              }}
            />
          );
        })}

        {/* Requirement nodes */}
        {reqs.map((req, i) => {
          const y = reqY(i);
          const sc = statusColor(req.status);
          return (
            <g key={req.id}>
              <rect
                x={reqX} y={y}
                width={COL_W} height={REQ_H}
                rx={6} ry={6}
                fill="rgba(255,255,255,0.025)"
                stroke={sc}
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <rect x={reqX} y={y} width={3} height={REQ_H} rx={1.5} fill={sc} />
              <text x={reqX + 12} y={y + 14} fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="JetBrains Mono, monospace" fontWeight={500}>
                {req.id}
              </text>
              <text x={reqX + 12} y={y + 26} fill="rgba(255,255,255,0.8)" fontSize={10} fontFamily="Inter, sans-serif" fontWeight={500}>
                {req.name.length > 22 ? req.name.slice(0, 22) + '…' : req.name}
              </text>
            </g>
          );
        })}

        {/* Code file nodes */}
        {codeFilesAll.map((cf, i) => {
          const y = codeY(i);
          return (
            <g key={cf}>
              <rect x={codeX} y={y} width={COL_W} height={REQ_H} rx={6} ry={6} fill="rgba(79,110,247,0.06)" stroke="rgba(79,110,247,0.3)" strokeWidth={1} />
              <rect x={codeX} y={y} width={3} height={REQ_H} rx={1.5} fill="var(--accent)" />
              <text x={codeX + 12} y={y + 20} fill="rgba(255,255,255,0.7)" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight={500}>
                {short(cf).length > 22 ? short(cf).slice(0, 22) + '…' : short(cf)}
              </text>
            </g>
          );
        })}

        {/* Test file nodes */}
        {testFilesAll.map((tf, i) => {
          const y = testY(i);
          return (
            <g key={tf}>
              <rect x={testX} y={y} width={COL_W} height={REQ_H} rx={6} ry={6} fill="rgba(0,208,132,0.06)" stroke="rgba(0,208,132,0.3)" strokeWidth={1} />
              <rect x={testX} y={y} width={3} height={REQ_H} rx={1.5} fill="var(--success)" />
              <text x={testX + 12} y={y + 20} fill="rgba(255,255,255,0.7)" fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight={500}>
                {short(tf).length > 22 ? short(tf).slice(0, 22) + '…' : short(tf)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────
export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({ onRequirementSelect, requirements }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'partial' | 'missing'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'id' | 'coverage'>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');

  const reqs = requirements || [];

  const counts = {
    complete: reqs.filter(r => r.status === 'complete').length,
    partial:  reqs.filter(r => r.status === 'partial').length,
    missing:  reqs.filter(r => r.status === 'missing').length,
  };

  // Type distribution present in this dataset (for the type filter chips).
  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    reqs.forEach(r => { c[r.type] = (c[r.type] || 0) + 1; });
    return c;
  }, [reqs]);
  const presentTypes = TYPE_ORDER.filter(t => typeCounts[t]);

  const filtered = useMemo(() => {
    let data = reqs.filter(r => {
      const q = search.toLowerCase();
      if (q && !r.id.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      return true;
    });
    return [...data].sort((a, b) => {
      const va = sortField === 'id' ? a.id : a.coverage;
      const vb = sortField === 'id' ? b.id : b.coverage;
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
  }, [search, statusFilter, typeFilter, sortField, sortDir, reqs]);

  const toggleSort = (field: 'id' | 'coverage') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const coverageColor = (c: number) => c >= 80 ? '#00D084' : c >= 40 ? '#FF9500' : '#FF3B30';

  return (
    <div className="animate-fade-up" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 14, overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileCode2 size={15} color="var(--accent)" />
            </div>
            <div>
              <div className="section-title">Traceability Matrix</div>
              <div className="section-sub">Requirements ↔ Code ↔ Tests</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 8 }}>
              <button onClick={() => setViewMode('table')} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.25rem 0.6rem', borderRadius: 6,
                background: viewMode === 'table' ? 'rgba(79,110,247,0.12)' : 'transparent',
                border: 'none', color: viewMode === 'table' ? '#7B9FFF' : 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>
                <Table2 size={12} /> Table
              </button>
              <button onClick={() => setViewMode('graph')} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.25rem 0.6rem', borderRadius: 6,
                background: viewMode === 'graph' ? 'rgba(79,110,247,0.12)' : 'transparent',
                border: 'none', color: viewMode === 'graph' ? '#7B9FFF' : 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}>
                <Network size={12} /> Graph
              </button>
            </div>

            {/* Status filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {filterConfig.map(({ key, label, dot }) => {
                const count = counts[key];
                const isActive = statusFilter === key;
                return (
                  <button key={key} onClick={() => setStatusFilter(isActive ? 'all' : key)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.25rem 0.6rem', borderRadius: 7,
                    border: `1px solid ${isActive ? dot + '44' : 'transparent'}`,
                    background: isActive ? dot + '12' : 'rgba(255,255,255,0.02)',
                    color: isActive ? dot : 'var(--text-muted)',
                    fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', fontFamily: 'inherit',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'block' }} />
                    {label}
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, opacity: 0.6 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {viewMode === 'table' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.875rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search requirements by ID, name, or category…"
                  className="input" style={{ paddingLeft: 28 }}
                />
              </div>
              <button className="btn btn-secondary" style={{ gap: '0.375rem', flexShrink: 0 }}>
                <SlidersHorizontal size={12} /> Filters
              </button>
            </div>

            {/* Type filter chips (standardized taxonomy) */}
            {presentTypes.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 }}>Type</span>
                <button onClick={() => setTypeFilter('all')} style={{
                  padding: '3px 10px', borderRadius: 7, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${typeFilter === 'all' ? 'var(--border-accent)' : 'transparent'}`,
                  background: typeFilter === 'all' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                  color: typeFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>All ({reqs.length})</button>
                {presentTypes.map(t => {
                  const m = TYPE_META[t];
                  const active = typeFilter === t;
                  return (
                    <button key={t} onClick={() => setTypeFilter(active ? 'all' : t)} style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7,
                      fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      border: `1px solid ${active ? m.color + '55' : 'transparent'}`,
                      background: active ? m.color + '18' : 'rgba(255,255,255,0.02)',
                      color: active ? m.color : 'var(--text-muted)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: 2, background: m.color }} />
                      {m.label} <span style={{ opacity: 0.65 }}>({typeCounts[t]})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      {viewMode === 'graph' ? (
        <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)' }}>
          {reqs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No data available. Run a scan to view the graph.
            </div>
          ) : (
            <GraphView requirements={reqs} />
          )}
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button onClick={() => toggleSort('id')} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', fontFamily: 'inherit' }}>
                      ID <ArrowUpDown size={9} />
                    </button>
                  </th>
                  <th>Requirement</th>
                  <th>Code Files</th>
                  <th>Test Files</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>
                    <button onClick={() => toggleSort('coverage')} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', fontFamily: 'inherit' }}>
                      Coverage <ArrowUpDown size={9} />
                    </button>
                  </th>
                  <th style={{ width: 28 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3.5rem', textAlign: 'center' }}>
                      <Search size={28} style={{ margin: '0 auto 0.625rem', opacity: 0.1, display: 'block', color: 'white' }} />
                      <div style={{ color: 'var(--text-faint)', fontSize: '0.875rem' }}>
                        {reqs.length === 0 ? 'No data available. Run a scan to view requirements.' : 'No requirements match your filters'}
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((req, i) => (
                  <tr key={req.id} onClick={() => onRequirementSelect(req)} style={{ animationDelay: `${i * 20}ms` }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="code-tag code-tag-blue">{req.id}</span>
                        <TypeBadge type={req.type} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{req.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem' }}>
                        <FileCode2 size={11} color={req.codeFiles.length > 0 ? 'var(--accent)' : 'var(--text-faint)'} />
                        <span style={{ color: req.codeFiles.length > 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
                          {req.codeFiles.length === 0 ? 'None' : `${req.codeFiles.length} file${req.codeFiles.length > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem' }}>
                        <FlaskConical size={11} color={req.testFiles.length > 0 ? 'var(--success)' : 'var(--text-faint)'} />
                        <span style={{ color: req.testFiles.length > 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
                          {req.testFiles.length === 0 ? 'None' : `${req.testFiles.length} file${req.testFiles.length > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.45rem', borderRadius: 5, border: '1px solid var(--border-subtle)' }}>
                        {req.category}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(req.status)}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div className="progress-track" style={{ width: 48 }}>
                          <div className="progress-fill" style={{ width: `${req.coverage}%`, background: coverageColor(req.coverage) }} />
                        </div>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', minWidth: 28, fontVariantNumeric: 'tabular-nums' }}>{req.coverage}%</span>
                      </div>
                    </td>
                    <td>
                      <ChevronRight size={13} color="var(--text-faint)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '0.625rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
              Showing <strong style={{ color: 'var(--text-muted)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--text-muted)' }}>{reqs.length}</strong> requirements
            </span>
            {statusFilter !== 'all' && (
              <button onClick={() => setStatusFilter('all')} style={{ fontSize: '0.6875rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Clear filter
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
