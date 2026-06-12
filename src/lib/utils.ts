import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'complete': return 'badge badge-complete';
    case 'partial': return 'badge badge-partial';
    case 'missing': return 'badge badge-missing';
    default: return 'badge';
  }
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity) {
    case 'high': return 'badge badge-high';
    case 'medium': return 'badge badge-medium';
    case 'low': return 'badge badge-low';
    case 'critical': return 'badge badge-critical';
    default: return 'badge';
  }
}

export function getTestStatusBadgeClass(status: string): string {
  switch (status) {
    case 'dead': return 'badge badge-dead';
    case 'orphaned': return 'badge badge-orphaned';
    case 'deprecated': return 'badge badge-deprecated';
    default: return 'badge';
  }
}

export function getSeverityTextColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#f87171';
    case 'high': return '#fb923c';
    case 'medium': return '#fbbf24';
    case 'low': return '#60a5fa';
    default: return '#94a3b8';
  }
}
