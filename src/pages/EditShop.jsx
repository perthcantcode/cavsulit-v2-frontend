import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { photoUrl } from '../utils/helpers';
import { ListingFormFields } from '../components/ListingFormFields';
import { ShopLogoUpload } from '../components/ShopLogoUpload';

export function EditShop() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existing, setExisting] = useState([]);
  const [productId, setProductId] = useState(null);
  const [gcashQrFile, setGcashQrFile] = useState(null);
  const [gcashQrPreview, setGcashQrPreview] = useState(null);
  const [shopLogoFile, setShopLogoFile] = useState(null);
  const [shopLogoPreview, setShopLogoPreview] = useState(null);
  const [removeShopLogo, setRemoveShopLogo] = useState(false);
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

  useEffect(() => {
    if (!user) return;
    api
      .get(`/shops/${id}`)
      .then(({ data }) => {
        if (data.seller?.id !== user.id) {
          navigate(`/shop/${id}`);
          return;
        }
        const p = data.products?.[0];
        setForm({
          name: data.name || '',
          description: data.description || '',
          productPrice: p ? String(p.price) : '',
          category: data.category || 'other',
          college: data.college || 'Other',
          campusType: data.campusType || 'main',
          satelliteCampus: data.satelliteCampus || '',
          locationDesc: data.locationDesc || '',
          availableDate: data.availableDate || '',
          gcashNumber: data.gcashNumber || '',
        });
        setProductId(p?.id || null);
        setExisting(data.photos || []);
        if (data.shopLogo) setShopLogoPreview(photoUrl(data.shopLogo));
        if (data.gcashQr) setGcashQrPreview(photoUrl(data.gcashQr));
      })
      .catch(() => navigate('/my-shop'))
      .finally(() => setFetching(false));
  }, [id, user, navigate]);

  if (!user) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="font-bold text-xl mb-2">Login Required</h2>
        <Link to="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="page-container">
        <div className="h-64 bg-[var(--bg-alt)] border-2 border-[#1a1a1a] animate-pulse" />
      </div>
    );
  }

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - existing.length - previews.length;
    const toAdd = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const handleShopLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShopLogoFile(file);
    setRemoveShopLogo(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.productPrice) return setError('Price is required');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('productName', form.name.trim());
      fd.append('productPrice', form.productPrice);
      if (productId) fd.append('productId', productId);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('college', form.college);
      fd.append('campusType', form.campusType);
      if (form.campusType === 'satellite') fd.append('satelliteCampus', form.satelliteCampus);
      fd.append('locationDesc', form.locationDesc);
      if (form.availableDate) fd.append('availableDate', form.availableDate);
      fd.append('gcashNumber', form.gcashNumber);
      existing.forEach((url) => fd.append('existingPhotos', url));
      photos.forEach((f) => fd.append('photos', f));
      if (shopLogoFile) fd.append('shopLogo', shopLogoFile);
      if (removeShopLogo) fd.append('removeShopLogo', 'true');
      if (gcashQrFile) fd.append('gcashQr', gcashQrFile);

      await api.put(`/shops/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/shop/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  const removeExisting = (i) => setExisting((p) => p.filter((_, idx) => idx !== i));
  const removeNew = (i) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const allPreviews = [...existing.map((u) => photoUrl(u)), ...previews].filter(Boolean);
  const totalPhotos = existing.length + previews.length;

  return (
    <div className="page-container">
      <div className="form-page">
        <Link to={`/shop/${id}`} className="btn-ghost mb-4 inline-flex">
          <ArrowLeft size={16} /> Back
        </Link>

        <header className="form-page-header">
          <span className="section-tag">Edit Listing</span>
          <h1 className="font-bold text-2xl [color:var(--text)]">Edit Listing</h1>
          <p className="text-sm [color:var(--text-muted)] mt-1">One product per post.</p>
        </header>

        {error && (
          <div className="bg-red-50 border-2 border-red-600 text-red-700 text-sm px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-shell">
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

          <div className="card form-card">
            <h2 className="form-card-title">Shop profile photo</h2>
            <p className="text-xs [color:var(--text-muted)] m-0 mb-4">
              This logo is only for this listing — not your personal account photo.
            </p>
            <ShopLogoUpload
              preview={removeShopLogo ? null : shopLogoPreview}
              onChange={handleShopLogo}
              onRemove={() => {
                setShopLogoFile(null);
                setShopLogoPreview(null);
                setRemoveShopLogo(true);
              }}
              shopName={form.name.trim() || undefined}
            />
          </div>

          <div className="card form-card">
            <h2 className="form-card-title">Product photos ({totalPhotos}/5)</h2>
            <div className="form-photo-grid">
              {allPreviews.map((src, i) => (
                <div key={i} className="form-photo-slot">
                  <img src={src} alt="" />
                  <button
                    type="button"
                    className="form-photo-remove"
                    onClick={() =>
                      i < existing.length ? removeExisting(i) : removeNew(i - existing.length)
                    }
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              {totalPhotos < 5 && (
                <label className="form-photo-slot form-photo-slot--add">
                  <Upload size={18} />
                  <span className="text-xs">Add</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhoto} />
                </label>
              )}
            </div>
            <p className="form-photo-notice m-0 mt-3">
              <strong>Photo tip:</strong> Use landscape photos at <strong>16:9</strong> ratio (e.g. 1280×720 or
              800×450 px). Portrait or square images may show letterboxing or crop in Browse cards.
            </p>
            <p className="form-size-guide m-0 mt-2">
              First photo is the cover image. Up to 5 photos allowed.
            </p>
          </div>

          <div className="form-actions is-split">
            <Link to={`/shop/${id}`} className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
