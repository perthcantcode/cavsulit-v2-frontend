import { Link } from 'react-router-dom';
import { photoUrl, fmt } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export function ProductCard({ product, shop }) {
  const shopId = shop?.id ?? product.shopId;
  const img =
    product.image
      ? photoUrl(product.image)
      : shop?.photos?.[0]
        ? photoUrl(shop.photos[0])
        : null;

  return (
    <Link to={`/shop/${shopId}`} className="product-card group">
      <div className="product-card-media">
        {img ? (
          <img src={img} alt={product.name} loading="lazy" className="product-card-img" />
        ) : (
          <div className="product-card-placeholder">
            <CategoryIcon category={shop?.category || 'other'} size={28} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">₱{fmt(parseFloat(product.price) || 0)}</p>
        {shop?.name && <p className="product-card-shop">{shop.name}</p>}
      </div>

      <div className="product-card-accent" aria-hidden />
    </Link>
  );
}
