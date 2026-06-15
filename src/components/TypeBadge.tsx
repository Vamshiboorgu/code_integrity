import React from 'react';

export const TYPE_META: Record<string, { label: string; color: string }> = {
  EPIC:  { label: 'Epic',    color: '#A855F7' },
  FEAT:  { label: 'Feature', color: '#3B82F6' },
  STORY: { label: 'Story',   color: '#06B6D4' },
  REQ:   { label: 'Req',     color: '#7C5CFF' },
  NFR:   { label: 'NFR',     color: '#14B8A6' },
  BUG:   { label: 'Bug',     color: '#F43F5E' },
  TASK:  { label: 'Task',    color: '#F59E0B' },
};

export const TYPE_ORDER = ['EPIC', 'FEAT', 'STORY', 'REQ', 'NFR', 'BUG', 'TASK'];

export const TypeBadge: React.FC<{ type: string; size?: 'sm' | 'md' }> = ({ type, size = 'sm' }) => {
  const m = TYPE_META[type] || TYPE_META.REQ;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: size === 'sm' ? '0.5625rem' : '0.6875rem', fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: size === 'sm' ? '2px 6px' : '3px 8px', borderRadius: 5,
      color: m.color, background: `${m.color}1f`, border: `1px solid ${m.color}33`,
      lineHeight: 1.2, whiteSpace: 'nowrap',
    }}>
      {m.label}
    </span>
  );
};
