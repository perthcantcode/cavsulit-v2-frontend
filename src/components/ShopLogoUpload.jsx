import { Upload, X } from 'lucide-react';
import { ShopLogo, ShopLogoPlaceholder } from './ShopLogo';

/**
 * Single shop profile image (per listing), separate from user account photo.
 */
export function ShopLogoUpload({ preview, onChange, onRemove, shopName = '' }) {
  return (
    <div className="shop-logo-upload">
      <div className="shop-logo-upload-preview">
        {preview ? (
          <>
            <img src={preview} alt="" className="shop-logo shop-logo--img shop-logo--round" />
            <button type="button" className="shop-logo-upload-remove" onClick={onRemove} aria-label="Remove shop logo">
              <X size={14} />
            </button>
          </>
        ) : (
          <ShopLogoPlaceholder size={96} className="shop-logo--round" />
        )}
      </div>
      <div className="shop-logo-upload-meta">
        <label className="btn-secondary shop-logo-upload-btn">
          <Upload size={16} />
          {preview ? 'Change shop photo' : 'Upload shop photo'}
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
        <p className="form-photo-notice shop-logo-upload-notice m-0">
          <strong>Shop photo tip:</strong> Use a <strong>square 1:1</strong> image (e.g.{' '}
          <strong>400×400</strong> or <strong>512×512</strong> px). This is your listing&apos;s own logo — different
          from your account profile photo{shopName ? ` for “${shopName}”` : ''}. Center your logo or product; wide
          crops may be trimmed in cards.
        </p>
      </div>
    </div>
  );
}
