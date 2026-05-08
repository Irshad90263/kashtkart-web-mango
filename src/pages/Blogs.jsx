import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../api/blogs";
import Footer from "../components/layout/Footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getPublishedBlogs(1, 100); // Fetch latest blogs
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FEF7E0] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C97E1A]"></div>
    </div>
  );

  // Featured post (first one with larger layout)
  const featuredPost = blogs[0];
  const remainingPosts = blogs.slice(1);

  return (
    <div className="bg-[#FEF7E0] font-['Poppins','Inter',sans-serif] min-h-screen">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-[#B97F10] font-medium text-sm">Home</Link>
          <span className="text-[#9C7A3E] mx-1">/</span>
          <span className="text-[#5A4A2A] font-medium text-sm">Blogs</span>
        </div>

        {/* Blog Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F5D98F]/30 px-4 py-2 rounded-full mb-4">
            <i className="fas fa-pen-fancy text-[#C97E1A] text-sm"></i>
            <span className="text-[#B97A1A] text-sm font-medium">Our Latest Stories</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#AD7A2C] tracking-tight mb-3">
            Mango<span className="text-[#D9921E]">Blog</span>
          </h1>
          <p className="text-base md:text-lg text-[#7A6233] max-w-2xl mx-auto">
            Insights, stories, and updates from the world of premium mangoes and thoughtful gifting
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[#855D1E]">No blogs published yet.</h2>
            <p className="text-[#7A6233] mt-2">Check back soon for fresh updates!</p>
          </div>
        ) : (
          <>
            {/* All Blog Posts Grid */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#855D1E]">
                  Latest Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {blogs.map((post) => (
                  <article 
                    key={post._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#FFEFC0] group flex flex-col"
                  >
                    {/* Compact Image Container */}
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-[#C97E1A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          ARTICLE
                        </span>
                      </div>
                    </div>
                    
                    {/* Compact Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#B8A56A] mb-2 uppercase tracking-wider">
                        <i className="far fa-calendar-alt"></i> 
                        {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                      <h3 className="text-lg font-bold text-[#855D1E] mb-2 line-clamp-2 leading-tight hover:text-[#AD7A2C] transition-colors cursor-pointer">
                        <Link to={`/blog/${post.slug || post._id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <div 
                        className="text-[#6D5734] text-xs leading-relaxed mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.description?.replace(/<[^>]*>/g, '').substring(0, 80) + '...' }}
                      />
                      <div className="mt-auto">
                        <Link to={`/blog/${post.slug || post._id}`} className="text-[#C97E1A] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                          READ STORY <i className="fas fa-arrow-right text-[10px]"></i>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}

        

      </div>

     <Footer />
    </div>
  );
};

export default Blog;