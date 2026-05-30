import { photoUrl } from '../utils/helpers';

function StorefrontIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function ShopLogoPlaceholder({ size = 48, className = '' }) {
  const iconSize = Math.round(size * 0.45);
  return (
    <div
      className={`shop-logo shop-logo--placeholder${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <StorefrontIcon size={iconSize} />
    </div>
  );
}

/**
 * Per-listing shop identity (not the seller's personal profile photo).
 */
export function ShopLogo({
  shop,
  logo,
  name,
  size = 48,
  className = '',
  rounded = true,
  /** When true, uses first product photo if no shopLogo (My Shop list) */
  useCoverFallback = false,
  fallbackPhoto,
}) {
  const cover = fallbackPhoto ?? (useCoverFallback ? shop?.photos?.[0] : null);
  const src = logo ?? shop?.shopLogo ?? cover;
  const label = name ?? shop?.name ?? 'Shop';
  const imgSrc = src ? photoUrl(src) : null;
  const roundClass = rounded ? ' shop-logo--round' : '';

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${label} logo`}
        className={`shop-logo shop-logo--img${roundClass}${className ? ` ${className}` : ''}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return <ShopLogoPlaceholder size={size} className={`${roundClass}${className}`.trim()} />;
}
