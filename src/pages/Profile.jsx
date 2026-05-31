import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Save, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { badgeLabel, DEPARTMENTS, maskSensitive } from '../utils/helpers';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { Avatar } from '../components/Avatar';

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
      x:         user?.socialLinks?.x || user?.socialLinks?.twitter || '',
    },
    showContact: user?.showContact ?? true,
    showStudentId: user?.showStudentId ?? false,
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

      {error   && <div className="profile-alert profile-alert--error mb-4">{error}</div>}
      {success && <div className="profile-alert profile-alert--success mb-4">Profile updated!</div>}

      {/* ── Profile Card ─────────────────────────────────────────────────── */}
      <div className="card profile-section profile-section--hero p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar user={user} size={80} className="profile-page-avatar" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingPhoto}
              className="profile-camera-btn absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center"
            >
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
        <div className="card profile-section profile-section--basic p-6 space-y-4">
          <h2 className="profile-section-title">Basic Info</h2>

          <div className="form-field">
            <label className="form-label" htmlFor="profile-name">
              Full name
            </label>
            <input
              id="profile-name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="profile-dept">
                Department
              </label>
              <select
                id="profile-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="input"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="profile-contact">
                Contact number
              </label>
              <input
                id="profile-contact"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                placeholder="09XX XXX XXXX"
                className="input"
              />
            </div>
          </div>

          {user.studentId && (
            <div className="form-field">
              <span className="form-label">Student ID</span>
              <p className="form-readonly-value m-0">
                {form.showStudentId ? user.studentId : maskSensitive(user.studentId)}
              </p>
            </div>
          )}

          <div className="form-field form-field--textarea">
            <label className="form-label" htmlFor="profile-bio">
              Bio
            </label>
            <textarea
              id="profile-bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell buyers a bit about yourself and your shop..."
              rows={3}
              className="input resize-none"
            />
          </div>
        </div>

        {/* ── Privacy ──────────────────────────────────────────────────────── */}
        <div className="card profile-section profile-section--privacy p-6 space-y-3">
          <h2 className="profile-section-title">Privacy</h2>
          <p className="text-xs text-cav-text-muted m-0">
            Control your personal phone number and student ID. GCash numbers and QR codes on listings always
            show in full so buyers can pay.
          </p>
          <PrivacyToggle
            checked={form.showContact}
            onChange={(showContact) => setForm({ ...form, showContact })}
            label="Show phone number on shop pages"
            hint={
              form.showContact && form.contactNumber
                ? `Buyers see: ${maskSensitive(form.contactNumber)}`
                : 'Phone number is hidden on shop pages'
            }
          />
          {user.studentId && (
            <PrivacyToggle
              checked={form.showStudentId}
              onChange={(showStudentId) => setForm({ ...form, showStudentId })}
              label="Show full student ID on profile"
              hint={
                form.showStudentId
                  ? 'Full ID visible on your profile only'
                  : `Profile shows: ${maskSensitive(user.studentId)}`
              }
            />
          )}
        </div>

        {/* ── Social Links ─────────────────────────────────────────────────── */}
        <div className="card profile-section profile-section--social p-6 space-y-4">
          <h2 className="profile-section-title">Social Links</h2>
          <p className="text-xs text-cav-text-muted m-0">
            Add links shown on your shop page seller card (Facebook, Instagram, X).
          </p>

          {[
            { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/yourname' },
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
            { key: 'x',         label: 'X (Twitter)', placeholder: 'https://x.com/yourhandle' },
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
