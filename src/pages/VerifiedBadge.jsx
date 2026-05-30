import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';

const LEVELS = [
  {
    key: 'cvsu',
    label: '★ CvSU Verified',
    cls: 'badge-cvsu',
    cardCls: 'badge-level-card--cvsu',
    icon: ShieldCheck,
    desc: 'Confirmed CvSU student, instructor, or staff with a valid student ID and CvSU email.',
    criteria: ['CvSU email (@cvsu.edu.ph)', 'Student ID provided', 'Account registration complete'],
  },
  {
    key: 'trusted',
    label: '★★ Trusted Seller',
    cls: 'badge-trusted',
    cardCls: 'badge-level-card--trusted',
    icon: Star,
    desc: 'Seller with consistently positive reviews and an active sales history on CavSulit.',
    criteria: ['CvSU Verified first', '10+ positive reviews (4★ or above)', 'Active for 30+ days'],
  },
  {
    key: 'top_seller',
    label: '★★★ Top Seller',
    cls: 'badge-top',
    cardCls: 'badge-level-card--top',
    icon: Award,
    desc: 'The highest badge level. Awarded to sellers with outstanding reputation and volume.',
    criteria: ['Trusted Seller first', '50+ completed transactions', '4.5+ overall rating'],
  },
];

export function VerifiedBadge() {
  const { user } = useAuth();

  const currentLevel = user?.badgeLevel || 'none';
  const levelOrder = ['none', 'cvsu', 'trusted', 'top_seller'];
  const currentIdx = levelOrder.indexOf(currentLevel);
  const isCvsuEmailVerified = Boolean(
    user?.isCvsuVerified ||
      user?.isVerified ||
      user?.badgeLevel === 'cvsu' ||
      user?.email?.toLowerCase().endsWith('@cvsu.edu.ph'),
  );

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6 text-center">
        <span className="section-tag">Trust & Credibility</span>
        <h1 className="font-bold text-2xl [color:var(--text)]">CvSU Verified Badge</h1>
        <p className="text-sm [color:var(--text-muted)] mt-2 max-w-lg mx-auto">
          Badges help buyers trust sellers inside CVSU. Each level has specific requirements and unlocks more
          visibility on the platform.
        </p>
      </div>

      {user && (
        <div className="card p-5 mb-8 badge-user-banner">
          <div className="flex items-center gap-4">
            <Avatar user={user} size={56} />
            <div>
              <div className="font-bold text-lg [color:var(--text)]">{user.fullName}</div>
              <div className="text-sm [color:var(--text-muted)]">
                {user.department} · {user.email}
              </div>
              <div className="mt-2">
                {currentLevel === 'none' ? (
                  <span className="badge-level-pill badge-level-pill--muted">No badge yet</span>
                ) : (
                  <span className={LEVELS.find((l) => l.key === currentLevel)?.cls}>
                    {LEVELS.find((l) => l.key === currentLevel)?.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isCvsuEmailVerified && (
            <p className="badge-user-hint m-0 mt-4 text-sm">
              Register with your CvSU email (@cvsu.edu.ph) and Student ID to get verified automatically.
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {LEVELS.map((lvl) => {
          const isCurrentOrAbove = currentIdx >= levelOrder.indexOf(lvl.key);
          const isCurrent = currentLevel === lvl.key;
          const Icon = lvl.icon;

          return (
            <div
              key={lvl.key}
              className={`badge-level-card card p-6 ${lvl.cardCls}${isCurrent ? ' is-current' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="badge-level-icon">
                  <Icon size={22} strokeWidth={2.25} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={lvl.cls}>{lvl.label}</span>
                    {isCurrent && (
                      <span className="badge-level-pill badge-level-pill--current">Your current badge</span>
                    )}
                    {isCurrentOrAbove && !isCurrent && (
                      <span className="badge-level-pill badge-level-pill--done">Achieved</span>
                    )}
                  </div>
                  <p className="text-sm [color:var(--text-muted)] mb-3 m-0">{lvl.desc}</p>
                  <ul className="badge-criteria-list m-0 p-0">
                    {lvl.criteria.map((c) => (
                      <li key={c} className={isCurrentOrAbove ? 'is-met' : ''}>
                        <span className="badge-criteria-mark" aria-hidden>
                          {isCurrentOrAbove ? '✓' : '○'}
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!user && (
        <div className="text-center mt-8 card p-8">
          <h3 className="font-bold text-lg [color:var(--text)] mb-2">Create an account to get verified</h3>
          <p className="text-sm [color:var(--text-muted)] mb-4">
            Register with your CvSU email to get the CvSU Verified badge instantly.
          </p>
          <Link to="/register" className="btn-primary">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}
