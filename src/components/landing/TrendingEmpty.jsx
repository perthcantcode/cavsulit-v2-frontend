import { Link } from 'react-router-dom';
import { Store, Package } from 'lucide-react';

export function TrendingEmpty({ type = 'shops' }) {
  const isShops = type === 'shops';
  const Icon = isShops ? Store : Package;

  return (
    <div className="trending-empty">
      <div className="trending-empty-icon" aria-hidden>
        <Icon size={28} strokeWidth={2.25} color="#1a1a1a" />
      </div>
      <p className="trending-empty-text">
        {isShops
          ? 'No shops yet. Be the first to post!'
          : 'No products yet. Be the first to list!'}
      </p>
      <Link to={isShops ? '/post-shop' : '/browse'} className="btn-secondary text-sm mt-4">
        {isShops ? 'Post a shop' : 'Browse shops'}
      </Link>
    </div>
  );
}
