import React from "react";
import { X } from "lucide-react";
import { useWriteReviewForm } from "../hooks/useWriteReviewForm";
import {
  ReviewStarRatingInput,
  ReviewFitSliderInput,
  ReviewMediaUploadInput,
  ReviewFormFields,
} from "./modal";

const WriteReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  user,
}) => {
  const {
    rating,
    setRating,
    sizeRating,
    setSizeRating,
    title,
    setTitle,
    text,
    setText,
    formAge,
    setFormAge,
    formSizePurchased,
    setFormSizePurchased,
    formTrueSize,
    setFormTrueSize,
    mediaFile,
    mediaPreview,
    handleMediaChange,
    handleSubmitInternal,
  } = useWriteReviewForm(onSubmit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-[800px] md:max-w-[900px] max-h-[85vh] md:max-h-[90vh] relative flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 shrink-0">
          <h3
            className="text-[18px] font-dala-italic uppercase tracking-widest text-black italic"
          >
            Write a Review
          </h3>
          <button onClick={onClose} className="text-black hover:opacity-70 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmitInternal}
          className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar"
        >
          {/* Rating */}
          <ReviewStarRatingInput rating={rating} setRating={setRating} />

          {/* Title, Text, Extra Selects, and User Info */}
          <ReviewFormFields
            title={title}
            setTitle={setTitle}
            text={text}
            setText={setText}
            formAge={formAge}
            setFormAge={setFormAge}
            formSizePurchased={formSizePurchased}
            setFormSizePurchased={setFormSizePurchased}
            formTrueSize={formTrueSize}
            setFormTrueSize={setFormTrueSize}
            user={user}
          />

          {/* Size Slider Input */}
          <ReviewFitSliderInput
            sizeRating={sizeRating}
            setSizeRating={setSizeRating}
          />

          {/* Media Upload */}
          <ReviewMediaUploadInput
            mediaPreview={mediaPreview}
            mediaFile={mediaFile}
            handleMediaChange={handleMediaChange}
          />

          {/* Submit Action Button */}
          <div className="mt-4 shrink-0 pb-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 text-[12px] hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
