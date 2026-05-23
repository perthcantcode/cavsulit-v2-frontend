import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Heart } from 'lucide-react';
import { badgeLabel, CAT_ICONS, photoUrl, stars, categoryColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export function ShopCard({ shop, saved = false, onSaveToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const badge    = badgeLabel(shop.seller?.badgeLevel);
  const img      = shop.photos?.[0] ? photoUrl(shop.photos[0]) : null;
  const catColor = categoryColor(shop.category);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/wishlist/${shop.id}`);
      onSaveToggle?.(shop.id, data.saved);
    } catch {}
  };

  return (
    <Link to={`/shop/${shop.id}`} className="card block group overflow-hidden hover:-translate-y-1 will-change-transform">
      <div className="relative h-40 bg-white/5 flex items-center justify-center overflow-hidden">
        {img
          ? <img src={img} alt={shop.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350 ease-smooth"/>
          : <span className="text-5xl">{CAT_ICONS[shop.category] || '🛒'}</span>
        }
        <button
          type="button"
          onClick={handleSave}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-8 h-8 glass rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={14} className={saved ? 'text-cav-accent fill-cav-accent' : 'text-white/50'}/>
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <div className="text-white text-[10px] font-semibold flex items-center gap-1">
            <MapPin size={10}/>{shop.college}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="font-bold text-sm text-white leading-tight line-clamp-1">{shop.name}</span>
          {badge && <span className={badge.cls} style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>{badge.label}</span>}
        </div>

        {shop.avgRating && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-400 text-xs">{stars(parseFloat(shop.avgRating))}</span>
            <span className="text-xs text-white/50">{shop.avgRating} ({shop.reviewCount})</span>
          </div>
        )}

        {shop.products?.length > 0 && (
          <div className="text-xs font-bold text-cav-accent mb-1">
            From ₱{Math.min(...shop.products.map((p) => parseFloat(p.price))).toFixed(2)}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${catColor}`}>
            {CAT_ICONS[shop.category]} {shop.category?.replace('_', ' ')}
          </span>
          <span className="text-[10px] text-white/50 flex items-center gap-0.5">
            <Eye size={10}/> {shop.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
