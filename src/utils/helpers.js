export const CAT_ICONS = {
  food:            '🍱',
  drinks:          '🧋',
  merch:           '👕',
  accessories:     '💍',
  school_supplies: '📚',
  beauty:          '💅',
  services:        '🛠️',
  other:           '🛒',
};

export const COLLEGES    = ['CEIT','CON','CEMDS','COE','CAS','Main Gate','Canteen','Dormitory','Other'];
export const CATEGORIES  = ['food','drinks','merch','accessories','school_supplies','beauty','services','other'];
export const DEPARTMENTS = ['CEIT','CON','CEMDS','COE','CAS','STAFF','INSTRUCTOR','OTHER'];

export const badgeLabel = (level) => {
  if (level === 'cvsu')       return { label: '★ CvSU Verified',  cls: 'badge-cvsu' };
  if (level === 'trusted')    return { label: '★★ Trusted',       cls: 'badge-trusted' };
  if (level === 'top_seller') return { label: '★★★ Top Seller',   cls: 'badge-top' };
  return null;
};

export const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

export const categoryColor = (cat) => {
  const map = {
    food:            'bg-orange-500/20 text-orange-300',
    drinks:          'bg-cyan-500/20 text-cyan-300',
    merch:           'bg-purple-500/20 text-purple-300',
    accessories:     'bg-pink-500/20 text-pink-300',
    school_supplies: 'bg-blue-500/20 text-blue-300',
    beauty:          'bg-rose-500/20 text-rose-300',
    services:        'bg-sky-500/20 text-sky-300',
    other:           'bg-white/10 text-white/70',
  };
  return map[cat] || map.other;
};

export const fmt = (n) => new Intl.NumberFormat('en-PH').format(n);

// Handles both Cloudinary URLs (already absolute) and legacy local paths
export const photoUrl = (p) =>
  p ? (p.startsWith('http') ? p : `${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}${p}`) : null;
