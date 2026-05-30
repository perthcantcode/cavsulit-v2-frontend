import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { ShopCard } from '../ShopCard';
import { ProductCard } from '../ProductCard';
import { FadeIn } from '../ui/FadeIn';
import { TrendingSectionHeader } from './TrendingSectionHeader';
import { TrendingEmpty } from './TrendingEmpty';

function pickTrendingProducts(shops, limit = 6) {
  const items = [];
  for (const shop of shops) {
    for (const product of shop.products || []) {
      if (product.isAvailable === false) continue;
      items.push({ ...product, shop });
      if (items.length >= limit) return items;
    }
  }
  return items;
}

function TrendingSkeleton() {
  return (
    <div className="trending-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="trending-skeleton" />
      ))}
    </div>
  );
}

export function TrendingSections() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    api
      .get('/shops?sort=popular&limit=6')
      .then(({ data }) => {
        const list = data.shops || [];
        setShops(list);
        setProducts(pickTrendingProducts(list, 6));
      })
      .catch(() => {
        setShops([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .get('/wishlist')
      .then(({ data }) => setSaved(new Set(data.map((i) => i.shopId))))
      .catch(() => {});
  }, [user]);

  const handleSaveToggle = (id, isSaved) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <>
      <section className="trending-section" aria-labelledby="trending-shops-title">
        <div className="trending-section-inner">
          <FadeIn>
            <TrendingSectionHeader
              label="Community"
              title="Trending on campus."
              subline="Real shops from real CvSU students."
              browseTo="/browse?sort=popular"
            />
          </FadeIn>

          {loading ? (
            <TrendingSkeleton />
          ) : shops.length === 0 ? (
            <TrendingEmpty type="shops" />
          ) : (
            <div className="trending-grid">
              {shops.map((shop, i) => (
                <FadeIn key={shop.id} delay={i * 50}>
                  <ShopCard
                    shop={shop}
                    saved={saved.has(shop.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                </FadeIn>
              ))}
            </div>
          )}

          <Link
            to="/browse?sort=popular"
            className="trending-section-link-mobile btn-secondary"
          >
            Browse all shops
          </Link>
        </div>
      </section>

      <section
        className="trending-section trending-section--alt"
        aria-labelledby="trending-products-title"
      >
        <div className="trending-section-inner">
          <FadeIn>
            <TrendingSectionHeader
              label="Community"
              title="Trending products."
              subline="Hot picks from campus shops."
              browseTo="/browse?sort=popular"
            />
          </FadeIn>

          {loading ? (
            <TrendingSkeleton />
          ) : products.length === 0 ? (
            <TrendingEmpty type="products" />
          ) : (
            <div className="trending-grid">
              {products.map((item, i) => (
                <FadeIn key={`${item.shop.id}-${item.id}`} delay={i * 50}>
                  <ProductCard product={item} shop={item.shop} />
                </FadeIn>
              ))}
            </div>
          )}

          <Link
            to="/browse?sort=popular"
            className="trending-section-link-mobile btn-secondary"
          >
            Browse all products
          </Link>
        </div>
      </section>
    </>
  );
}
