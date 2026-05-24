import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, BarChart2, TrendingUp, MessageCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CAT_ICONS, photoUrl } from '../utils/helpers';

function AnalyticsPanel({ shopId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/${shopId}`)
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [shopId]);

  if (loading) return <div className="h-32 bg-white/5 rounded-xl animate-pulse"/>;
  if (!data)   return <div className="text-xs [color:var(--text)]/50 p-4">Analytics unavailable</div>;

  const maxViews = Math.max(...(data.weekly?.map(w => parseInt(w.count)) || [1]), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Views',    val: data.totalViews,    icon: <Eye size={16}/> },
          { label: 'Profile Clicks', val: data.totalClicks,   icon: <TrendingUp size={16}/> },
          { label: 'Messages',       val: data.totalMessages, icon: <MessageCircle size={16}/> },
        ].map((m, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <div className="text-cav-accent mb-1 flex justify-center">{m.icon}</div>
            <div className="font-bold text-xl [color:var(--text)]">{m.val}</div>
            <div className="text-xs [color:var(--text)]/50">{m.label}</div>
          </div>
        ))}
      </div>

      {data.weekly && (
        <div>
          <div className="text-xs font-bold [color:var(--text)]/80 mb-2">Views — Last 7 Days</div>
          <div className="flex items-end gap-1 h-20">
            {data.weekly.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-cav-accent rounded-t-sm transition-all"
                  style={{ height: `${(parseInt(w.count, 10) / maxViews) * 100}%`, minHeight: 4 }}/>
                <div className="text-[9px] [color:var(--text)]/40">{new Date(w.date).toLocaleDateString('en', { weekday: 'short' })}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MyShop() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [shops,    setShops]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get('/shops/mine').then(({ data }) => setShops(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-bold text-xl [color:var(--text)] mb-2">Login Required</h2>
      <Link to="/login" className="btn-primary mt-4">Login</Link>
    </div>
  );

  const handleDelete = async (id) => {
    if (!confirm('Delete this shop? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/shops/${id}`);
      setShops(s => s.filter(x => x.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="font-bold text-2xl [color:var(--text)]">My Shops</h1>
        </div>
        <Link to="/post-shop" className="btn-primary"><Plus size={16}/>New Shop</Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"/>)}</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">🏪</div>
          <h2 className="font-display font-bold text-lg text-cav-green-dark mb-2">No shops yet</h2>
          <p className="text-sm text-cav-text-muted mb-6">Post your first shop and start reaching campus buyers!</p>
          <Link to="/post-shop" className="btn-primary"><Plus size={16}/>Post Your First Shop</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map(shop => {
            const img = shop.photos?.[0] ? photoUrl(shop.photos[0]) : null;
            const avgRating = shop.reviews?.length
              ? (shop.reviews.reduce((a, r) => a + r.stars, 0) / shop.reviews.length).toFixed(1)
              : null;

            return (
              <div key={shop.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl bg-cav-green-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {img
                      ? <img src={img} alt={shop.name} className="w-full h-full object-cover"/>
                      : <span className="text-2xl">{CAT_ICONS[shop.category] || '🛒'}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-cav-green-dark truncate">{shop.name}</div>
                    <div className="text-xs text-cav-text-muted mt-0.5">
                      📍 {shop.college} &nbsp;·&nbsp; 👁️ {shop.views} views
                      {avgRating && <> &nbsp;·&nbsp; ⭐ {avgRating}</>}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {shop.isActive ? '● Active' : '● Inactive'}
                      </span>
                      <span className="text-xs text-cav-text-muted capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                        {shop.category?.replace('_',' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpanded(expanded === shop.id ? null : shop.id)}
                      className="btn-ghost text-xs py-1.5 px-3"><BarChart2 size={13}/>Analytics</button>
                    <Link to={`/shop/${shop.id}`} className="btn-ghost text-xs py-1.5 px-3"><Eye size={13}/>View</Link>
                    <Link to={`/shop/${shop.id}/edit`} className="btn-ghost text-xs py-1.5 px-3">✏️ Edit</Link>
                    <button onClick={() => handleDelete(shop.id)} disabled={deleting === shop.id}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>

                {expanded === shop.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <AnalyticsPanel shopId={shop.id}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
