import React from 'react';

export function GlassCard({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
