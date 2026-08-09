/** Shown while Firebase auth state is resolving — prevents blank white screen */
export function AuthBootLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'var(--bg)' }}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-8 h-8 border-4 [border-color:#1a1a1a] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Loading CavSulit…
      </p>
    </div>
  );
}
