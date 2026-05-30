import { Facebook, Instagram } from 'lucide-react';

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'x', label: 'X', Icon: XIcon },
];

export function SellerSocialLinks({ socialLinks, className = '', onMessage }) {
  const normalized = {
    facebook: socialLinks?.facebook,
    instagram: socialLinks?.instagram,
    x: socialLinks?.x || socialLinks?.twitter || socialLinks?.messenger,
  };
  const links = SOCIALS.filter(({ key }) => normalized[key]?.trim());

  if (!links.length) {
    return (
      <div className={`shop-seller-social-empty-wrap${className ? ` ${className}` : ''}`}>
        <p className="shop-seller-social-empty m-0">
          No social links yet — use Message Seller to reach this shop.
        </p>
        {onMessage && (
          <button type="button" onClick={onMessage} className="btn-secondary shop-seller-message-fallback">
            Message Seller
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`shop-seller-socials${className ? ` ${className}` : ''}`}>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={normalized[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="shop-seller-social-link"
          aria-label={label}
        >
          <Icon size={16} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
