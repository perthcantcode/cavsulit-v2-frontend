import {
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  Coins,
  Package,
  Users,
} from 'lucide-react';

/** Staggered around wordmark — not a rigid vertical line */
const ICONS = [
  { Icon: Users,         top: '4%',  left: '7%',   rot: '-8deg', delay: '0s',    accent: 'people' },
  { Icon: ShoppingBag,   top: '38%', left: '3%',   rot: '-5deg', delay: '0.45s' },
  { Icon: ShoppingCart,  top: '72%', left: '10%',  rot: '-7deg', delay: '0.9s',  accent: 'cart' },
  { Icon: MessageCircle, top: '2%',  right: '8%',  rot: '7deg',  delay: '0.15s', accent: 'message' },
  { Icon: Package,       top: '36%', right: '2%',  rot: '-4deg', delay: '0.55s' },
  { Icon: Coins,         top: '70%', right: '10%', rot: '9deg',  delay: '1s',    accent: 'coins' },
];

export function HeroFloatingIcons() {
  return (
    <div className="hero-orbit" aria-hidden>
      {ICONS.map(({ Icon, top, left, right, rot, delay, accent }, i) => (
        <div
          key={i}
          className={`hero-float-icon${accent ? ` hero-float-icon--${accent}` : ''}`}
          style={{
            top,
            left,
            right,
            '--rot': rot,
            '--delay': delay,
          }}
        >
          <Icon size={22} strokeWidth={2.25} color="#1a1a1a" />
        </div>
      ))}
    </div>
  );
}
