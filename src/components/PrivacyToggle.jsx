import { Eye, EyeOff } from 'lucide-react';

export function PrivacyToggle({ checked, onChange, label, hint }) {
  return (
    <label className="form-privacy-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="form-privacy-toggle-box" aria-hidden>
        {checked ? <Eye size={14} /> : <EyeOff size={14} />}
      </span>
      <span className="form-privacy-toggle-text">
        <strong>{label}</strong>
        {hint && <span>{hint}</span>}
      </span>
    </label>
  );
}
