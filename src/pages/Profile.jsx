import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, DEPARTMENTS } from '../utils/helpers';

export function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName:      user?.fullName      || '',
    contactNumber: user?.contactNumber || '',
    department:    user?.department    || 'OTHER',
    bio:           user?.bio           || '',
    socialLinks: {
      facebook:  user?.socialLinks?.facebook  || '',
      instagram: user?.socialLinks?.instagram || '',
      messenger: user?.socialLinks?.messenger || '',
    },
    showContact: user?.showContact ?? true,
  });

  const [saving,        setSaving]        = useState(false);
  const [uploadingPhoto,setUploadingPhoto]= useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState('');

  if (!user) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-display font-bold text-xl text-cav-green-dark mb-2">Login Required</h2>
      <Link to="/login" className="btn-primary mt-4">Login</Link>
    </div>
  );

  const badge = badgeLabel(user.badgeLevel);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const { data } = await api.put('/auth/me/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const { data } = await api.put('/auth/me', form);
      updateUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-6">
        <span className="section-tag">Account</span>
        <h1 className="font-display font-bold text-2xl text-cav-green-dark">My Profile</h1>
        <p className="text-sm text-cav-text-muted mt-1">Manage your public profile and account settings.</p>
      </div>

      {error   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">✅ Profile updated!</div>}

      {/* ── Profile Card ─────────────────────────────────────────────────── */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cav-green flex items-center justify-center">
              {user.profilePhoto
                ? <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover"/>
                : <span className="[color:var(--text)] font-bold text-3xl">{user.fullName?.[0] || 'U'}</span>
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-cav-green [color:var(--text)] rounded-full flex items-center justify-center shadow-md hover:bg-cav-green-dark transition-colors">
              {uploadingPhoto
                ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                : <Camera size={13}/>
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
          </div>

          <div>
            <div className="font-display font-bold text-lg text-cav-green-dark">{user.fullName}</div>
            <div className="text-sm text-cav-text-muted">{user.email}</div>
            <div className="flex items-center gap-2 mt-1">
              {badge
                ? <span className={badge.cls}>{badge.label}</span>
                : <span className="text-xs text-cav-text-muted bg-gray-100 px-2 py-0.5 rounded-full">No badge yet</span>
              }
              <Link to="/verified" className="text-xs text-cav-green hover:underline flex items-center gap-0.5">
                About badges <ExternalLink size={10}/>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* ── Basic Info ───────────────────────────────────────────────────── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-cav-green-dark border-b border-gray-100 pb-2">Basic Info</h2>

          <div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Full Name</label>
            <input value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              className="input"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">Department</label>
              <select value={form.department}
                onChange={e => setForm({...form, department: e.target.value})}
                className="input">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-cav-green-dark mb-1 flex items-center gap-1">
                Contact Number
                <button type="button"
                  onClick={() => setForm({...form, showContact: !form.showContact})}
                  className="ml-auto text-cav-text-muted hover:text-cav-green"
                  title={form.showContact ? 'Visible to buyers' : 'Hidden from buyers'}>
                  {form.showContact ? <Eye size={12}/> : <EyeOff size={12}/>}
                </button>
              </label>
              <input value={form.contactNumber}
                onChange={e => setForm({...form, contactNumber: e.target.value})}
                placeholder="09XX XXX XXXX" className="input"/>
              <p className="text-[10px] text-cav-text-muted mt-1">
                {form.showContact ? '👁 Visible on shop page' : '🔒 Hidden from buyers'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cav-green-dark mb-1">Bio</label>
            <textarea value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
              placeholder="Tell buyers a bit about yourself and your shop..."
              rows={3} className="input resize-none"/>
          </div>
        </div>

        {/* ── Social Links ─────────────────────────────────────────────────── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-cav-green-dark border-b border-gray-100 pb-2">Social Links</h2>
          <p className="text-xs text-cav-text-muted">These appear on your shop page so buyers can reach you.</p>

          {[
            { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/yourname' },
            { key: 'instagram', label: 'Instagram',  placeholder: 'https://instagram.com/yourhandle' },
            { key: 'messenger', label: 'Messenger',  placeholder: 'https://m.me/yourname' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-cav-green-dark mb-1">{label}</label>
              <input
                value={form.socialLinks[key]}
                onChange={e => setForm({...form, socialLinks: {...form.socialLinks, [key]: e.target.value}})}
                placeholder={placeholder}
                className="input"/>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 text-base">
          <Save size={16}/>{saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
