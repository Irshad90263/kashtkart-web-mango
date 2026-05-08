import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleBlog } from "../api/blogs";
import Footer from "../components/layout/Footer";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}%`;
      setScrollProgress(scroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(slug);
        setBlog(res.blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#FEF7E0] flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#C97E1A]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#C97E1A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-[#FEF7E0] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-black text-[#855D1E] mb-2">Not Found</h1>
      <Link to="/blogs" className="px-6 py-2 bg-[#C97E1A] text-white rounded-full font-bold text-sm">Back</Link>
    </div>
  );

  return (
    <div className="bg-[#FEF7E0] min-h-screen font-['Poppins'] text-[#4A371B]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 h-1.5 bg-[#C97E1A] z-50 transition-all duration-150" style={{ width: scrollProgress }}></div>

      {/* Compact Banner Section */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${blog.image})`,
            opacity: 0.35
          }}
        ></div>
        {/* Yellow/Orange Blend Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C97E1A]/70 via-[#F5D98F]/60 to-[#FEF7E0]"></div>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto -mt-28">
          {/* Breadcrumb - Now Left Aligned */}
          <div className="mb-6 flex items-center gap-1 text-[13px] justify-start px-4 md:px-8">
            <Link to="/" className="text-white font-black drop-shadow-md">Home</Link>
            <span className="text-white/80 mx-1">/</span>
            <span className="text-white font-bold drop-shadow-md truncate max-w-[200px] md:max-w-md">{blog.title}</span>
          </div>

          {/* Centered Heading Content */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-block px-3 py-1 mb-3 rounded-full bg-white/30 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/40">
              Journal
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-3 text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md opacity-90">
              <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span>KAASHTKART</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Tighter Margins */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Share - Compact */}
          <aside className="md:w-12 flex md:flex-col gap-3 items-center md:sticky md:top-24 h-fit">
             {[ 'facebook-f', 'twitter', 'whatsapp' ].map((icon) => (
               <button key={icon} className="w-9 h-9 rounded-full bg-white/50 border border-[#F5D98F] flex items-center justify-center text-[#855D1E] hover:bg-[#C97E1A] hover:text-white transition-all shadow-sm">
                 <i className={`fab fa-${icon} text-xs`}></i>
               </button>
             ))}
          </aside>

          {/* Content Area - Filling space better */}
          <div className="flex-1 max-w-3xl">
            <div 
              className="prose prose-stone max-w-none text-[#5A4A2A] blog-body-content"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
            
            {/* Tighter Tags Section */}
            <footer className="mt-10 pt-6 border-t border-[#F5D98F]/60">
              <div className="flex flex-wrap gap-2">
                {['Premium', 'Organic', 'KaashtKart'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/40 text-[#855D1E] rounded text-[9px] font-black uppercase tracking-wider">#{tag}</span>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-body-content { font-family: 'Poppins', sans-serif; line-height: 1.7; }
        .blog-body-content h2 { font-size: 1.6rem; font-weight: 900; color: #4A371B; margin: 2rem 0 0.75rem; letter-spacing: -0.01em; }
        .blog-body-content h3 { font-size: 1.25rem; font-weight: 800; color: #855D1E; margin: 1.5rem 0 0.5rem; }
        .blog-body-content p { margin-bottom: 1.2rem; font-size: 1rem; color: #4A371B; opacity: 0.95; }
        .blog-body-content img { border-radius: 12px; margin: 1.5rem 0; width: 100%; box-shadow: 0 8px 25px rgba(133, 93, 30, 0.06); border: 3px solid white; }
        .blog-body-content blockquote { padding: 1.5rem; background: rgba(255,255,255,0.4); border-radius: 12px; border-left: 5px solid #C97E1A; font-style: italic; font-size: 1.15rem; margin: 2rem 0; color: #4A371B; }
        .blog-body-content ul { list-style: none; padding-left: 0; margin-bottom: 1.5rem; }
        .blog-body-content ul li { position: relative; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .blog-body-content ul li::before { content: ""; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; background: #C97E1A; border-radius: 1px; }
      `}} />
      <Footer />
    </div>
  );
};

export default BlogDetail;