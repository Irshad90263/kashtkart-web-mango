import React, { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { addReview } from "../../api/reviews";

const ReviewModal = ({ isOpen, onClose, productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!remark.trim()) {
      toast.error("Please write a remark");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(productId, { rating, remark });
      toast.success("Review submitted successfully!");
      if (onReviewAdded) onReviewAdded();
      onClose();
      // Reset form
      setRating(0);
      setRemark("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#FEF9EF]">
          <h2 className="text-xl font-bold text-[#2C2418]">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-[#C97E1A] text-[#C97E1A]"
                        : "fill-gray-200 text-gray-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#C97E1A] focus:border-transparent transition-all resize-none text-gray-700"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C97E1A] hover:bg-[#9A5E10] text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
