// ============================================================
// Type definitions for the Code Integrity dashboard.
// NOTE: This file holds ONLY TypeScript interfaces. All values
// rendered in the UI come from the live backend API
// (/api/metrics, /api/map, /api/drift, /api/risks, /api/trace).
// There is intentionally no mock/sample data here.
// ============================================================

export interface Requirement {
  id: string;
  name: string;
  description: string;
  codeFiles: string[];
  // Per-block link evidence (why each code block was linked) — surfaced on hover.
  codeBlocks?: { name?: string; file?: string; reason?: string; confidence?: number; service_role?: string; service_detail?: string; tested?: boolean }[];
  testFiles: string[];
  status: 'complete' | 'partial' | 'missing';
  coverage: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  type: string;          // standardized artifact type: REQ/FEAT/STORY/EPIC/NFR/BUG/TASK
  source?: string;       // where it came from: file | jira | doc
}

export interface SecurityRisk {
  id: string;
  file: string;
  riskType: string;
  severity: 'high' | 'medium' | 'low';
  linkedRequirement: string;
  testCoverage: number;
  description: string;
  line?: number;
}

export interface PerformanceRisk {
  id: string;
  fileName: string;
  issueType: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  impact: string;
}

export interface OrphanCode {
  id: string;
  fileName: string;       // source file (from backend `file`)
  functionName: string;   // qualified block name (from backend `name`)
  line: number;           // start line (from backend `line`)
  confidence: number;     // best-match confidence %, from `best_confidence`
  risk: 'high' | 'medium' | 'low';
}

export interface DeadTest {
  id: string;
  testFile: string;       // test name (from backend `name`)
  coversOnly: string[];   // orphan blocks it exclusively covers (from `covers_only`)
  status: 'dead';
}
