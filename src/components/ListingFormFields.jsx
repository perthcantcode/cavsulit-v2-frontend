import { Upload, MapPin, Calendar } from 'lucide-react';
import { CATEGORIES, COLLEGES } from '../utils/helpers';
import { CategoryIcon, formatCategory } from './CategoryIcon';

export function ListingFormFields({
  form,
  setForm,
  gcashQrPreview,
  onGcashQr,
  onRemoveGcashQr,
}) {
  const set = (key, value) => setForm({ ...form, [key]: value });

  return (
    <div className="form-layout">
      <section className="form-section">
        <h3 className="form-section-title">Listing</h3>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="listing-name">
              Product / listing name *
            </label>
            <input
              id="listing-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Brown Sugar Milk Tea, Keychain set..."
              className="input"
            />
          </div>
        </div>
        <div className="form-row form-row--2">
          <div className="form-field">
            <label className="form-label" htmlFor="listing-price">
              Price (₱) *
            </label>
            <input
              id="listing-price"
              value={form.productPrice}
              onChange={(e) => set('productPrice', e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="input"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="listing-category">
              <CategoryIcon category={form.category} size={13} />
              Category
            </label>
            <select
              id="listing-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {formatCategory(c)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field form-field--textarea">
            <label className="form-label" htmlFor="listing-desc">
              Description
            </label>
            <textarea
              id="listing-desc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe your item, schedule, and pick-up details..."
              rows={4}
              className="input resize-none"
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="form-section-title">Location &amp; pickup</h3>
        <div className="form-row form-row--2">
          <div className="form-field">
            <label className="form-label" htmlFor="listing-college">
              College / building
            </label>
            <select
              id="listing-college"
              value={form.college}
              onChange={(e) => set('college', e.target.value)}
              className="input"
            >
              {COLLEGES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="listing-date">
              <Calendar size={13} />
              Available date (optional)
            </label>
            <input
              id="listing-date"
              type="date"
              value={form.availableDate}
              onChange={(e) => set('availableDate', e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field form-field--group">
            <span className="form-label">Campus</span>
            <div className="form-type-toggle">
              {[
                { value: 'main', label: 'Main campus' },
                { value: 'satellite', label: 'Satellite campus' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`form-type-option${form.campusType === opt.value ? ' is-active' : ''}`}
                  onClick={() => set('campusType', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {form.campusType === 'satellite' && (
              <input
                className="input"
                value={form.satelliteCampus}
                onChange={(e) => set('satelliteCampus', e.target.value)}
                placeholder="Which satellite campus?"
              />
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="listing-pickup">
              <MapPin size={13} />
              Pick-up location
            </label>
            <input
              id="listing-pickup"
              value={form.locationDesc}
              onChange={(e) => set('locationDesc', e.target.value)}
              placeholder="e.g. Near CEIT lobby..."
              className="input"
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="form-section-title">Payment (optional)</h3>
        <div className="form-row form-row--2">
          <div className="form-field">
            <label className="form-label" htmlFor="listing-gcash">
              GCash number
            </label>
            <input
              id="listing-gcash"
              value={form.gcashNumber}
              onChange={(e) => set('gcashNumber', e.target.value)}
              placeholder="09XXXXXXXXX"
              className="input"
            />
            <p className="form-field-hint">Shown in full on your listing so buyers can pay.</p>
          </div>
          <div className="form-field">
            <span className="form-label">GCash QR</span>
            {gcashQrPreview ? (
              <div className="form-qr-preview-row">
                <img src={gcashQrPreview} alt="GCash QR preview" />
                <label className="form-qr-change">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={onGcashQr} />
                </label>
                <button type="button" className="form-qr-remove" onClick={onRemoveGcashQr}>
                  Remove
                </button>
              </div>
            ) : (
              <label className="form-qr-slot">
                <Upload size={16} />
                <span>Upload QR</span>
                <input type="file" accept="image/*" className="hidden" onChange={onGcashQr} />
              </label>
            )}
          </div>
        </div>
      </section>

      <p className="form-pickup-note m-0">CavSulit is pick-up only on campus. No delivery available.</p>
    </div>
  );
}
