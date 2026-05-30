import { Diamond } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const WHY_ROWS = [
  {
    title: 'Discover Shops',
    desc: 'Browse by category, college, or search by name',
  },
  {
    title: 'Message & Order',
    desc: 'Chat directly with sellers and place pre-orders',
  },
  {
    title: 'Post Your Shop',
    desc: 'Free shop setup in under 5 minutes',
  },
  {
    title: 'Verified Sellers',
    desc: 'CvSU-verified badges for trusted community sellers',
  },
  {
    title: 'Pre-orders',
    desc: 'Reserve items before they sell out on campus',
  },
  {
    title: 'Reviews & Ratings',
    desc: 'Community-driven trust and accountability',
  },
  {
    title: 'Payment Flexibility',
    desc: 'Show GCash QR or number, pick up on campus',
  },
  {
    title: 'No Listing Fees',
    desc: 'Post your shop and products completely free',
  },
];

export function WhyPlatformSection() {
  return (
    <section className="why-platform-section" aria-labelledby="why-platform-heading">
      <div className="trending-section-inner">
        <div className="why-platform-panel">
          <header className="why-platform-header">
            <FadeIn>
              <p className="trending-section-label">Platform</p>
              <h2 id="why-platform-heading" className="trending-section-title">
                All-in-one platform.
              </h2>
              <p className="trending-section-subline why-platform-intro">
                Everything a CvSU student seller and buyer needs.
              </p>
            </FadeIn>
          </header>

          <ul className="why-platform-rows">
            {WHY_ROWS.map((row) => (
              <li key={row.title} className="why-row" tabIndex={0}>
                <div className="why-row-inner">
                  <span className="why-row-icon-box" aria-hidden>
                    <Diamond size={16} strokeWidth={2.5} />
                  </span>
                  <div className="why-row-body">
                    <span className="why-row-title">{row.title}</span>
                    <p className="why-row-desc">{row.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
