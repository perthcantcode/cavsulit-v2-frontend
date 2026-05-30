import {
  BookOpen,
  CupSoda,
  Gem,
  ShoppingBag,
  Shirt,
  Sparkles,
  Utensils,
  Wrench,
} from 'lucide-react';

const ICONS = {
  food: Utensils,
  drinks: CupSoda,
  merch: Shirt,
  accessories: Gem,
  school_supplies: BookOpen,
  beauty: Sparkles,
  services: Wrench,
  other: ShoppingBag,
};

export function formatCategory(category) {
  if (!category || category === 'all') return 'All';
  return category.replace(/_/g, ' ');
}

export function CategoryIcon({ category, size = 16, strokeWidth = 2.25, className = '' }) {
  const Icon = ICONS[category] || ShoppingBag;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
