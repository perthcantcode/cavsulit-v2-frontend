import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, photoUrl, formatCampusLabel } from '../utils/helpers';
import { CategoryIcon } from '../components/CategoryIcon';
import { EmptyStateIcon } from '../components/EmptyStateIcon';

export function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/wishlist').then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, [user]);

  const remove = async (shopId) => {
    await api.post(`/wishlist/${shopId}`);
    setItems((i) => i.filter((x) => x.shopId !== shopId));
  };

  if (!user) {
    return (
      <div className="page-container text-center py-20">
        <EmptyStateIcon icon={Heart} />
        <h2 className="font-bold text-xl [color:var(--text)] mb-2 mt-4">Login to view your wishlist</h2>
        <Link to="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <span className="section-tag">Saved</span>
        <h1 className="font-bold text-2xl [color:var(--text)]">My Wishlist</h1>
        <p className="text-sm [color:var(--text-muted)] mt-1">
          {items.length} saved shop{items.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="wishlist-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="wishlist-card wishlist-card--skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 card">
          <EmptyStateIcon icon={Heart} />
          <h2 className="font-bold text-lg [color:var(--text)] mb-2 mt-4">No saved shops yet</h2>
          <p className="text-sm [color:var(--text-muted)] mb-6">Tap the heart on any shop card to save it here.</p>
          <Link to="/browse" className="btn-primary">
            <ArrowRight size={16} /> Browse Shops
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => {
            const shop = item.shop;
            const badge = badgeLabel(shop?.seller?.badgeLevel);
            const img = shop?.photos?.[0] ? photoUrl(shop.photos[0]) : null;
            const minP = shop?.products?.length
              ? Math.min(...shop.products.map((p) => parseFloat(p.price)))
              : null;

            return (
              <article key={item.id} className="wishlist-card card">
                <div className="wishlist-card-media">
                  {img ? (
                    <img src={img} alt={shop?.name} loading="lazy" className="wishlist-card-img" />
                  ) : (
                    <div className="wishlist-card-placeholder">
                      <CategoryIcon category={shop?.category || 'other'} size={32} strokeWidth={2} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.shopId)}
                    className="wishlist-card-heart"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={14} className="fill-[var(--green-neon)] text-[#1a1a1a]" />
                  </button>
                </div>

                <div className="wishlist-card-body">
                  <div className="wishlist-card-title-row">
                    <h3 className="wishlist-card-name">{shop?.name}</h3>
                    {badge && <span className={`${badge.cls} wishlist-card-badge`}>{badge.label}</span>}
                  </div>
                  <p className="wishlist-card-campus">
                    <MapPin size={11} />
                    {formatCampusLabel(shop)}
                    {shop?.college ? ` · ${shop.college}` : ''}
                  </p>
                  <p className="wishlist-card-price">{minP != null ? `From ₱${minP.toFixed(2)}` : '\u00a0'}</p>
                  <Link to={`/shop/${item.shopId}`} className="btn-primary wishlist-card-cta">
                    View Shop <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
