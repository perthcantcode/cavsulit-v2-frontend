import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, BarChart2, TrendingUp, MessageCircle, Pencil, Store } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShopLogo } from '../components/ShopLogo';
import { EmptyStateIcon } from '../components/EmptyStateIcon';
import { formatShopCardLocation } from '../utils/helpers';

const ICON = { size: 16, strokeWidth: 2.25 };

function AnalyticsPanel({ shopId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/analytics/${shopId}`)
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [shopId]);

  if (loading) {
    return (
      <div className="my-shop-analytics-grid">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="my-shop-stat-card my-shop-stat-card--skeleton" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-xs [color:var(--text-muted)] m-0">Analytics unavailable</p>;
  }

  const stats = [
    { label: 'Total Views', val: data.totalViews ?? 0, Icon: Eye },
    { label: 'Profile Clicks', val: data.totalClicks ?? 0, Icon: TrendingUp },
    { label: 'Messages', val: data.totalMessages ?? 0, Icon: MessageCircle },
  ];

  return (
    <div className="my-shop-analytics-grid">
      {stats.map(({ label, val, Icon }) => (
        <div key={label} className="my-shop-stat-card">
          <span className="my-shop-stat-icon" aria-hidden>
            <Icon {...ICON} />
          </span>
          <span className="my-shop-stat-value">{val}</span>
          <span className="my-shop-stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function MyShop() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get('/shops/mine').then(({ data }) => setShops(data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="page-container text-center py-20">
        <EmptyStateIcon icon={Store} />
        <h2 className="font-bold text-xl [color:var(--text)] mb-2 mt-4">Login Required</h2>
        <Link to="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    );
  }

  const handleDelete = async (id) => {
    const target = shops.find((s) => s.id === id);
    const label = target?.name ? `"${target.name}"` : 'this listing';
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/shops/${id}`);
      setShops((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete shop. Try again.';
      alert(
        msg.includes('foreign key')
          ? 'Shop could not be deleted — please refresh and try again.'
          : msg,
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="font-bold text-2xl [color:var(--text)]">My Listings</h1>
          <p className="text-sm [color:var(--text-muted)] mt-1">
            Each post is one product. Use New Listing for another item.
          </p>
        </div>
        <Link to="/post-shop" className="btn-primary">
          <Plus size={16} strokeWidth={2.25} /> New Listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="my-shop-row-skeleton" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 card">
          <EmptyStateIcon icon={Store} />
          <h2 className="font-bold text-lg [color:var(--text)] mb-2 mt-4">No shops yet</h2>
          <p className="text-sm [color:var(--text-muted)] mb-6">
            Post your first shop and start reaching campus buyers!
          </p>
          <Link to="/post-shop" className="btn-primary">
            <Plus size={16} strokeWidth={2.25} /> Post Your First Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map((shop) => {
            const price = shop.products?.[0]?.price;
            const loc = formatShopCardLocation(shop);
            const avgRating = shop.reviews?.length
              ? (shop.reviews.reduce((a, r) => a + r.stars, 0) / shop.reviews.length).toFixed(1)
              : null;

            return (
              <div key={shop.id} className="card my-shop-row overflow-hidden">
                <div className="my-shop-row-main">
                  <div className="my-shop-row-logo flex-shrink-0">
                    <ShopLogo shop={shop} size={64} useCoverFallback className="my-shop-listing-thumb" />
                  </div>
                  <div className="my-shop-row-info flex-1 min-w-0">
                    <div className="font-bold text-base [color:var(--text)] truncate">{shop.name}</div>
                    <div className="text-xs [color:var(--text-muted)] mt-0.5">
                      {price != null && <>₱{parseFloat(price).toFixed(2)} · </>}
                      {shop.views ?? 0} views
                      {avgRating && <> · ★ {avgRating}</>}
                    </div>
                    <div className="my-shop-row-location">
                      <span className={`shop-card-campus-tag shop-card-campus-tag--${loc.campusTag === 'Satellite' ? 'satellite' : 'main'}`}>
                        {loc.campusTag}
                      </span>
                      {loc.campusDetail && (
                        <span className="shop-card-campus-detail">{loc.campusDetail}</span>
                      )}
                      {loc.college && <span className="shop-card-college">{loc.college}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
                      <span
                        className={`my-shop-status-pill${shop.isActive ? ' is-active' : ' is-inactive'}`}
                      >
                        {shop.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="my-shop-category-pill capitalize">
                        {shop.category?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="my-shop-row-actions">
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === shop.id ? null : shop.id)}
                      className={`my-shop-action-btn${expanded === shop.id ? ' is-active' : ''}`}
                    >
                      <BarChart2 size={14} strokeWidth={2.25} /> Analytics
                    </button>
                    <Link to={`/shop/${shop.id}`} className="my-shop-action-btn">
                      <Eye size={14} strokeWidth={2.25} /> View
                    </Link>
                    <Link to={`/shop/${shop.id}/edit`} className="my-shop-action-btn">
                      <Pencil size={14} strokeWidth={2.25} /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(shop.id)}
                      disabled={deleting === shop.id}
                      className="my-shop-delete-btn"
                      aria-label="Delete listing"
                    >
                      <Trash2 size={14} strokeWidth={2.25} />
                    </button>
                  </div>
                </div>

                {expanded === shop.id && (
                  <div className="my-shop-analytics-panel">
                    <AnalyticsPanel shopId={shop.id} />
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
