import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, Plus, X, MapPin, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, COLLEGES, CAT_ICONS } from '../utils/helpers';

export function EditShop() {
  const { user }   = useAuth();
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [photos,   setPhotos]   = useState([]);       // new File objects
  const [previews, setPreviews] = useState([]);       // new image previews
  const [existing, setExisting] = useState([]);       // existing Cloudinary URLs
  const [products, setProducts] = useState([{ name: '', price: '' }]);
  const [form, setForm] = useState({
    name: '', description: '', category: 'other', college: 'Other',
    locationDesc: '', availableDate: '',
  });
  const [error, setError] = useState('');

  // ── Load shop and verify ownership ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    api.get(`/shops/${id}`)
      .then(({ data }) => {
        // Ownership check in frontend (backend also validates)
        if (data.seller?.id !== user.id) {
          navigate(`/shop/${id}`);
          return;
        }
        setForm({
          name:          data.name          || '',
          description:   data.description   || '',
          category:      data.category      || 'other',
          college:       data.college       || 'Other',
          locationDesc:  data.locationDesc  || '',
          availableDate: data.availableDate || '',
        });
        setExisting(data.photos || []);
        setProducts(
          data.products?.length
            ? data.products.map(p => ({ id: p.id, name: p.name, price: String(p.price) }))
            : [{ name: '', price: '' }]
        );
      })
      .catch(() => navigate('/my-shop'))
      .finally(() => setFetching(false));
  }, [id, user]);

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-display font-bold text-xl text-cav-green-dark mb-2">Login Required</h2>
      <Link to="/login" className="btn-primary mt-4">Login</Link>
    </div>
  );

  if (fetching) return (
    <div className="page-container">
      <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"/>
    </div>
  );

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - existing.length;
    const toAdd = files.slice(0, remaining);
    setPhotos(prev => [...prev, ...toAdd]);
    toAdd.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeExisting = (i) => setExisting(prev => prev.filter((_,idx) => idx !== i));
  const removeNew      = (i) => {
    setPhotos(prev   => prev.filter((_,idx) => idx !== i));
    setPreviews(prev => prev.filter((_,idx) => idx !== i));
  };

  const addProduct    = () => setProducts(p => [...p, { name: '', price: '' }]);
  const removeProduct = (i) => setProducts(p => p.filter((_,idx) => idx !== i));
  const updateProduct = (i, field, val) =>
    setProducts(p => p.map((x, idx) => idx === i ? { ...x, [field]: val } : x));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Shop name is required');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Tell backend which existing photos to keep
      existing.forEach(url => fd.append('existingPhotos', url));

      // Append new files
      photos.forEach(f => fd.append('photos', f));

      await api.put(`/shops/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update/create products
      for (const p of products.filter(x => x.name && x.price)) {
        if (p.id) {
          await api.put(`/products/${p.id}`, { name: p.name, price: parseFloat(p.price) });
        } else {
          await api.post('/products', { shopId: id, name: p.name, price: parseFloat(p.price) });
        }
      }

      navigate(`/shop/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop');
    } finally {
      setLoading(false);
    }
  };

  const totalPhotos = existing.length + previews.length;

  return (
    <div className="page-container max-w-3xl">
      <Link to={`/shop/${id}`} className="btn-ghost mb-6 inline-flex"><ArrowLeft size={16}/>Back to Shop</Link>

      <div className="mb-6">
        <span className="section-tag">Edit Listing</span>
        <h1 className="font-display font-bold text-2xl text-cav-green-dark">Edit Your Shop</h1>
        <p className="text-sm text-cav-text-muted mt-1">Update your shop details. Changes go live immediately.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-cav-green-dark border-b border-gray-100 pb-2">Shop Info</h2>

          <div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Shop Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. BrewSU Drinks" className="input"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe what you sell, your schedule, special offers..." rows={4} className="input resize-none"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">College / Building</label>
              <select value={form.college} onChange={e => setForm({...form, college: e.target.value})} className="input">
                {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">
                <MapPin size={11} className="inline mr-1"/>Location Description
              </label>
              <input value={form.locationDesc} onChange={e => setForm({...form, locationDesc: e.target.value})}
                placeholder="e.g. Near CEIT lobby" className="input"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">Available Date</label>
              <input type="date" value={form.availableDate} onChange={e => setForm({...form, availableDate: e.target.value})} className="input"/>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-cav-green-dark border-b border-gray-100 pb-2">
            Photos ({totalPhotos}/5)
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Existing photos */}
            {existing.map((url, i) => (
              <div key={`ex-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={url} alt="" className="w-full h-full object-cover"/>
                <button type="button" onClick={() => removeExisting(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center [color:var(--text)] text-xs">
                  <X size={10}/>
                </button>
              </div>
            ))}
            {/* New photo previews */}
            {previews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-cav-green/40">
                <img src={src} alt="" className="w-full h-full object-cover"/>
                <button type="button" onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center [color:var(--text)] text-xs">
                  <X size={10}/>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-cav-green/80 [color:var(--text)] text-[9px] text-center py-0.5">New</div>
              </div>
            ))}
            {totalPhotos < 5 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-cav-green-accent/40 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-cav-green transition-colors text-cav-text-muted hover:text-cav-green">
                <Upload size={18}/>
                <span className="text-xs font-semibold">Add Photo</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhoto}/>
              </label>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="font-display font-bold text-base text-cav-green-dark">Products / Prices</h2>
            <button type="button" onClick={addProduct} className="btn-ghost text-xs py-1"><Plus size={12}/>Add Item</button>
          </div>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={p.name} onChange={e => updateProduct(i, 'name', e.target.value)}
                  placeholder="Item name" className="input flex-1"/>
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₱</span>
                  <input value={p.price} onChange={e => updateProduct(i, 'price', e.target.value)}
                    placeholder="0.00" type="number" min="0" step="0.01" className="input pl-7"/>
                </div>
                {products.length > 1 && (
                  <button type="button" onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-500 p-1">
                    <X size={14}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to={`/shop/${id}`} className="btn-secondary flex-1 justify-center py-3">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 text-base">
            {loading ? 'Saving...' : '✅ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
