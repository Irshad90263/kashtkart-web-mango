import React, { useRef, useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../../api/blogs";

const LatestBlogs = memo(({ addToRefs }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getPublishedBlogs(1, 10); // Fetch top 10 blogs
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const shouldScroll = blogs.length >= 4;

  useEffect(() => {
    if (blogs.length === 0 || !shouldScroll) return;
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

    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const onEnter = () => {
      isHovered = true;
      stop();
    };
    const onLeave = () => {
      isHovered = false;
      start();
    };

    setTimeout(start, 300);
    container.addEventListener("mouseenter", onEnter, { passive: true });
    container.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      stop();
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [blogs, shouldScroll]);

  // Duplicate blogs for infinite scroll effect only if there are enough blogs
  const allBlogs = shouldScroll ? [...blogs, ...blogs] : blogs;

  if (blogs.length === 0) return null;

  return (
    <section
      ref={addToRefs}
      className="scroll-section py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 bg-[var(--color-surface)] overflow-hidden"
      id="blogs"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
          <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">
            From Our Farm
          </span>
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">
          Latest Blogs
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
      >
        {allBlogs.map((blog, index) => (
          <Link
            to={`/blog/${blog.slug || blog._id}`}
            key={`${blog._id}-${index}`}
            className="flex-shrink-0 w-72 md:w-80 bg-[var(--color-primary)] rounded-2xl overflow-hidden border border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer block group"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <span className="text-[var(--color-secondary)] text-xs font-semibold opacity-70">
                {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <h3 className="text-[var(--color-text)] font-bold text-sm leading-snug line-clamp-2 group-hover:text-[var(--color-secondary)] transition-colors">
                {blog.title}
              </h3>
              <div 
                className="text-[var(--color-text-muted)] text-xs leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: blog.description?.replace(/<[^>]*>/g, '') }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});

LatestBlogs.displayName = "LatestBlogs";
export default React.memo(LatestBlogs);
