import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Eye,
  MessageCircle,
  Heart,
  ShoppingBag,
  Calendar,
  ArrowLeft,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, photoUrl, formatCampusLabel } from '../utils/helpers';
import { CategoryIcon, formatCategory } from '../components/CategoryIcon';
import { SellerSocialLinks } from '../components/SellerSocialLinks';
import { Avatar } from '../components/Avatar';
import { ShopLogo } from '../components/ShopLogo';

function ImageCarousel({ imgs, shopName, category }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [imgs?.length]);

  if (!imgs?.length) {
    return (
      <div className="shop-carousel-empty">
        <CategoryIcon category={category || 'other'} size={48} strokeWidth={2} />
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);

  return (
    <div className="shop-carousel">
      <div className="shop-carousel-viewport">
        <img
          src={imgs[idx]}
          alt={`${shopName} ${idx + 1}`}
          className="shop-carousel-image"
        />
      </div>
      {imgs.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="shop-carousel-btn shop-carousel-btn--prev"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            className="shop-carousel-btn shop-carousel-btn--next"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
          <span className="shop-carousel-count">
            {idx + 1} / {imgs.length}
          </span>
          <div className="shop-carousel-dots">
            {imgs.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`shop-carousel-dot${i === idx ? ' is-active' : ''}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ShopDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('info');
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [preItems, setPreItems] = useState('');
  const [preTime, setPreTime] = useState('');
  const [preLocation, setPreLocation] = useState('');
  const [preSuccess, setPreSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/shops/${id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setShop(data);
        if (typeof data.isSaved === 'boolean') setSaved(data.isSaved);
        if (data.locationDesc) setPreLocation(data.locationDesc);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!user || !id) {
      if (!user) setSaved(false);
      return;
    }
    api
      .get(`/wishlist/check/${id}`)
      .then(({ data }) => setSaved(Boolean(data.saved)))
      .catch(() => {});
  }, [user?.id, id]);

  const toggleSave = async () => {
    if (!user) return navigate('/login');
    const { data } = await api.post(`/wishlist/${id}`);
    setSaved(data.saved);
  };

  const trackProfileClick = () => {
    if (!user || user.id === shop?.seller?.id) return;
    api.post('/analytics/track', { shopId: id, type: 'click' }).catch(() => {});
  };

  const messageShop = () => {
    if (!user) return navigate('/login');
    trackProfileClick();
    navigate(`/messages?to=${shop.seller?.id}&shopId=${id}`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const { data } = await api.post('/reviews', {
        shopId: id,
        stars: reviewStars,
        comment: reviewComment,
      });
      setShop((s) => ({ ...s, reviews: [data, ...(s.reviews || [])] }));
      setReviewComment('');
      setTab('reviews');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitPreorder = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!preItems.trim() || !shop.seller?.id) return;
    if (isOwner) return;
    setSubmitting(true);
    try {
      const locationNote = preLocation.trim() || shop.locationDesc || shop.college || 'TBD';
      await api.post('/preorders', {
        shopId: id,
        items: [{ name: preItems.trim(), qty: 1 }],
        pickupTime: preTime,
        locationNote: locationNote,
      });

      setPreSuccess(true);
      setTimeout(() => {
        navigate(`/messages?to=${shop.seller.id}&shopId=${id}`);
      }, 1200);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending pre-order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="shop-carousel-empty animate-pulse" style={{ minHeight: '14rem' }} />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="page-container text-center py-20 [color:var(--text-muted)]">
        Listing not found.
      </div>
    );
  }

  const badge = badgeLabel(shop.seller?.badgeLevel);
  const imgs = shop.photos?.map((p) => photoUrl(p)).filter(Boolean);
  const product = shop.products?.[0];
  const isOwner = user && shop.seller?.id === user.id;
  const gcashQrSrc = shop.gcashQr ? photoUrl(shop.gcashQr) : null;

  return (
    <div className="page-container">
      <Link to="/browse" className="btn-ghost mb-4 inline-flex">
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      <div className="shop-detail-layout">
        <div className="shop-detail-main">
          <ImageCarousel imgs={imgs} shopName={shop.name} category={shop.category} />

          <div className="shop-tabs" role="tablist">
            {[
              { id: 'info', label: 'Info' },
              {
                id: 'reviews',
                label: `Reviews${shop.reviews?.length ? ` (${shop.reviews.length})` : ''}`,
              },
              { id: 'preorder', label: 'Pre-Order' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`shop-tab${tab === t.id ? ' is-active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="shop-detail-tab-panel">
            {tab === 'info' && (
              <div className="card shop-detail-panel p-5 shop-detail-panel-fill">
                <p className="text-sm [color:var(--text-muted)] leading-relaxed m-0">
                  {shop.description || 'No description provided.'}
                </p>
                {(shop.gcashNumber || gcashQrSrc) && (
                  <div className="shop-payment-box mt-4">
                    <h2 className="shop-store-section-title">Payment</h2>
                    {shop.gcashNumber && (
                      <p className="m-0 text-sm">
                        GCash: <strong>{shop.gcashNumber}</strong>
                      </p>
                    )}
                    {gcashQrSrc && (
                      <img src={gcashQrSrc} alt="GCash QR" className="shop-gcash-qr" />
                    )}
                    <p className="form-pickup-note m-0 mt-2">Pick-up on campus only.</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="shop-detail-reviews shop-detail-panel-fill">
                {user && (
                  <div className="card shop-detail-panel p-5">
                    <h2 className="font-bold text-sm mb-3">Leave a Review</h2>
                    <form onSubmit={submitReview} className="form-stack">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewStars(n)}
                            className={`text-2xl${n <= reviewStars ? ' text-yellow-400' : ' text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        className="input resize-none w-full box-border"
                        placeholder="Share your experience..."
                      />
                      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                        <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
                {!shop.reviews?.length ? (
                  <p className="text-center py-8 text-sm [color:var(--text-muted)]">No reviews yet.</p>
                ) : (
                  shop.reviews.map((r) => (
                    <div key={r.id} className="card shop-detail-panel p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar user={r.reviewer} size={28} />
                        <p className="font-semibold text-sm m-0">{r.reviewer?.fullName}</p>
                      </div>
                      <p className="text-yellow-400 text-sm my-1">
                        {'★'.repeat(r.stars)}
                        {'☆'.repeat(5 - r.stars)}
                      </p>
                      <p className="text-sm [color:var(--text-muted)] m-0">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'preorder' && (
              <div className="card shop-detail-panel p-5 shop-detail-panel-fill">
                <h2 className="font-bold text-sm mb-4">Pre-Order</h2>
                {isOwner ? (
                  <div className="shop-preorder-owner">
                    <p className="text-sm m-0 mb-2">
                      Buyers submit pre-orders here. Each request is sent to your <strong>Messages</strong> inbox
                      as a formatted card.
                    </p>
                    <p className="form-pickup-note m-0 mb-4">
                      You cannot pre-order your own listing — use a buyer account to test, or wait for incoming
                      orders.
                    </p>
                    <Link to="/messages" className="btn-primary w-full justify-center">
                      <MessageCircle size={16} /> Open Messages Inbox
                    </Link>
                  </div>
                ) : preSuccess ? (
                  <div className="shop-preorder-success">
                    <p className="text-sm m-0 mb-3">Pre-order sent! The seller was notified in Messages.</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/messages?to=${shop.seller?.id}&shopId=${id}`)}
                      className="btn-primary w-full justify-center"
                    >
                      <MessageCircle size={16} /> Open Messages
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitPreorder} className="form-stack">
                    <div className="form-field">
                      <label>Order details *</label>
                      <textarea
                        value={preItems}
                        onChange={(e) => setPreItems(e.target.value)}
                        required
                        rows={3}
                        className="input resize-none"
                        placeholder="What do you want to order?"
                      />
                    </div>
                    <div className="form-field">
                      <label>Pickup time</label>
                      <input
                        type="datetime-local"
                        value={preTime}
                        onChange={(e) => setPreTime(e.target.value)}
                        className="input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Pickup location</label>
                      <input
                        value={preLocation}
                        onChange={(e) => setPreLocation(e.target.value)}
                        placeholder={shop.locationDesc || shop.college || 'Near campus...'}
                        className="input"
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      <ShoppingBag size={16} /> {submitting ? 'Sending...' : 'Send Pre-Order'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="shop-detail-sidebar">
          <div className="card p-5 shop-detail-panel shop-detail-sidebar-summary">
            <div className="shop-detail-brand">
              <ShopLogo shop={shop} size={56} />
              <div className="flex-1 min-w-0">
                <h1 className="shop-detail-heading m-0">{shop.name}</h1>
              </div>
              <button
                type="button"
                onClick={toggleSave}
                className="shop-save-btn"
                aria-label={saved ? 'Unsave' : 'Save'}
              >
                <Heart
                  size={16}
                  className={saved ? 'fill-[var(--green-neon)] text-[var(--green-forest)]' : ''}
                />
              </button>
            </div>
            {product && (
              <p className="shop-detail-price">₱{parseFloat(product.price).toFixed(2)}</p>
            )}
            <div className="shop-detail-meta-row">
              {badge && <span className={badge.cls}>{badge.label}</span>}
              <span className="shop-campus-chip">{formatCampusLabel(shop)}</span>
            </div>
            <ul className="shop-info-grid">
              <li>
                <MapPin size={14} />
                <span>{shop.locationDesc || shop.college || 'On campus'}</span>
              </li>
              <li>
                <Eye size={14} />
                <span>{shop.views} views</span>
              </li>
              {shop.availableDate ? (
                <li>
                  <Calendar size={14} />
                  <span>{shop.availableDate}</span>
                </li>
              ) : (
                <li className="shop-info-grid-spacer" aria-hidden />
              )}
              <li>
                <CategoryIcon category={shop.category} size={14} />
                <span className="capitalize">{formatCategory(shop.category)}</span>
              </li>
            </ul>
            <div className="shop-info-actions">
              <button type="button" onClick={messageShop} className="btn-primary">
                <MessageCircle size={16} /> Message Seller
              </button>
              <button type="button" onClick={() => setTab('preorder')} className="btn-secondary">
                <ShoppingBag size={16} /> Pre-Order
              </button>
            </div>
          </div>

          {shop.seller && (
            <div className="card shop-detail-panel shop-seller-card">
              <h2 className="font-bold text-sm m-0 mb-2">Seller</h2>
              <div className="shop-seller-head">
                <Avatar user={shop.seller} size={48} />
                <div>
                  <p className="m-0 font-semibold text-sm">{shop.seller.fullName}</p>
                  <p className="m-0 mt-1 text-xs [color:var(--text-muted)]">{shop.seller.department}</p>
                </div>
              </div>
              <dl className="shop-seller-details m-0">
                {shop.seller.contactNumber && (
                  <div className="shop-seller-detail-row">
                    <dt>Contact</dt>
                    <dd>
                      {shop.seller.contactNumber}
                      {!isOwner && shop.seller.contactNumber.includes('*') && (
                        <span className="shop-seller-privacy-note">Partially hidden</span>
                      )}
                    </dd>
                  </div>
                )}
                {shop.seller.studentId && (
                  <div className="shop-seller-detail-row">
                    <dt>Student ID</dt>
                    <dd>
                      {shop.seller.studentId}
                      {!isOwner && shop.seller.studentId.includes('*') && (
                        <span className="shop-seller-privacy-note">Partially hidden</span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="shop-seller-social-section">
                <span className="shop-seller-social-label">Connect</span>
                <SellerSocialLinks
                  socialLinks={shop.seller.socialLinks}
                  onMessage={messageShop}
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
