import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LEVELS = [
  { key: 'cvsu',       label: '★ CvSU Verified',   cls: 'badge-cvsu',    desc: 'Confirmed CvSU student, instructor, or staff with a valid student ID and CvSU email.', criteria: ['CvSU email (@cvsu.edu.ph)', 'Student ID provided', 'Account registration complete'] },
  { key: 'trusted',    label: '★★ Trusted Seller',  cls: 'badge-trusted', desc: 'Seller with consistently positive reviews and an active sales history on CavSulit.', criteria: ['CvSU Verified first', '10+ positive reviews (4★ or above)', 'Active for 30+ days'] },
  { key: 'top_seller', label: '★★★ Top Seller',     cls: 'badge-top',     desc: 'The highest badge level. Awarded to sellers with outstanding reputation and volume.', criteria: ['Trusted Seller first', '50+ completed transactions', '4.5+ overall rating'] },
];

export function VerifiedBadge() {
  const { user } = useAuth();

  const currentLevel = user?.badgeLevel || 'none';
  const levelOrder   = ['none', 'cvsu', 'trusted', 'top_seller'];
  const currentIdx   = levelOrder.indexOf(currentLevel);

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6 text-center">
        <span className="section-tag">Trust & Credibility</span>
        <h1 className="font-display font-bold text-2xl text-cav-green-dark">CvSU Verified Badge</h1>
        <p className="text-sm text-cav-text-muted mt-2 max-w-lg mx-auto">
          Badges help buyers trust sellers inside CVSU. Each level has specific requirements and unlocks more visibility on the platform.
        </p>
      </div>

      {user && (
        <div className="card p-5 mb-8 bg-gradient-to-r from-cav-green-dark to-cav-green text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.fullName?.[0] || 'U'}
            </div>
            <div>
              <div className="font-display font-bold text-lg">{user.fullName}</div>
              <div className="text-white/70 text-sm">{user.department} · {user.email}</div>
              <div className="mt-2">
                {currentLevel === 'none'
                  ? <span className="text-xs bg-white/20 px-3 py-1 rounded-full">No badge yet</span>
                  : <span className={`${LEVELS.find(l => l.key === currentLevel)?.cls} text-xs px-3 py-1`}>
                      {LEVELS.find(l => l.key === currentLevel)?.label}
                    </span>
                }
              </div>
            </div>
          </div>
          {!user.isVerified && (
            <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm">
              💡 Register with your CvSU email (@cvsu.edu.ph) and Student ID to get verified automatically.
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {LEVELS.map((lvl, i) => {
          const isCurrentOrAbove = currentIdx >= levelOrder.indexOf(lvl.key);
          const isCurrent        = currentLevel === lvl.key;
          return (
            <div key={lvl.key} className={`card p-6 ${isCurrent ? 'ring-2 ring-cav-green' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${i === 0 ? 'bg-cav-green-accent/20 text-cav-green' : i === 1 ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-yellow-500'}`}>
                  {i === 0 ? <ShieldCheck size={22}/> : i === 1 ? <Star size={22}/> : <Award size={22}/>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={lvl.cls}>{lvl.label}</span>
                    {isCurrent && <span className="text-xs bg-cav-green/10 text-cav-green font-bold px-2 py-0.5 rounded-full">Your current badge</span>}
                    {isCurrentOrAbove && !isCurrent && <span className="text-xs bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full">✓ Achieved</span>}
                  </div>
                  <p className="text-sm text-cav-text-muted mb-3">{lvl.desc}</p>
                  <div className="space-y-1.5">
                    {lvl.criteria.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                          ${isCurrentOrAbove ? 'bg-cav-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {isCurrentOrAbove ? '✓' : '○'}
                        </div>
                        <span className={isCurrentOrAbove ? 'text-cav-green-dark' : 'text-gray-400'}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!user && (
        <div className="text-center mt-8 card p-8">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-display font-bold text-lg text-cav-green-dark mb-2">Create an account to get verified</h3>
          <p className="text-sm text-cav-text-muted mb-4">Register with your CvSU email to get the CvSU Verified badge instantly.</p>
          <Link to="/register" className="btn-primary">Create Account</Link>
        </div>
      )}
    </div>
  );
}
