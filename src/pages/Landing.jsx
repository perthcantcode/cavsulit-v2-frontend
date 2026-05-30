import React from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { TrendingSections } from '../components/landing/TrendingSections';
import { FadeIn } from '../components/ui/FadeIn';
import { TaglineMarqueeSection } from '../components/ui/Marquee';
import { ServicesCarousel } from '../components/ui/ServicesWheel';
import { WhyPlatformSection } from '../components/landing/WhyPlatformSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TrustBadgesSection } from '../components/landing/TrustBadgesSection';
import { FaqSection } from '../components/landing/FaqSection';
import { MottoQuoteSection } from '../components/landing/MottoQuoteSection';
import { LandingFooterSection } from '../components/landing/LandingFooterSection';

export function Landing() {
  return (
    <div style={{ color: 'var(--text)' }}>

      <HeroSection />

      <TaglineMarqueeSection />

      <TrendingSections />

      <ServicesCarousel />

      <WhyPlatformSection />

      <HowItWorksSection />

      <TrustBadgesSection />

      <FaqSection />

      <MottoQuoteSection />

      <LandingFooterSection />
    </div>
  );
}
