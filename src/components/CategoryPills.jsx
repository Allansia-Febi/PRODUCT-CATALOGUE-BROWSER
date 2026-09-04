import React from 'react';
import { 
  Sparkles, Laptop, Smartphone, Sparkle, Armchair, 
  ShoppingBasket, Shirt, Watch, Eye, Compass, Package
} from 'lucide-react';

const CATEGORY_ICONS = {
  beauty: Sparkle,
  fragrances: Sparkles,
  furniture: Armchair,
  groceries: ShoppingBasket,
  laptops: Laptop,
  smartphones: Smartphone,
  'mens-shirts': Shirt,
  'mens-watches': Watch,
  sunglasses: Eye,
};

export function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-pills-container" role="region" aria-label="Category quick filter">
      <button
        type="button"
        className={`category-pill ${activeCategory === '' ? 'active' : ''}`}
        onClick={() => onSelectCategory('')}
        aria-pressed={activeCategory === ''}
      >
        <Compass size={15} />
        All Categories
      </button>

      {categories.map((cat) => {
        const slug = typeof cat === 'string' ? cat : cat.slug;
        const name = typeof cat === 'string' ? cat : cat.name;
        const IconComponent = CATEGORY_ICONS[slug] || Package;

        return (
          <button
            key={slug}
            type="button"
            className={`category-pill ${activeCategory === slug ? 'active' : ''}`}
            onClick={() => onSelectCategory(activeCategory === slug ? '' : slug)}
            aria-pressed={activeCategory === slug}
          >
            <IconComponent size={15} />
            {name}
          </button>
        );
      })}
    </div>
  );
}
