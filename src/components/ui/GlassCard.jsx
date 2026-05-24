import React from 'react';

export function GlassCard({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`glass ${className}`} {...props}>
      {children}
    </Tag>
  );
}
