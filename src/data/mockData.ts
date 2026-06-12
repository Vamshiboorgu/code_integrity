// ============================================================
// Mock Data for Code Integrity & Traceability Engine
// ============================================================

export interface Requirement {
  id: string;
  name: string;
  description: string;
  codeFiles: string[];
  testFiles: string[];
  status: 'complete' | 'partial' | 'missing';
  coverage: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
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
  fileName: string;
  confidence: number;
  risk: 'high' | 'medium' | 'low';
  linesOfCode: number;
  lastModified: string;
}

export interface DeadTest {
  id: string;
  testFile: string;
  linkedRequirement: string;
  status: 'dead' | 'orphaned' | 'deprecated';
  lastRun: string;
}

export interface TrendDataPoint {
  date: string;
  coverage: number;
  requirements: number;
  tests: number;
}

export const mockRequirements: Requirement[] = [
  {
    id: 'REQ-001',
    name: 'User Authentication',
    description: 'System shall provide secure multi-factor authentication for all user accounts',
    codeFiles: ['src/auth/AuthService.ts', 'src/auth/MFAHandler.ts', 'src/middleware/auth.ts'],
    testFiles: ['tests/auth/AuthService.test.ts', 'tests/auth/MFA.test.ts'],
    status: 'complete',
    coverage: 94,
    severity: 'critical',
    category: 'Security',
  },
  {
    id: 'REQ-002',
    name: 'Data Encryption at Rest',
    description: 'All sensitive data shall be encrypted using AES-256 encryption at rest',
    codeFiles: ['src/crypto/EncryptionService.ts', 'src/db/DataLayer.ts'],
    testFiles: ['tests/crypto/Encryption.test.ts'],
    status: 'partial',
    coverage: 67,
    severity: 'critical',
    category: 'Security',
  },
  {
    id: 'REQ-003',
    name: 'Audit Logging',
    description: 'System shall maintain comprehensive audit logs for all data access operations',
    codeFiles: ['src/logging/AuditLogger.ts'],
    testFiles: [],
    status: 'partial',
    coverage: 45,
    severity: 'high',
    category: 'Compliance',
  },
  {
    id: 'REQ-004',
    name: 'Rate Limiting',
    description: 'API endpoints shall implement rate limiting to prevent abuse',
    codeFiles: [],
    testFiles: [],
    status: 'missing',
    coverage: 0,
    severity: 'high',
    category: 'Security',
  },
  {
    id: 'REQ-005',
    name: 'Input Validation',
    description: 'All user inputs shall be validated and sanitized before processing',
    codeFiles: ['src/validation/InputValidator.ts', 'src/middleware/sanitize.ts'],
    testFiles: ['tests/validation/InputValidator.test.ts', 'tests/integration/api.test.ts'],
    status: 'complete',
    coverage: 88,
    severity: 'critical',
    category: 'Security',
  },
  {
    id: 'REQ-006',
    name: 'Session Management',
    description: 'System shall implement secure session management with automatic timeout',
    codeFiles: ['src/session/SessionManager.ts'],
    testFiles: ['tests/session/SessionManager.test.ts'],
    status: 'complete',
    coverage: 91,
    severity: 'high',
    category: 'Security',
  },
  {
    id: 'REQ-007',
    name: 'Data Export Compliance',
    description: 'System shall provide GDPR-compliant data export functionality',
    codeFiles: ['src/compliance/DataExport.ts'],
    testFiles: [],
    status: 'partial',
    coverage: 30,
    severity: 'medium',
    category: 'Compliance',
  },
  {
    id: 'REQ-008',
    name: 'Performance Monitoring',
    description: 'System shall monitor and report performance metrics in real-time',
    codeFiles: [],
    testFiles: [],
    status: 'missing',
    coverage: 0,
    severity: 'medium',
    category: 'Performance',
  },
  {
    id: 'REQ-009',
    name: 'Role-Based Access Control',
    description: 'System shall implement RBAC with granular permissions',
    codeFiles: ['src/rbac/RoleManager.ts', 'src/rbac/PermissionGuard.ts', 'src/middleware/authorize.ts'],
    testFiles: ['tests/rbac/RoleManager.test.ts', 'tests/rbac/PermissionGuard.test.ts'],
    status: 'complete',
    coverage: 97,
    severity: 'critical',
    category: 'Security',
  },
  {
    id: 'REQ-010',
    name: 'API Documentation',
    description: 'All public API endpoints shall have OpenAPI 3.0 documentation',
    codeFiles: ['src/docs/OpenAPISpec.ts'],
    testFiles: [],
    status: 'partial',
    coverage: 55,
    severity: 'low',
    category: 'Documentation',
  },
  {
    id: 'REQ-011',
    name: 'Backup & Recovery',
    description: 'System shall perform automated daily backups with point-in-time recovery',
    codeFiles: [],
    testFiles: [],
    status: 'missing',
    coverage: 0,
    severity: 'critical',
    category: 'Infrastructure',
  },
  {
    id: 'REQ-012',
    name: 'Error Handling',
    description: 'System shall implement centralized error handling with structured error responses',
    codeFiles: ['src/errors/ErrorHandler.ts', 'src/errors/AppError.ts'],
    testFiles: ['tests/errors/ErrorHandler.test.ts'],
    status: 'complete',
    coverage: 82,
    severity: 'high',
    category: 'Reliability',
  },
];

export const mockSecurityRisks: SecurityRisk[] = [
  {
    id: 'SEC-001',
    file: 'src/api/UserController.ts',
    riskType: 'SQL Injection',
    severity: 'high',
    linkedRequirement: 'REQ-005',
    testCoverage: 12,
    description: 'Raw SQL query concatenation detected without parameterization',
    line: 247,
  },
  {
    id: 'SEC-002',
    file: 'src/auth/TokenService.ts',
    riskType: 'Hardcoded Secret',
    severity: 'high',
    linkedRequirement: 'REQ-001',
    testCoverage: 0,
    description: 'JWT secret key appears to be hardcoded in source code',
    line: 15,
  },
  {
    id: 'SEC-003',
    file: 'src/utils/FileUpload.ts',
    riskType: 'Path Traversal',
    severity: 'high',
    linkedRequirement: 'REQ-005',
    testCoverage: 5,
    description: 'File path constructed from user input without sanitization',
    line: 89,
  },
  {
    id: 'SEC-004',
    file: 'src/middleware/cors.ts',
    riskType: 'Insecure CORS',
    severity: 'medium',
    linkedRequirement: 'REQ-004',
    testCoverage: 0,
    description: 'CORS policy allows all origins with wildcard configuration',
    line: 12,
  },
  {
    id: 'SEC-005',
    file: 'src/crypto/HashUtils.ts',
    riskType: 'Weak Algorithm',
    severity: 'medium',
    linkedRequirement: 'REQ-002',
    testCoverage: 34,
    description: 'MD5 hashing algorithm used for password hashing',
    line: 31,
  },
  {
    id: 'SEC-006',
    file: 'src/api/AdminController.ts',
    riskType: 'Missing Auth Check',
    severity: 'high',
    linkedRequirement: 'REQ-009',
    testCoverage: 0,
    description: 'Admin endpoint missing authentication middleware',
    line: 156,
  },
  {
    id: 'SEC-007',
    file: 'src/session/TokenCache.ts',
    riskType: 'Session Fixation',
    severity: 'medium',
    linkedRequirement: 'REQ-006',
    testCoverage: 22,
    description: 'Session token not regenerated after privilege escalation',
    line: 78,
  },
  {
    id: 'SEC-008',
    file: 'src/logging/Logger.ts',
    riskType: 'Sensitive Data Logging',
    severity: 'low',
    linkedRequirement: 'REQ-003',
    testCoverage: 55,
    description: 'User passwords may be logged in debug mode',
    line: 203,
  },
];

export const mockPerformanceRisks: PerformanceRisk[] = [
  {
    id: 'PERF-001',
    fileName: 'src/api/ReportController.ts',
    issueType: 'N+1 Query',
    severity: 'high',
    recommendation: 'Use eager loading or DataLoader to batch database queries',
    impact: 'Response time 8x slower under load',
  },
  {
    id: 'PERF-002',
    fileName: 'src/services/AnalyticsService.ts',
    issueType: 'Memory Leak',
    severity: 'high',
    recommendation: 'Implement proper cleanup in event listeners and subscriptions',
    impact: 'Memory usage grows unboundedly over time',
  },
  {
    id: 'PERF-003',
    fileName: 'src/utils/DataProcessor.ts',
    issueType: 'Synchronous I/O',
    severity: 'high',
    recommendation: 'Replace fs.readFileSync with async fs.readFile calls',
    impact: 'Blocks event loop, causing up to 500ms delays',
  },
  {
    id: 'PERF-004',
    fileName: 'src/cache/CacheManager.ts',
    issueType: 'Missing Cache',
    severity: 'medium',
    recommendation: 'Implement Redis caching for frequently accessed data',
    impact: 'Unnecessary database load on repeated queries',
  },
  {
    id: 'PERF-005',
    fileName: 'src/api/SearchController.ts',
    issueType: 'Missing Index',
    severity: 'medium',
    recommendation: 'Add database index on user_id and created_at columns',
    impact: 'Full table scan on search queries',
  },
  {
    id: 'PERF-006',
    fileName: 'src/middleware/compression.ts',
    issueType: 'Missing Compression',
    severity: 'low',
    recommendation: 'Enable gzip/brotli compression for API responses',
    impact: 'API responses 3-5x larger than necessary',
  },
  {
    id: 'PERF-007',
    fileName: 'src/uploads/ImageProcessor.ts',
    issueType: 'CPU Intensive',
    severity: 'medium',
    recommendation: 'Move image processing to worker threads or external queue',
    impact: 'Image uploads block main thread for 2-3 seconds',
  },
];

export const mockOrphanCode: OrphanCode[] = [
  { id: 'ORP-001', fileName: 'src/legacy/OldAuthSystem.ts', confidence: 98, risk: 'high', linesOfCode: 847, lastModified: '2024-03-15' },
  { id: 'ORP-002', fileName: 'src/utils/DeprecatedUtils.ts', confidence: 92, risk: 'medium', linesOfCode: 234, lastModified: '2024-05-02' },
  { id: 'ORP-003', fileName: 'src/api/v1/LegacyEndpoints.ts', confidence: 87, risk: 'high', linesOfCode: 1203, lastModified: '2024-01-08' },
  { id: 'ORP-004', fileName: 'src/services/UnusedNotificationService.ts', confidence: 95, risk: 'medium', linesOfCode: 456, lastModified: '2024-06-20' },
  { id: 'ORP-005', fileName: 'src/helpers/TempHelper.ts', confidence: 99, risk: 'low', linesOfCode: 67, lastModified: '2024-08-11' },
  { id: 'ORP-006', fileName: 'src/models/OldUserModel.ts', confidence: 91, risk: 'high', linesOfCode: 389, lastModified: '2023-12-01' },
];

export const mockDeadTests: DeadTest[] = [
  { id: 'DT-001', testFile: 'tests/legacy/OldAuth.test.ts', linkedRequirement: 'NONE', status: 'orphaned', lastRun: '2024-02-14' },
  { id: 'DT-002', testFile: 'tests/api/v1/LegacyAPI.test.ts', linkedRequirement: 'REQ-DEP-003', status: 'dead', lastRun: '2023-11-30' },
  { id: 'DT-003', testFile: 'tests/utils/OldUtils.test.ts', linkedRequirement: 'NONE', status: 'orphaned', lastRun: '2024-01-05' },
  { id: 'DT-004', testFile: 'tests/services/DeprecatedNotification.test.ts', linkedRequirement: 'REQ-DEP-007', status: 'deprecated', lastRun: '2024-04-22' },
  { id: 'DT-005', testFile: 'tests/models/OldUserModel.test.ts', linkedRequirement: 'NONE', status: 'dead', lastRun: '2023-09-15' },
];

export const mockTrendData: TrendDataPoint[] = [
  { date: 'Jan', coverage: 42, requirements: 65, tests: 48 },
  { date: 'Feb', coverage: 48, requirements: 68, tests: 52 },
  { date: 'Mar', coverage: 53, requirements: 72, tests: 58 },
  { date: 'Apr', coverage: 61, requirements: 75, tests: 64 },
  { date: 'May', coverage: 68, requirements: 78, tests: 71 },
  { date: 'Jun', coverage: 74, requirements: 82, tests: 77 },
  { date: 'Jul', coverage: 79, requirements: 85, tests: 82 },
];

export const mockKPIs = {
  totalRequirements: 12,
  implementedRequirements: 5,
  partialRequirements: 4,
  missingRequirements: 3,
  linkedTests: 11,
  deadTests: 5,
  orphanCode: 6,
  securityRisks: 8,
  performanceRisks: 7,
  traceabilityCoverage: 71,
};

export const mockAIInsights = [
  {
    id: 1,
    type: 'critical' as const,
    title: 'Critical Security Vulnerability',
    description: 'SQL injection risk detected in UserController.ts (line 247). Immediate remediation required.',
    action: 'View REQ-005',
  },
  {
    id: 2,
    type: 'warning' as const,
    title: 'Unimplemented Critical Requirements',
    description: '3 requirements are completely unimplemented including REQ-004 (Rate Limiting) and REQ-011 (Backup).',
    action: 'View Requirements',
  },
  {
    id: 3,
    type: 'info' as const,
    title: 'Orphan Code Detected',
    description: '6 code files with no linked requirements found. Largest: src/api/v1/LegacyEndpoints.ts (1,203 LOC).',
    action: 'View Orphan Code',
  },
  {
    id: 4,
    type: 'success' as const,
    title: 'Coverage Improving',
    description: 'Traceability coverage increased from 42% to 71% over the last 7 months. Keep it up!',
    action: 'View Trend',
  },
  {
    id: 5,
    type: 'warning' as const,
    title: 'Memory Leak Detected',
    description: 'AnalyticsService.ts has an unbounded memory leak. Production risk if not addressed.',
    action: 'View PERF-002',
  },
];

export const mockRepositories = [
  { value: 'main-api', label: 'main-api' },
  { value: 'frontend-app', label: 'frontend-app' },
  { value: 'auth-service', label: 'auth-service' },
  { value: 'data-pipeline', label: 'data-pipeline' },
];

export const mockBranches = [
  { value: 'main', label: 'main' },
  { value: 'develop', label: 'develop' },
  { value: 'feature/security-audit', label: 'feature/security-audit' },
  { value: 'release/2.4.0', label: 'release/2.4.0' },
];
