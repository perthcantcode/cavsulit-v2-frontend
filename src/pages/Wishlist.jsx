import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, photoUrl, CAT_ICONS } from '../utils/helpers';

export function Wishlist() {
  const { user }  = useAuth();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/wishlist').then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, [user]);

  const remove = async (shopId) => {
    await api.post(`/wishlist/${shopId}`);
    setItems(i => i.filter(x => x.shopId !== shopId));
  };

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">🔖</div>
      <h2 className="font-display font-bold text-xl text-cav-green-dark mb-2">Login to view your wishlist</h2>
      <Link to="/login" className="btn-primary mt-4">Login</Link>
    </div>
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <span className="section-tag">Saved</span>
        <h1 className="font-display font-bold text-2xl text-cav-green-dark">My Wishlist</h1>
        <p className="text-sm text-cav-text-muted mt-1">{items.length} saved shop{items.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_,i) => <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse"/>)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 card">
          <Heart size={48} className="mx-auto mb-4 text-gray-200"/>
          <h2 className="font-display font-bold text-lg text-cav-green-dark mb-2">No saved shops yet</h2>
          <p className="text-sm text-cav-text-muted mb-6">Tap the 🤍 on any shop card to save it here.</p>
          <Link to="/browse" className="btn-primary"><ArrowRight size={16}/>Browse Shops</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => {
            const shop  = item.shop;
            const badge = badgeLabel(shop?.seller?.badgeLevel);
            const img   = shop?.photos?.[0] ? photoUrl(shop.photos[0]) : null;
            const minP  = shop?.products?.length ? Math.min(...shop.products.map(p => parseFloat(p.price))) : null;

            return (
              <div key={item.id} className="card overflow-hidden group">
                <div className="relative h-36 bg-cav-green-accent/10 flex items-center justify-center overflow-hidden">
                  {img
                    ? <img src={img} alt={shop?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    : <span className="text-4xl">{CAT_ICONS[shop?.category] || '🛒'}</span>
                  }
                  <button onClick={() => remove(item.shopId)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                    <Heart size={14} className="text-red-500 fill-red-500"/>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1.5">
                    <div className="text-white text-[9px] font-semibold flex items-center gap-1">
                      <MapPin size={9}/>{shop?.college}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-display font-bold text-sm text-cav-green-dark line-clamp-1">{shop?.name}</span>
                    {badge && <span className={`${badge.cls} text-[9px]`}>{badge.label}</span>}
                  </div>
                  {minP && <div className="text-xs font-bold text-cav-green mb-2">From ₱{minP.toFixed(2)}</div>}
                  <Link to={`/shop/${item.shopId}`} className="btn-primary w-full justify-center text-xs py-2">
                    View Shop <ArrowRight size={11}/>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
