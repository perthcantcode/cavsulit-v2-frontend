import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Heart, Star } from 'lucide-react';
import { badgeLabel, CAT_ICONS, photoUrl, categoryColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export function ShopCard({ shop, saved = false, onSaveToggle }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const badge     = badgeLabel(shop.seller?.badgeLevel);
  const img       = shop.photos?.[0] ? photoUrl(shop.photos[0]) : null;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/wishlist/${shop.id}`);
      onSaveToggle?.(shop.id, data.saved);
    } catch {}
  };

  const minPrice = shop.products?.length
    ? Math.min(...shop.products.map(p => parseFloat(p.price)))
    : null;

  return (
    <Link
      to={`/shop/${shop.id}`}
      className="block group overflow-hidden rounded-2xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px) rotate(0.3deg)';
        e.currentTarget.style.boxShadow = '0 12px 40px var(--green-glow)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Image */}
      <div className="shop-img-wrap relative h-40 overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
        {img ? (
          <img
            src={img}
            alt={shop.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">{CAT_ICONS[shop.category] || '🛒'}</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleSave}
          onMouseDown={e => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(8px)',
          }}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={13}
            style={{
              color: saved ? 'var(--accent)' : 'var(--text-muted)',
              fill: saved ? 'var(--accent)' : 'none',
            }}
          />
        </button>

        {/* Location overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
        >
          <div className="text-white text-[10px] font-medium flex items-center gap-1 opacity-90">
            <MapPin size={9} /> {shop.college}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <span
            className="font-bold text-sm leading-tight line-clamp-1"
            style={{ color: 'var(--text)' }}
          >
            {shop.name}
          </span>
          {badge && (
            <span className={badge.cls} style={{ fontSize: '9px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {badge.label}
            </span>
          )}
        </div>

        {shop.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{shop.avgRating}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-light)' }}>({shop.reviewCount})</span>
          </div>
        )}

        {minPrice !== null && (
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--accent)' }}>
            From ₱{minPrice.toFixed(0)}
          </div>
        )}

        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
            style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}
          >
            {CAT_ICONS[shop.category]} {shop.category?.replace('_', ' ')}
          </span>
          <span
            className="text-[10px] flex items-center gap-0.5"
            style={{ color: 'var(--text-light)' }}
          >
            <Eye size={9} /> {shop.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
