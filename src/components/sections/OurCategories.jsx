import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCategoriesApi } from '../../api/categories';

// Accent colors for the top border strip and icon ring — one per card
const ACCENT_COLORS = [
  '#f97316', // orange
  '#16a34a', // green
  '#7c3aed', // purple
  '#0ea5e9', // sky blue
  '#e11d48', // rose
  '#d97706', // amber
];

const CategoryCard = memo(({ cat, accentColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cat-card group relative cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col"
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Card Body */}
      <div className="flex flex-col items-center px-4 pt-6 pb-5 text-center flex-1">

        {/* Image ring */}
        <div
          className="cat-img-ring relative flex items-center justify-center rounded-full mb-4 overflow-hidden"
          style={{
            width: '80px',
            height: '80px',
            border: `3px solid ${accentColor}22`,
            boxShadow: `0 0 0 5px ${accentColor}14`,
            background: `${accentColor}0f`,
          }}
        >
          {cat.image?.url ? (
            <img
              src={cat.image.url}
              alt={cat.name}
              className="cat-img w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          ) : (
            <span className="text-3xl select-none">🥭</span>
          )}

          {/* Accent ring on hover */}
          <div
            className="cat-ring-overlay absolute inset-0 rounded-full opacity-0"
            style={{ border: `3px solid ${accentColor}`, transition: 'opacity 0.25s ease' }}
          />
        </div>

        {/* Name */}
        <h3 className="font-bold text-[15px] md:text-base text-gray-900 leading-snug mb-1 cat-name">
          {cat.name}
        </h3>

        {/* Description */}
        {cat.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {cat.description}
          </p>
        )}

        {/* Explore pill */}
        <div
          className="cat-pill mt-auto inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{
            color: accentColor,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          Explore
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5h7M6 2.5l2.5 2.5L6 7.5"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="w-full h-1.5 flex-shrink-0 cat-accent-bar"
        style={{ background: accentColor }}
      />
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white overflow-hidden animate-pulse" style={{ minHeight: '200px', border: '1px solid rgba(0,0,0,0.06)' }}>
    <div className="h-1.5 bg-gray-200 w-full" />
    <div className="flex flex-col items-center p-6 gap-3">
      <div className="w-20 h-20 rounded-full bg-gray-200" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
      <div className="h-6 w-20 bg-gray-100 rounded-full mt-1" />
    </div>
  </div>
);

const OurCategories = memo(({ addToRefs }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const catData = await listCategoriesApi();
      const cats = catData.categories || (Array.isArray(catData) ? catData : []);
      setCategories([...cats].reverse());
    } catch (err) {
      console.error('OurCategories fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate('/mangos', { state: { categoryId } });
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <section className="py-16 overflow-hidden" id="our-categories">
      <style dangerouslySetInnerHTML={{ __html: `
        .cat-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.42, 0.64, 1),
                      box-shadow 0.25s ease;
        }
        .cat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.13) !important;
        }
        .cat-card:hover .cat-accent-bar {
          height: 3px;
          transition: height 0.2s ease;
        }
        .cat-card:hover .cat-ring-overlay {
          opacity: 1 !important;
        }
        .cat-card:hover .cat-img-ring {
          transform: scale(1.06);
          transition: transform 0.25s cubic-bezier(0.34, 1.42, 0.64, 1);
        }
        .cat-img-ring {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cat-card:hover .cat-img {
          transform: scale(1.05);
          transition: transform 0.35s ease;
        }
        .cat-img {
          transition: transform 0.25s ease;
        }
        .cat-card:hover .cat-name {
          color: var(--cat-accent, #f97316);
        }
        .cat-pill {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .cat-card:hover .cat-pill {
          transform: translateY(-1px);
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-[var(--color-secondary)] opacity-50" />
            <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-[10px]">
              Browse By Type
            </span>
            <div className="h-px w-10 bg-[var(--color-secondary)] opacity-50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">
            Our Categories
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] opacity-70">
            Select a category to explore handpicked mangoes
          </p>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div
            className={`grid gap-4 md:gap-6 ${
              categories.length <= 2
                ? 'grid-cols-2 max-w-lg mx-auto'
                : categories.length === 3
                ? 'grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto'
                : 'grid-cols-2 md:grid-cols-4'
            }`}
          >
            {categories.map((cat, index) => {
              const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
              return (
                <CategoryCard
                  key={cat._id}
                  cat={cat}
                  accentColor={accentColor}
                  onClick={() => handleCategoryClick(cat._id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

OurCategories.displayName = 'OurCategories';
export default OurCategories;
