import React, { useRef, useEffect, memo } from 'react';

const DUMMY_BLOGS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
    title: 'Why Alphonso Mango is the King of All Mangoes',
    desc: 'Discover what makes the Alphonso mango so special — its rich aroma, buttery texture, and unmatched sweetness that has won hearts worldwide.',
    date: 'May 12, 2025',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80',
    title: 'Farm to Doorstep: How We Deliver Freshness',
    desc: 'A behind-the-scenes look at how KashtKart ensures every mango reaches you within 24–48 hours of being handpicked from the orchard.',
    date: 'May 8, 2025',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&q=80',
    title: '5 Health Benefits of Eating Mangoes Daily',
    desc: 'From boosting immunity to improving digestion, mangoes are a powerhouse of nutrition. Here\'s why you should eat one every day this season.',
    date: 'May 3, 2025',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80',
    title: 'Kesar vs Alphonso: Which Mango Should You Buy?',
    desc: 'Both are premium varieties but taste very different. We break down the key differences to help you pick the perfect mango for your family.',
    date: 'Apr 28, 2025',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80',
    title: 'How to Spot Naturally Ripened Mangoes',
    desc: 'Chemically ripened mangoes look perfect but taste hollow. Learn the simple tricks to identify naturally ripened, farm-fresh mangoes every time.',
    date: 'Apr 22, 2025',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    title: 'The Story of Dasheri: UP\'s Most Beloved Mango',
    desc: 'Originating from a small village near Lucknow, the Dasheri mango has a 200-year-old legacy that continues to delight mango lovers across India.',
    date: 'Apr 15, 2025',
  },
];

const LatestBlogs = memo(({ addToRefs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let interval;
    let isHovered = false;

    const start = () => {
      if (interval || isHovered) return;
      interval = setInterval(() => {
        if (!container || isHovered) return;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        } else {
          container.scrollLeft += 1;
        }
      }, 20);
    };

    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    const onEnter = () => { isHovered = true; stop(); };
    const onLeave = () => { isHovered = false; start(); };

    setTimeout(start, 300);
    container.addEventListener('mouseenter', onEnter, { passive: true });
    container.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      stop();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const allBlogs = [...DUMMY_BLOGS, ...DUMMY_BLOGS];

  return (
    <section
      ref={addToRefs}
      className="scroll-section py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 bg-[var(--color-surface)] overflow-hidden"
      id="blogs"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
          <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">From Our Farm</span>
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">Latest Blogs</h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
      >
        {allBlogs.map((blog, index) => (
          <div
            key={`${blog.id}-${index}`}
            className="flex-shrink-0 w-72 md:w-80 bg-[var(--color-primary)] rounded-2xl overflow-hidden border border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <span className="text-[var(--color-secondary)] text-xs font-semibold opacity-70">{blog.date}</span>
              <h3 className="text-[var(--color-text)] font-bold text-sm leading-snug line-clamp-2">{blog.title}</h3>
              <p className="text-[var(--color-text-muted)] text-xs leading-relaxed line-clamp-3">{blog.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

LatestBlogs.displayName = 'LatestBlogs';
export default React.memo(LatestBlogs);
