import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Heart } from 'lucide-react';
import { badgeLabel, photoUrl, formatShopCardLocation } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';
import { ShopLogo } from './ShopLogo';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export function ShopCard({ shop, saved = false, onSaveToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const badge = badgeLabel(shop.seller?.badgeLevel);
  const showBadge = badge && shop.seller?.badgeLevel !== 'cvsu';
  const loc = formatShopCardLocation(shop);
  const img = shop.photos?.[0] ? photoUrl(shop.photos[0]) : null;
  const price = shop.products?.[0]?.price;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(`/wishlist/${shop.id}`);
      onSaveToggle?.(shop.id, data.saved);
    } catch {
      /* ignore */
    }
  };

  return (
    <Link to={`/shop/${shop.id}`} className="shop-card group">
      <div className="shop-card-media">
        {img ? (
          <img src={img} alt={shop.name} loading="lazy" className="shop-card-img" />
        ) : (
          <div className="shop-card-placeholder">
            <CategoryIcon category={shop.category} size={28} strokeWidth={2} />
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          onMouseDown={(e) => e.stopPropagation()}
          className="shop-card-heart"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={14}
            style={{
              color: saved ? 'var(--green-neon)' : '#1a1a1a',
              fill: saved ? 'var(--green-neon)' : 'none',
            }}
          />
        </button>
      </div>

      <div className="shop-card-body">
        <div className="shop-card-title-row">
          <ShopLogo shop={shop} size={28} className="shop-card-logo" />
          <h3 className="shop-card-name">{shop.name}</h3>
          {showBadge && (
            <span className={badge.cls} style={{ fontSize: '10px', flexShrink: 0 }}>
              {badge.label}
            </span>
          )}
        </div>

        <div className="shop-card-middle">
          <p className="shop-card-price">
            {price != null ? `₱${parseFloat(price).toFixed(2)}` : '\u00a0'}
          </p>
        </div>

        <div className="shop-card-meta">
          <div className="shop-card-location">
            <MapPin size={12} strokeWidth={2.25} className="shop-card-location-pin" />
            <div className="shop-card-location-lines">
              <span
                className={`shop-card-campus-tag shop-card-campus-tag--${loc.campusTag === 'Satellite' ? 'satellite' : 'main'}`}
              >
                {loc.campusTag}
              </span>
              {loc.campusDetail && (
                <span className="shop-card-campus-detail" title={loc.campusDetail}>
                  {loc.campusDetail}
                </span>
              )}
              {loc.college && <span className="shop-card-college">{loc.college}</span>}
            </div>
          </div>
          <span className="shop-card-views">
            <Eye size={12} strokeWidth={2.25} />
            <span className="shop-card-meta-text">{shop.views ?? 0}</span>
          </span>
        </div>
      </div>

      <div className="shop-card-accent" aria-hidden />
    </Link>
  );
}
