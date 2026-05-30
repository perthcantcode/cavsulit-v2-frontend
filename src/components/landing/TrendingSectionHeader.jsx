import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function TrendingSectionHeader({
  label,
  title,
  subline,
  browseTo = '/browse',
  browseLabel = 'Browse all',
}) {
  return (
    <div className="trending-section-header">
      <div>
        <p className="trending-section-label">{label}</p>
        <h2 className="trending-section-title">{title}</h2>
        <p className="trending-section-subline">{subline}</p>
      </div>
      <Link to={browseTo} className="trending-section-link">
        {browseLabel} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
