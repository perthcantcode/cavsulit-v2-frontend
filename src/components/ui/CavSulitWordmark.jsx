/**
 * CavSulit wordmark — Press Start 2P on C & S only; rest in Space Grotesk.
 * @param {'nav' | 'hero'} variant
 */
export function CavSulitWordmark({ variant = 'nav', className = '' }) {
  const isHero = variant === 'hero';

  return (
    <span
      className={`cav-wordmark ${isHero ? 'cav-wordmark-hero' : 'cav-wordmark-nav'} ${className}`}
      aria-label="CavSulit"
    >
      <span className="cav-wordmark-inner">
        <span className="cav-pixel cav-pixel-c">C</span>
        <span className="cav-sans">av</span>
        <span className="cav-pixel cav-pixel-s">S</span>
        <span className="cav-sans">ulit</span>
      </span>
    </span>
  );
}
