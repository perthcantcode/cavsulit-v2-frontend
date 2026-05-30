import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft, Check } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatCategory } from '../components/CategoryIcon';
import { ListingFormFields } from '../components/ListingFormFields';
import { ShopLogoUpload } from '../components/ShopLogoUpload';
import { ShopLogo } from '../components/ShopLogo';

const STEPS = [
  { num: 1, label: 'Shop Info' },
  { num: 2, label: 'Images' },
  { num: 3, label: 'Review' },
];

function FormStepper({ step }) {
  return (
    <div className="form-stepper" aria-label={`Step ${step} of 3`}>
      {STEPS.map((s, i) => (
        <div key={s.num} style={{ display: 'contents' }}>
          <div
            className={`form-stepper-step${step === s.num ? ' is-active' : ''}${step > s.num ? ' is-done' : ''}`}
          >
            <span className="form-stepper-dot">{step > s.num ? '✓' : s.num}</span>
            <span className="form-stepper-label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <hr className={`form-stepper-line${step > s.num ? ' is-done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function PostShop() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [shopLogoFile, setShopLogoFile] = useState(null);
  const [shopLogoPreview, setShopLogoPreview] = useState(null);
  const [gcashQrFile, setGcashQrFile] = useState(null);
  const [gcashQrPreview, setGcashQrPreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    productPrice: '',
    category: 'other',
    college: 'Other',
    campusType: 'main',
    satelliteCampus: '',
    locationDesc: '',
    availableDate: '',
    gcashNumber: '',
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  if (!user) {
    return (
      <div className="page-container form-page text-center py-20">
        <h2 className="font-bold text-xl mb-2">Login Required</h2>
        <p className="[color:var(--text-muted)] mb-6">Log in to post a campus listing.</p>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files || []);
    const room = 5 - photos.length;
    const toAdd = files.slice(0, room);
    setPhotos((prev) => [...prev, ...toAdd].slice(0, 5));
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((prev) => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleShopLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShopLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setShopLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGcashQr = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGcashQrFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setGcashQrPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const goNext = () => {
    if (step === 1) {
      if (!form.name.trim()) return setError('Product / listing name is required');
      if (!form.productPrice || Number(form.productPrice) <= 0) {
        return setError('Price is required');
      }
      if (form.campusType === 'satellite' && !form.satelliteCampus.trim()) {
        return setError('Please specify which satellite campus');
      }
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.productPrice) {
      setError('Name and price are required');
      setStep(1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('productName', form.name.trim());
      fd.append('productPrice', form.productPrice);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('college', form.college);
      fd.append('campusType', form.campusType);
      if (form.campusType === 'satellite') {
        fd.append('satelliteCampus', form.satelliteCampus);
      }
      fd.append('locationDesc', form.locationDesc);
      if (form.availableDate) fd.append('availableDate', form.availableDate);
      if (form.gcashNumber) fd.append('gcashNumber', form.gcashNumber);
      photos.forEach((f) => fd.append('photos', f));
      if (shopLogoFile) fd.append('shopLogo', shopLogoFile);
      if (gcashQrFile) fd.append('gcashQr', gcashQrFile);

      const { data: shop } = await api.post('/shops', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/shop/${shop.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-page">
        <Link to="/browse" className="btn-ghost mb-4 inline-flex">
          <ArrowLeft size={16} /> Back
        </Link>

        <header className="form-page-header">
          <span className="section-tag">New Listing</span>
          <h1 className="font-bold text-2xl [color:var(--text)]">Post Your Shop</h1>
          <p className="text-sm [color:var(--text-muted)] mt-1">
            One post = one product. Post again for another item.
          </p>
          <FormStepper step={step} />
        </header>

        {error && (
          <div className="bg-red-50 border-2 border-red-600 text-red-700 text-sm px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="form-shell">
          {step === 1 && (
            <div className="card form-card">
              <h2 className="form-card-title">Listing info</h2>
              <ListingFormFields
                form={form}
                setForm={setForm}
                gcashQrPreview={gcashQrPreview}
                onGcashQr={handleGcashQr}
                onRemoveGcashQr={() => {
                  setGcashQrFile(null);
                  setGcashQrPreview(null);
                }}
              />
            </div>
          )}

          {step === 2 && (
            <>
            <div className="card form-card">
              <h2 className="form-card-title">Shop profile photo</h2>
              <p className="text-xs [color:var(--text-muted)] m-0 mb-4">
                Each listing has its own shop photo — separate from your account profile on My Profile.
              </p>
              <ShopLogoUpload
                preview={shopLogoPreview}
                onChange={handleShopLogo}
                onRemove={() => {
                  setShopLogoFile(null);
                  setShopLogoPreview(null);
                }}
                shopName={form.name.trim() || undefined}
              />
            </div>

            <div className="card form-card">
              <h2 className="form-card-title">Product photos (up to 5)</h2>
              <div className="form-photo-grid">
                {Array.from({ length: 5 }).map((_, i) => {
                  if (previews[i]) {
                    return (
                      <div key={i} className="form-photo-slot">
                        <img src={previews[i]} alt="" />
                        <button
                          type="button"
                          className="form-photo-remove"
                          onClick={() => removePhoto(i)}
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </div>
                    );
                  }
                  if (i === previews.length && previews.length < 5) {
                    return (
                      <label key={i} className="form-photo-slot form-photo-slot--add">
                        <Upload size={18} />
                        <span className="text-xs font-semibold">Add photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handlePhoto}
                        />
                      </label>
                    );
                  }
                  return <div key={i} className="form-photo-slot" aria-hidden />;
                })}
              </div>
              <p className="form-photo-notice m-0 mt-3">
                <strong>Photo tip:</strong> Use landscape photos at <strong>16:9</strong> ratio (e.g. 1280×720 or
                800×450 px). Portrait or square images are cropped in Browse cards — the full subject may not show.
              </p>
              <p className="form-size-guide m-0 mt-2">
                First photo is the product cover in Browse. Up to 5 photos allowed.
              </p>
            </div>
            </>
          )}

          {step === 3 && (
            <div className="form-review-card">
              <h3>Review your listing</h3>
              {previews[0] && (
                <img
                  src={previews[0]}
                  alt=""
                  className="form-review-cover"
                />
              )}
              <div className="form-review-brand">
                {shopLogoPreview ? (
                  <img src={shopLogoPreview} alt="" className="shop-logo shop-logo--img shop-logo--round" />
                ) : (
                  <ShopLogo name={form.name} size={48} />
                )}
                <div>
                  <strong>{form.name}</strong>
                  <div className="text-sm [color:var(--text-muted)]">
                    ₱{Number(form.productPrice).toFixed(2)}
                  </div>
                </div>
              </div>
              <ul className="form-review-list">
                <li>
                  Shop photo: {shopLogoPreview ? 'Uploaded' : 'Not set (placeholder will show)'}
                </li>
                <li>
                  {formatCategory(form.category)} · {form.college}
                </li>
                <li>
                  {form.campusType === 'main'
                    ? 'Main campus'
                    : `Satellite: ${form.satelliteCampus}`}
                  {form.locationDesc ? ` · ${form.locationDesc}` : ''}
                </li>
                <li>{previews.length} photo(s)</li>
                <li>
                  GCash:{' '}
                  {form.gcashNumber || gcashQrPreview
                    ? form.gcashNumber || 'QR uploaded'
                    : 'Not provided'}
                </li>
              </ul>
            </div>
          )}

          <div className={`form-actions${step > 1 ? ' is-split' : ''}`}>
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-secondary">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={goNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="button" disabled={loading} onClick={handleCreate} className="btn-primary">
                <Check size={16} />
                {loading ? 'Creating...' : 'Create Shop'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
