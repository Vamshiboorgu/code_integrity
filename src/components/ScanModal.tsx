import React from 'react';
import { X } from 'lucide-react';
import { InputSection, JiraConfig } from './InputSection';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (repoUrl: string, branch: string, zipFile: File | null, reqFile: File | null, token: string, jira: JiraConfig | null, cr: string, tcFile?: File | null) => void;
  jiraOpen?: boolean;
}

export const ScanModal: React.FC<Props> = ({ open, onClose, onSubmit, jiraOpen }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(5,5,12,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 860, maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
        borderRadius: 20, boxShadow: '0 40px 90px rgba(0,0,0,0.7)', position: 'relative',
        animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 2,
          width: 32, height: 32, borderRadius: 9, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={16} />
        </button>
        <div style={{ padding: 20 }}>
          <InputSection initialJiraOpen={jiraOpen} onSubmit={(...args) => { onSubmit(...args); onClose(); }} />
        </div>
      </div>
    </div>
  );
};
