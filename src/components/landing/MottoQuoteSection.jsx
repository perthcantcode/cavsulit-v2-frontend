import { FadeIn } from '../ui/FadeIn';
import { EyeFollow } from '../ui/EyeFollow';

export function MottoQuoteSection() {
  return (
    <section className="motto-section" aria-label="Campus motivation">
      <div className="trending-section-inner">
        <FadeIn>
          <div className="motto-quote-block">
            <span className="motto-quote-mark" aria-hidden>
              &ldquo;
            </span>
            <div className="motto-quote-copy">
              <blockquote className="motto-quote-text">
                <span className="motto-quote-line">Turn your side hustle</span>
                <span className="motto-quote-line">into a campus legacy.</span>
                <span className="motto-quote-line motto-quote-line--accent">
                  Start where CvSU shops.
                </span>
              </blockquote>
              <p className="motto-quote-byline">Build on campus · Sell with proof</p>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="motto-eyes-stage">
        <div className="motto-eyes-wrap">
          <EyeFollow size="cute" />
        </div>
        <div className="motto-eyes-hill" aria-hidden />
      </div>
    </section>
  );
}
