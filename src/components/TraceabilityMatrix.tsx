import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, FileCode2, FlaskConical, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { mockRequirements, Requirement } from '../data/mockData';
import { getStatusBadgeClass } from '../lib/utils';

interface TraceabilityMatrixProps {
  onRequirementSelect: (req: Requirement) => void;
}

const filterConfig = [
  { key: 'complete' as const, label: 'Complete', dot: '#10b981' },
  { key: 'partial' as const, label: 'Partial', dot: '#f59e0b' },
  { key: 'missing' as const, label: 'Missing', dot: '#ef4444' },
];

export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({ onRequirementSelect }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'partial' | 'missing'>('all');
  const [sortField, setSortField] = useState<'id' | 'coverage'>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const counts = {
    complete: mockRequirements.filter(r => r.status === 'complete').length,
    partial: mockRequirements.filter(r => r.status === 'partial').length,
    missing: mockRequirements.filter(r => r.status === 'missing').length,
  };

  const filtered = useMemo(() => {
    let data = mockRequirements.filter(r => {
      const q = search.toLowerCase();
      if (q && !r.id.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
    return [...data].sort((a, b) => {
      const va = sortField === 'id' ? a.id : a.coverage;
      const vb = sortField === 'id' ? b.id : b.coverage;
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
  }, [search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: 'id' | 'coverage') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const coverageColor = (c: number) => c >= 80 ? '#10b981' : c >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(160deg, rgba(17,24,39,0.95) 0%, rgba(13,17,23,0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Top glow line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.4) 50%, transparent 90%)' }} />

      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCode2 size={17} color="#818cf8" />
            </div>
            <div>
              <div className="section-title">Traceability Matrix</div>
              <div className="section-sub">Requirements ↔ Code ↔ Tests</div>
            </div>
          </div>

          {/* Status filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            {filterConfig.map(({ key, label, dot }) => {
              const count = counts[key];
              const isActive = statusFilter === key;
              return (
                <button key={key} onClick={() => setStatusFilter(isActive ? 'all' : key)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.3rem 0.7rem', borderRadius: 7,
                  border: `1px solid ${isActive ? dot + '44' : 'transparent'}`,
                  background: isActive ? dot + '14' : 'rgba(255,255,255,0.03)',
                  color: isActive ? dot : 'rgba(255,255,255,0.4)',
                  fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'block' }} />
                  {label}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search row */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search requirements by ID, name, or category…"
              className="input" style={{ paddingLeft: 32 }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button onClick={() => toggleSort('id')} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', fontFamily: 'inherit' }}>
                  ID <ArrowUpDown size={10} />
                </button>
              </th>
              <th>Requirement</th>
              <th>Code Files</th>
              <th>Test Files</th>
              <th>Category</th>
              <th>Status</th>
              <th>
                <button onClick={() => toggleSort('coverage')} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', fontFamily: 'inherit' }}>
                  Coverage <ArrowUpDown size={10} />
                </button>
              </th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '4rem', textAlign: 'center' }}>
                  <Search size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.15, display: 'block', color: 'white' }} />
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem' }}>No requirements match your filters</div>
                </td>
              </tr>
            ) : filtered.map((req, i) => (
              <tr key={req.id} onClick={() => onRequirementSelect(req)} style={{ animationDelay: `${i * 20}ms` }}>
                <td>
                  <span className="code-tag code-tag-blue">{req.id}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{req.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.description}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem' }}>
                    <FileCode2 size={12} color={req.codeFiles.length > 0 ? '#818cf8' : 'rgba(255,255,255,0.2)'} />
                    <span style={{ color: req.codeFiles.length > 0 ? 'rgba(255,255,255,0.7)' : '#f87171' }}>
                      {req.codeFiles.length === 0 ? 'None' : `${req.codeFiles.length} file${req.codeFiles.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8125rem' }}>
                    <FlaskConical size={12} color={req.testFiles.length > 0 ? '#34d399' : 'rgba(255,255,255,0.2)'} />
                    <span style={{ color: req.testFiles.length > 0 ? 'rgba(255,255,255,0.7)' : '#f87171' }}>
                      {req.testFiles.length === 0 ? 'None' : `${req.testFiles.length} file${req.testFiles.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: 5 }}>
                    {req.category}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(req.status)}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="progress-track" style={{ width: 56 }}>
                      <div className="progress-fill" style={{ width: `${req.coverage}%`, background: coverageColor(req.coverage) }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>{req.coverage}%</span>
                  </div>
                </td>
                <td>
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
          Showing <strong style={{ color: 'rgba(255,255,255,0.5)' }}>{filtered.length}</strong> of <strong style={{ color: 'rgba(255,255,255,0.5)' }}>{mockRequirements.length}</strong> requirements
        </span>
        {statusFilter !== 'all' && (
          <button onClick={() => setStatusFilter('all')} style={{ fontSize: '0.75rem', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};
