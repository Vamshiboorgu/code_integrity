import React, { useMemo } from 'react';
import { Network, Search } from 'lucide-react';
import { Requirement } from '../data/mockData';

interface TraceabilityGraphProps {
  requirements: Requirement[];
}

export const TraceabilityGraph: React.FC<TraceabilityGraphProps> = ({ requirements }) => {
  const ITEM_HEIGHT = 50;
  const ITEM_GAP = 16;
  const PADDING_TOP = 40;

  // Derive unique nodes
  const reqNodes = useMemo(() => requirements.slice(0, 6), [requirements]); // Limit to 6 for clean visual
  
  const { codeNodes, testNodes, reqToCode, codeToTest } = useMemo(() => {
    const codes = new Set<string>();
    const tests = new Set<string>();
    const r2c: Array<{ reqIdx: number, codeIdx: number }> = [];
    const c2t: Array<{ codeIdx: number, testIdx: number }> = [];
    
    reqNodes.forEach(r => {
      r.codeFiles.forEach(c => codes.add(c));
      r.testFiles.forEach(t => tests.add(t));
    });
    
    const codeArray = Array.from(codes).slice(0, 6);
    const testArray = Array.from(tests).slice(0, 6);

    // Build connections based on the sliced arrays
    reqNodes.forEach((r, rIdx) => {
      r.codeFiles.forEach(c => {
        const cIdx = codeArray.indexOf(c);
        if (cIdx !== -1) {
          r2c.push({ reqIdx: rIdx, codeIdx: cIdx });
          r.testFiles.forEach(t => {
            const tIdx = testArray.indexOf(t);
            if (tIdx !== -1) {
              // Ensure we don't duplicate code->test lines
              if (!c2t.some(link => link.codeIdx === cIdx && link.testIdx === tIdx)) {
                c2t.push({ codeIdx: cIdx, testIdx: tIdx });
              }
            }
          });
        }
      });
    });

    return { codeNodes: codeArray, testNodes: testArray, reqToCode: r2c, codeToTest: c2t };
  }, [reqNodes]);

  const getY = (index: number) => PADDING_TOP + index * (ITEM_HEIGHT + ITEM_GAP) + (ITEM_HEIGHT / 2);

  // Numeric coords in a 0..100 horizontal scale (SVG path d can't take % or calc()).
  const drawBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const cpX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cpX} ${y1}, ${cpX} ${y2}, ${x2} ${y2}`;
  };

  const getContainerHeight = () => {
    const maxItems = Math.max(reqNodes.length, codeNodes.length, testNodes.length);
    if (maxItems === 0) return 300;
    return PADDING_TOP + maxItems * (ITEM_HEIGHT + ITEM_GAP) + PADDING_TOP;
  };

  if (requirements.length === 0) {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Network size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
        <p>No traceability data available. Run a scan.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 16, overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Network size={16} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>Traceability Map</div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>Requirements → Code → Tests</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8' }} /> Requirements</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Code</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Tests</div>
        </div>
      </div>

      {/* Graph Area */}
      <div style={{ position: 'relative', height: getContainerHeight(), padding: '0', overflow: 'hidden', display: 'flex', width: '100%', minWidth: 500 }}>
        
        {/* SVG Canvas for Lines */}
        <svg viewBox={`0 0 100 ${getContainerHeight()}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <linearGradient id="reqToCode" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="codeToTest" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {/* Draw Req -> Code Lines */}
          {reqToCode.map((link, i) => (
            <path
              key={`r2c-${i}`}
              d={drawBezier(28, getY(link.reqIdx), 36, getY(link.codeIdx))}
              fill="none"
              stroke="url(#reqToCode)"
              strokeWidth={1.5}
            />
          ))}

          {/* Draw Code -> Test Lines */}
          {codeToTest.map((link, i) => (
            <path
              key={`c2t-${i}`}
              d={drawBezier(64, getY(link.codeIdx), 72, getY(link.testIdx))}
              fill="none"
              stroke="url(#codeToTest)"
              strokeWidth={1.5}
            />
          ))}
        </svg>

        {/* Requirements Column */}
        <div style={{ position: 'absolute', left: '2%', width: '26%', zIndex: 2, paddingTop: PADDING_TOP }}>
          <div style={{ position: 'absolute', top: 12, left: 0, width: '100%', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Requirements</div>
          {reqNodes.map((req, i) => (
            <div key={req.id} style={{
              height: ITEM_HEIGHT, marginBottom: ITEM_GAP,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderLeft: '3px solid #818cf8',
              borderRadius: 8, padding: '0 1rem', display: 'flex', alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
              fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)'
            }}>
              {req.id}
            </div>
          ))}
        </div>

        {/* Code Column */}
        <div style={{ position: 'absolute', left: '36%', width: '28%', zIndex: 2, paddingTop: PADDING_TOP }}>
          <div style={{ position: 'absolute', top: 12, left: 0, width: '100%', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Code Blocks</div>
          {codeNodes.map((code, i) => (
            <div key={code} style={{
              height: ITEM_HEIGHT, marginBottom: ITEM_GAP,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderLeft: '3px solid #3b82f6',
              borderRadius: 8, padding: '0 1rem', display: 'flex', alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
              fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.9)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }} title={code}>
              {code.split('/').pop()}
            </div>
          ))}
        </div>

        {/* Tests Column */}
        <div style={{ position: 'absolute', left: '72%', width: '26%', zIndex: 2, paddingTop: PADDING_TOP }}>
          <div style={{ position: 'absolute', top: 12, left: 0, width: '100%', textAlign: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tests</div>
          {testNodes.map((test, i) => (
            <div key={test} style={{
              height: ITEM_HEIGHT, marginBottom: ITEM_GAP,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderLeft: '3px solid #10b981',
              borderRadius: 8, padding: '0 1rem', display: 'flex', alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)',
              fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.9)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }} title={test}>
              {test.split('/').pop()}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
