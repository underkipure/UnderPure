import { useState } from "react";

export function useWriteReviewForm(onSubmit) {
  const [rating, setRating] = useState(5);
  const [sizeRating, setSizeRating] = useState(2); // 1: Small, 2: True, 3: Large
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [formAge, setFormAge] = useState("");
  const [formSizePurchased, setFormSizePurchased] = useState("");
  const [formTrueSize, setFormTrueSize] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    let base64Media = null;
    let mediaType = null;
    if (mediaFile) {
      base64Media = mediaPreview;
      mediaType = mediaFile.type.startsWith("video/") ? "video" : "image";
    }

    const payload = {
      rating,
      title,
      comment: text,
      size_rating: sizeRating,
      age_range: formAge,
      size_purchased: formSizePurchased,
      true_size: formTrueSize,
      media: base64Media,
      media_type: mediaType,
    };

    const success = await onSubmit(payload);
    if (success) {
      // Reset form fields
      setTitle("");
      setText("");
      setRating(5);
      setSizeRating(2);
      setFormAge("");
      setFormSizePurchased("");
      setFormTrueSize("");
      setMediaFile(null);
      setMediaPreview(null);
    }
  };

  return {
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
  };
}
