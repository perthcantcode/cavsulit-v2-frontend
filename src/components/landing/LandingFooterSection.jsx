import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FadeIn } from '../ui/FadeIn';

const SOCIALS = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'X / Twitter', href: '#', Icon: Twitter },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
  { label: 'GitHub', href: '#', Icon: Github },
];

const HELPFUL = [
  { label: 'Browse', to: '/browse' },
  { label: 'Post Shop', to: '/post-shop' },
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'CvSU Verified', to: '/verified' },
  { label: 'About', href: '/#about' },
];

export function LandingFooterSection() {
  const { user } = useAuth();

  return (
    <footer className="landing-footer" aria-label="Site footer">
      <div className="landing-footer-studio">
        <div className="landing-footer-studio-inner">
          <FadeIn>
            <div className="landing-footer-studio-top">
              <div className="landing-footer-cta">
                <h2 className="landing-footer-cta-title">
                  Ready to sell on campus?
                  <span className="landing-footer-cta-dot" aria-hidden>
                    .
                  </span>
                </h2>
                <div className="landing-footer-actions">
                  {user ? (
                    <>
                      <Link to="/post-shop" className="btn-primary landing-footer-btn">
                        Post Shop <ArrowRight size={15} />
                      </Link>
                      <Link to="/browse" className="btn-secondary landing-footer-btn">
                        Browse
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="btn-primary landing-footer-btn">
                        Get Started <ArrowRight size={15} />
                      </Link>
                      <Link to="/browse" className="btn-secondary landing-footer-btn">
                        Browse
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="landing-footer-info">
                <div className="landing-footer-info-block">
                  <span className="landing-footer-info-label">Campus</span>
                  <p>Cavite State University</p>
                  <p>Indang, Cavite 4122</p>
                </div>
                <div className="landing-footer-info-block">
                  <span className="landing-footer-info-label">Contact</span>
                  <p>
                    <a href="mailto:hello@cavsulit.com">hello@cavsulit.com</a>
                  </p>
                  <p>ITEC Group 3 · CavSulit</p>
                </div>
                <div className="landing-footer-info-block">
                  <span className="landing-footer-info-label">Social</span>
                  <ul className="landing-footer-social-list">
                    {SOCIALS.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                          <span className="landing-footer-social-icon">
                            <Icon size={15} strokeWidth={2.25} />
                          </span>
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="landing-footer-info-block">
                  <span className="landing-footer-info-label">Helpful links</span>
                  <ul className="landing-footer-helpful">
                    {HELPFUL.map((item) => (
                      <li key={item.label}>
                        {item.to ? (
                          <Link to={item.to}>{item.label}</Link>
                        ) : (
                          <a href={item.href}>{item.label}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="landing-footer-credits">
              <p>© 2026 CavSulit · Cavite State University</p>
              <p className="landing-footer-credits-mid">
                Built for CvSU students
                <span className="landing-footer-credits-heart" aria-hidden>
                  ♥
                </span>
              </p>
              <p>
                <a href="https://cavsulit.com">cavsulit.com</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="landing-footer-megatype" aria-hidden>
        <p className="landing-footer-megatype-text">cavsulit</p>
      </div>
    </footer>
  );
}
