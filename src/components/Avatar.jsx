import { photoUrl } from '../utils/helpers';

/**
 * User account avatar (navbar, profile, seller card, messages).
 * Separate from ShopLogo — each shop has its own logo.
 */
export function Avatar({ user, name, photo, size = 36, className = '' }) {
  const displayName = name || user?.fullName || '';
  const src = photo ?? user?.profilePhoto;
  const imgSrc = src ? photoUrl(src) : null;
  const px = typeof size === 'number' ? size : 36;
  const letterSize = Math.round(px * 0.42);
  const style = { width: px, height: px, fontSize: letterSize };

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={displayName || 'User'}
        className={`avatar avatar--img${className ? ` ${className}` : ''}`}
        style={style}
      />
    );
  }

  return (
    <span
      className={`avatar avatar--initials${className ? ` ${className}` : ''}`}
      style={style}
      aria-label={displayName || 'User'}
    >
      <span className="avatar__initial" aria-hidden="true">
        {displayName?.[0]?.toUpperCase() || '?'}
      </span>
    </span>
  );
}
