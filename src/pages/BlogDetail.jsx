import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSingleBlog, addBlogComment, getPublishedBlogs } from "../api/blogs";
import { getUserData } from "../utils/auth";
import { toast } from "react-toastify";
import Footer from "../components/layout/Footer";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Live Search Suggestions Logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
        return;
      }
      
      setShowSuggestions(true);
      setIsSearching(true);

      try {
        const res = await getPublishedBlogs(1, 5, searchQuery);
        setSuggestions(res.blogs || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(slug);
        setBlog(res.blog);

        // Use real related blogs from API
        if (res.blog.relatedBlog) {
          setRelatedBlogs(res.blog.relatedBlog);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCommentSubmit = async () => {
    const userData = getUserData();
    if (!userData) {
      toast.error("Please login to leave a comment");
      return;
    }

    if (!comment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      await addBlogComment(blog._id, {
        user: userData._id || userData.id,
        comment: comment.trim()
      });
      toast.success("Comment submitted successfully!");
      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FEF9EF] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#C97E1A]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#C97E1A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-[#FEF9EF] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black text-[#5C3D1A] mb-2">Not Found</h1>
        <Link
          to="/blogs"
          className="px-6 py-2 bg-[#C97E1A] text-white rounded-full font-bold text-sm hover:bg-[#B06E12] transition"
        >
          Back to Blogs
        </Link>
      </div>
    );

  return (
    <div className="bg-[#FEF9EF] min-h-screen font-['Inter'] text-[#2C2418]">
      {/* Hero Section - Plain image with corner orange overlays */}
      <div className="relative w-full h-[450px] md:h-[500px] lg:h-[500px] overflow-hidden">
        {/* Plain background image - NO color overlay on full image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${blog.image})`,
          }}
        ></div>

        {/* Bottom to Top Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2418]/80 via-[#2C2418]/20 to-transparent z-10"></div>

        {/* Content overlay */}
        <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 z-20">
          {/* Breadcrumb - Top left corner with subtle orange background */}
          <div className="absolute top-6 left-6 md:left-12 lg:left-6 z-30 font-['Poppins']">
            <div className="bg-[#C97E1A]/85 backdrop-blur-sm pl-5 pr-6 py-2.5 rounded-full shadow-lg border border-white/30 flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Link
                  to="/"
                  className="text-white hover:text-[#FEF9EF] transition flex items-center gap-1"
                >
                  <i className="fas fa-home text-xs"></i>
                  <span>Home</span>
                </Link>
                <span className="text-white/60 text-xs">/</span>
                <Link
                  to="/blogs"
                  className="text-white/90 hover:text-white transition"
                >
                  Blogs
                </Link>
                <span className="text-white/60 text-xs">/</span>
                <span className="text-white font-medium text-[11px] uppercase tracking-wide truncate max-w-[150px] md:max-w-[250px]">
                  {blog.title}
                </span>
              </div>
            </div>
          </div>

          {/* Title at LEFT BOTTOM corner with orange overlay background for readability */}
          <div className="absolute bottom-8 left-6 md:left-12 lg:left-16 z-20 max-w-4xl">
            {/* Gradient is now global at line 93 */}

            <div className="relative">
              <div className="inline-block px-4 py-1.5 mb-3 rounded-full bg-[#C97E1A]/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                <i className="fas fa-leaf mr-1 text-[10px]"></i> BLOG POST
              </div>
              <h1
                style={{ color: "#fff" }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold drop-shadow-lg"
              >
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-white text-sm">
                <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="far fa-calendar-alt text-xs"></i>
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="far fa-clock text-xs"></i>8 min read
                </span>
                <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="fas fa-leaf text-xs"></i>
                  KaashtKart
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Column Layout */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* LEFT COLUMN - Main Blog Content */}
          <div className="flex-1 min-w-0">
            {/* Author & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E6D5B8]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C97E1A] flex items-center justify-center text-white font-bold text-lg">
                  KK
                </div>
                <div>
                  <p className="font-bold text-[#2C2418]">KaashtKart</p>
                  <p className="text-sm text-[#7A6B50]">
                    Mango Expert
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-[#7A6B50]">Share:</span>
                <button className="w-9 h-9 rounded-full bg-white border border-[#E6D5B8] flex items-center justify-center text-[#5C3D1A] hover:bg-[#C97E1A] hover:text-white hover:border-[#C97E1A] transition-all">
                  <i className="fab fa-facebook-f text-sm"></i>
                </button>
                <button className="w-9 h-9 rounded-full bg-white border border-[#E6D5B8] flex items-center justify-center text-[#5C3D1A] hover:bg-[#C97E1A] hover:text-white hover:border-[#C97E1A] transition-all">
                  <i className="fab fa-twitter text-sm"></i>
                </button>
                <button className="w-9 h-9 rounded-full bg-white border border-[#E6D5B8] flex items-center justify-center text-[#5C3D1A] hover:bg-[#C97E1A] hover:text-white hover:border-[#C97E1A] transition-all">
                  <i className="fab fa-linkedin-in text-sm"></i>
                </button>
                <button className="w-9 h-9 rounded-full bg-white border border-[#E6D5B8] flex items-center justify-center text-[#5C3D1A] hover:bg-[#C97E1A] hover:text-white hover:border-[#C97E1A] transition-all">
                  <i className="far fa-bookmark text-sm"></i>
                </button>
              </div>
            </div>

            {/* Blog Body Content */}
            <div
              className="prose prose-lg max-w-none blog-body-content"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            {/* Tags Section */}
            {/* <div className="mt-12 pt-8 border-t border-[#E6D5B8]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-[#2C2418]">
                  Tags:
                </span>
                {[
                  "Castor Oil",
                  "Natural Beauty",
                  "Wellness",
                  "Hair Care",
                  "Skincare",
                ].map((tag) => (
                  <Link
                    key={tag}
                    to={`/blogs/tag/${tag.toLowerCase()}`}
                    className="px-3 py-1.5 bg-white border border-[#E6D5B8] rounded-full text-[#7A6B50] text-xs font-medium hover:bg-[#C97E1A] hover:text-white hover:border-[#C97E1A] transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div> */}

            {/* Comments Section Preview */}
            <div className="mt-12 pt-8 border-t border-[#E6D5B8]">
              <h3 className="text-xl font-bold text-[#2C2418] mb-6">
                Leave a Comment
              </h3>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0E6D5]">
                <textarea
                  placeholder="Share your thoughts..."
                  rows="4"
                  className="w-full px-4 py-3 border border-[#E6D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C97E1A] focus:border-transparent resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submittingComment}
                ></textarea>
                <button 
                  className="mt-4 px-6 py-2.5 bg-[#C97E1A] text-white font-semibold rounded-full hover:bg-[#B06E12] transition text-sm disabled:opacity-50"
                  onClick={handleCommentSubmit}
                  disabled={submittingComment}
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Related Blogs Sidebar */}
          <div className="lg:w-[360px] flex-shrink-0">
            {/* Sticky Sidebar */}
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Search Box */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0E6D5]">
                <h3 className="font-bold text-[#2C2418] mb-4 flex items-center gap-2">
                  <i className="fas fa-search text-[#C97E1A] text-sm"></i>
                  Search Articles
                </h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full px-4 py-3.5 pr-12 border border-[#E6D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C97E1A] text-sm shadow-inner bg-gray-50/30 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                    onKeyPress={(e) => e.key === "Enter" && navigate(`/blogs?search=${searchQuery}`)}
                  />
                  
                  {/* Enhanced Suggestions Modal-like Box */}
                  {showSuggestions && searchQuery.trim().length >= 2 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#E6D5B8] z-[100] overflow-hidden transform transition-all duration-300">
                      <div className="p-3 bg-gray-50/80 border-b border-[#F0E6D5] flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#7A6B50] uppercase tracking-wider">Search Results</span>
                        {isSearching ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#C97E1A] font-medium animate-pulse">Searching...</span>
                            <div className="w-3 h-3 border-2 border-[#C97E1A] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#C97E1A] font-bold">{suggestions.length} Found</span>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {suggestions.length > 0 ? (
                          suggestions.map((s) => (
                            <div 
                              key={s._id}
                              onClick={() => {
                                navigate(`/blog/${s.slug || s._id}`);
                                setSearchQuery("");
                                setShowSuggestions(false);
                              }}
                              className="flex items-center gap-4 p-4 hover:bg-[#FEF7E0] cursor-pointer transition-all border-b border-[#F0E6D5] last:border-0 group/item"
                            >
                              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#E6D5B8]">
                                <img 
                                  src={s.image} 
                                  alt={s.title} 
                                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-[#2C2418] line-clamp-2 leading-snug group-hover/item:text-[#C97E1A] transition-colors">
                                  {s.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <p className="text-[10px] text-[#7A6B50] flex items-center gap-1">
                                    <i className="far fa-calendar-alt text-[#C97E1A]"></i>
                                    {new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <i className="fas fa-search-minus text-gray-300 text-2xl"></i>
                            </div>
                            <p className="text-sm font-bold text-[#2C2418]">No articles found</p>
                            <p className="text-xs text-[#7A6B50] mt-1">Try a different keyword</p>
                          </div>
                        )}
                      </div>

                      {suggestions.length > 0 && (
                        <div 
                          onClick={() => navigate(`/blogs?search=${searchQuery}`)}
                          className="p-3 text-center bg-white hover:bg-[#FEF7E0] transition-colors border-t border-[#F0E6D5] cursor-pointer"
                        >
                          <span className="text-xs font-bold text-[#C97E1A] flex items-center justify-center gap-2">
                            View All Results <i className="fas fa-external-link-alt text-[10px]"></i>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/blogs?search=${searchQuery}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#C97E1A] text-white rounded-xl flex items-center justify-center hover:bg-[#B06E12] shadow-sm transition-all active:scale-95"
                  >
                    <i className="fas fa-search text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Related Posts Heading */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0E6D5]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl text-[#2C2418] flex items-center gap-2">
                    <i className="fas fa-layer-group text-[#C97E1A] text-base"></i>
                    Related Posts
                  </h3>
                  <Link
                    to="/blogs"
                    className="text-xs text-[#C97E1A] font-medium fony-[poppins]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="space-y-5">
                  {relatedBlogs.map((related) => (
                    <Link
                      key={related._id}
                      to={`/blog/${related.slug}`}
                      className="group flex gap-3 items-start hover:bg-[#FEF5E8] -mx-2 p-2 rounded-xl transition"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#E6D5B8]">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#C97E1A] font-medium mb-1">
                          {new Date(related.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" },
                          )}
                        </p>
                        <h4 className="font-bold text-sm text-[#2C2418] group-hover:text-[#C97E1A] transition line-clamp-2">
                          {related.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories Widget */}
              {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0E6D5]">
                <h3 className="font-bold text-[#2C2418] mb-4 flex items-center gap-2">
                  <i className="fas fa-folder-open text-[#C97E1A] text-sm"></i>
                  Categories
                </h3>
                <div className="space-y-2">
                  {[
                    "Hair Care",
                    "Skincare",
                    "Wellness",
                    "Ayurveda",
                    "Natural Oils",
                  ].map((cat) => (
                    <Link
                      key={cat}
                      to={`/blogs/category/${cat.toLowerCase()}`}
                      className="flex items-center justify-between py-2 border-b border-[#F0E6D5] last:border-0 group"
                    >
                      <span className="text-[#5C4B2E] group-hover:text-[#C97E1A] transition text-sm">
                        {cat}
                      </span>
                      <span className="text-xs text-[#B8A88A]">12</span>
                    </Link>
                  ))}
                </div>
              </div> */}

              {/* Newsletter Signup */}
              {/* <div className="bg-gradient-to-br from-[#FEF0E0] to-[#FCE8D4] rounded-2xl p-6 border border-[#E6D5B8]">
                <div className="text-center">
                  <i className="fas fa-envelope-open-text text-3xl text-[#C97E1A] mb-3"></i>
                  <h3 className="font-bold text-[#2C2418] mb-2">
                    Weekly Wellness
                  </h3>
                  <p className="text-sm text-[#7A6B50] mb-4">
                    Get natural tips & stories straight to your inbox
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="flex-1 px-3 py-2 text-sm border border-[#E6D5B8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C97E1A]"
                    />
                    <button className="px-4 py-2 bg-[#C97E1A] text-white rounded-full text-sm font-semibold hover:bg-[#B06E12] transition">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles for Blog Content */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-body-content {
          color: #2C2418;
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .blog-body-content h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #2C2418;
          letter-spacing: -0.02em;
        }
        .blog-body-content h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #3D2E1A;
          letter-spacing: -0.01em;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #F0E6D5;
        }
        .blog-body-content h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #C97E1A;
        }
        .blog-body-content p {
          margin-bottom: 1.25rem;
          color: #3A3224;
          line-height: 1.75;
        }
        .blog-body-content img {
          border-radius: 20px;
          margin: 2rem 0;
          width: 100%;
          box-shadow: 0 10px 35px rgba(0,0,0,0.05);
          border: 1px solid #F0E6D5;
        }
        .blog-body-content blockquote {
          padding: 1.5rem 2rem;
          background: #FEF5E8;
          border-radius: 20px;
          border-left: 5px solid #C97E1A;
          font-style: italic;
          margin: 1.8rem 0;
          color: #5C4B2E;
          font-size: 1.1rem;
        }
        .blog-body-content ul, .blog-body-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .blog-body-content li {
          margin-bottom: 0.5rem;
          color: #3A3224;
        }
        .blog-body-content ul li::marker {
          color: #C97E1A;
        }
        .blog-body-content strong {
          color: #C97E1A;
          font-weight: 700;
        }
        .blog-body-content a {
          color: #C97E1A;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .blog-body-content a:hover {
          color: #9A5E10;
        }
        @media (max-width: 768px) {
          .blog-body-content h1 { font-size: 1.8rem; }
          .blog-body-content h2 { font-size: 1.5rem; }
          .blog-body-content h3 { font-size: 1.2rem; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `,
        }}
      />

      <Footer />
    </div>
  );
};

export default BlogDetail;
