import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroWordmark } from './HeroWordmark';
import { HeroChatBubble } from './HeroChatBubble';
import { HeroFloatingIcons } from './HeroFloatingIcons';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-stage">
        <div className="hero-cluster">
          <HeroChatBubble />

          <div className="hero-main">
            <HeroFloatingIcons />
            <HeroWordmark />
          </div>
        </div>

        <div className="hero-cta hero-fade-up hero-fade-up-delay">
          <Link to="/register" className="btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/browse" className="btn-secondary">
            Browse Shops
          </Link>
        </div>

        <p className="hero-tagline hero-fade-up hero-fade-up-delay-2">
          Free for all CvSU students • No listing fees • Pick-up&nbsp;only
        </p>
      </div>
    </section>
  );
}
