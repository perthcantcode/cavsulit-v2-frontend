export function EmptyStateIcon({ icon: Icon, size = 48, strokeWidth = 2 }) {
  return (
    <div className="empty-state-icon" aria-hidden>
      <Icon size={size} strokeWidth={strokeWidth} />
    </div>
  );
}
