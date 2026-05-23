import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Plus, X, MapPin, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, COLLEGES, CAT_ICONS } from '../utils/helpers';

export function PostShop() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [photos,   setPhotos]   = useState([]);
  const [previews, setPreviews] = useState([]);
  const [products, setProducts] = useState([{ name: '', price: '' }]);
  const [form, setForm] = useState({
    name: '', description: '', category: 'other', college: 'Other',
    locationDesc: '', availableDate: '',
  });
  const [error, setError] = useState('');
  const [step, setStep]   = useState(1);

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-bold text-xl text-white mb-2">Login Required</h2>
      <p className="text-white/55 mb-6">You need to be logged in to post a shop.</p>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files].slice(0, 5));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(prev => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (i) => {
    setPhotos(prev => prev.filter((_,idx) => idx !== i));
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
      photos.forEach(f => fd.append('photos', f));

      const { data: shop } = await api.post('/shops', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      for (const p of products.filter(x => x.name && x.price)) {
        await api.post('/products', { shopId: shop.id, name: p.name, price: parseFloat(p.price) });
      }

      navigate(`/shop/${shop.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-3xl">
      <Link to="/browse" className="btn-ghost mb-6 inline-flex"><ArrowLeft size={16}/>Back</Link>

      <div className="mb-6">
        <span className="section-tag">New Listing</span>
        <h1 className="font-bold text-2xl text-white">Post Your Shop</h1>
        <p className="text-sm text-white/55 mt-1">Step {step} of 3 — list your shop for free</p>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-cav-accent' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {step === 1 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-base text-white border-b border-white/10 pb-2">Basic Info</h2>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">Shop Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. BrewSU Drinks, Key Chain Stall..." className="input"/>
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
                placeholder="e.g. Near CEIT lobby, 2nd floor..." className="input"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">Available Date</label>
              <input type="date" value={form.availableDate} onChange={e => setForm({...form, availableDate: e.target.value})} className="input"/>
            </div>
          </div>
        </div>
        )}

        {step === 2 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-base text-white border-b border-white/10 pb-2">Photos (up to 5)</h2>
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover"/>
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  <X size={10}/>
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="w-full min-h-[120px] rounded-xl border-2 border-dashed border-white/25 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-cav-accent transition-colors text-white/50 hover:text-cav-accent sm:w-24 sm:min-h-0 sm:h-24">
                <Upload size={18}/>
                <span className="text-xs font-semibold">Add Photo</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhoto}/>
              </label>
            )}
          </div>
        </div>
        )}

        {step === 3 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="font-bold text-base text-white">Products / Location</h2>
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
                  <button type="button" onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-500 p-1"><X size={14}/></button>
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1 justify-center">
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !form.name.trim()) return setError('Shop name is required');
                setError('');
                setStep((s) => s + 1);
              }}
              className="btn-primary flex-1 justify-center"
            >
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
              {loading ? 'Posting...' : 'Post Shop'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
