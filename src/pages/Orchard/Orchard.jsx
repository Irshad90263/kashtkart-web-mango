import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../../components/layout/Footer";
import { getActiveOrchards } from "../../api/orchard";

const Orchard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const data = await getActiveOrchards();
      setImages(data);
      setLoading(false);
    };
    fetchImages();
  }, []);

  const openLightbox = (index) => setSelectedIdx(index);
  const closeLightbox = () => setSelectedIdx(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-[var(--color-primary)] min-h-screen">
      {/* Header */}
      <section className="relative py-16 px-8 text-center bg-gradient-to-b from-yellow-400/20 to-transparent">
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
          Our Orchards
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto italic text-lg">
          Take a glimpse into the heart of KaashtKart. Where nature meets tradition to bring you the finest mangoes.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-[1440px] mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 opacity-50 italic">
            No orchard images available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div
                key={img._id || index}
                onClick={() => openLightbox(index)}
                className="group cursor-pointer bg-[var(--color-surface)] rounded-md overflow-hidden border border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={img.image?.url}
                    alt="Orchard View"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 top-24 z-[2000] bg-black/70 flex items-center justify-center p-4 md:p-10 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute cursor-pointer top-6 right-6 text-white hover:text-[var(--color-secondary)] transition-colors p-2 z-[2001]"
          >
            <X size={32} />
          </button>

          {/* Prev Button */}
          <button
            onClick={prevImage}
            className="absolute cursor-pointer left-4 md:left-10 text-white/50 hover:text-white transition-all p-2 bg-white/10 rounded-full hover:bg-white/20 z-[2001]"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image Wrapper */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIdx].image?.url}
              alt="Orchard View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoomIn"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute cursor-pointer right-4 md:right-10 text-white/50 hover:text-white transition-all p-2 bg-white/10 rounded-full hover:bg-white/20 z-[2001]"
          >
            <ChevronRight size={40} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
            {selectedIdx + 1} / {images.length}
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-zoomIn { animation: zoomIn 0.3s ease-out; }
      `,
        }}
      />

      <Footer />
    </div>
  );
};

export default Orchard;
