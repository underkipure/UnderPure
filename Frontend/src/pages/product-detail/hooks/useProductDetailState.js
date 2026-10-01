import { useState, useEffect, useRef, useCallback } from "react";
import { fetchProduct, fetchProducts } from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { getApiBaseUrl } from "../../../lib/productUtils";
import { toast } from "sonner";

export function useProductDetailState(id, productDetailSettings) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [completeTheLookProducts, setCompleteTheLookProducts] = useState([]);
  const { isAuthenticated } = useAuthStore();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [recSlideIndex, setRecSlideIndex] = useState(0);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const galleryScrollRef = useRef(null);
  const recSliderRef = useRef(null);
  const galleryLengthRef = useRef(1);

  const scrollGallery = useCallback((direction) => {
    if (galleryScrollRef.current) {
      const scrollAmount = galleryScrollRef.current.clientWidth;
      galleryScrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }, [selectedColorIndex]);

  // Load Main Product
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProduct(id);
        if (res.product) {
          setProduct(res.product);
          setSelectedColorIndex(null);
          setSelectedSize("");
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Wishlist Sync
  useEffect(() => {
    if (isAuthenticated && product) {
      fetch(`${getApiBaseUrl()}/wishlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setIsInWishlist(
              data.some(
                (item) =>
                  item.id == product.id || item.product_id == product.id
              )
            );
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, product]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to lovelist");
      return;
    }
    if (isWishlistLoading || !product) return;

    setIsWishlistLoading(true);
    try {
      const method = isInWishlist ? "DELETE" : "POST";
      const res = await fetch(`${getApiBaseUrl()}/wishlist/${product.id}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to update lovelist");
      setIsInWishlist(!isInWishlist);
      toast.success(
        isInWishlist ? "Removed from lovelist" : "Added to lovelist"
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Complete The Look Products
  useEffect(() => {
    if (!product) return;

    const loadSameCategory = async () => {
      try {
        const categoryToFetch =
          product.category || product.category_id || product.categoryId;
        if (categoryToFetch) {
          const res = await fetchProducts(null, {
            category: categoryToFetch,
            limit: 10,
          });
          if (res?.products) {
            setCompleteTheLookProducts(
              res.products.filter((p) => p.id !== product.id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch Complete the Look products", err);
      }
    };

    loadSameCategory();
  }, [product]);

  // Related Products
  useEffect(() => {
    if (!product) return;

    const loadRelated = async () => {
      try {
        const config = productDetailSettings?.relatedProductsConfig || {};
        const sourceType = config.sourceType || "same-category";
        const targetBadge = config.badge || "";
        const targetCategory = config.categorySlug || "";
        const limit = Number(config.limit) || 4;

        let query = { limit: 100 };

        if (sourceType === "category-map") {
          const currentCatSlug = (
            product?.category ||
            product?.category_slug ||
            product?.categorySlug ||
            product?.category_label ||
            product?.category_id ||
            ""
          ).toString().toLowerCase();

          const mappings = config.categoryMappings || {};
          const mappedTarget =
            mappings[currentCatSlug] ||
            mappings[String(product?.category_id)] ||
            mappings[String(product?.category || "").toLowerCase()] ||
            "";

          if (mappedTarget && mappedTarget !== "same") {
            query.category = mappedTarget;
          } else {
            const categoryToFetch =
              product?.category || product?.category_id || product?.categoryId;
            if (categoryToFetch) query.category = categoryToFetch;
          }
        } else if (sourceType === "same-category") {
          const categoryToFetch =
            product?.category || product?.category_id || product?.categoryId;
          if (categoryToFetch) query.category = categoryToFetch;
        } else if (
          (sourceType === "category" || sourceType === "both") &&
          targetCategory
        ) {
          query.category = targetCategory;
        }

        const res = await fetchProducts(null, query);
        let prods = res.products || [];

        // Exclude currently viewed product
        if (product?.id) {
          prods = prods.filter((p) => p.id !== product.id);
        }

        // Apply badge filter if requested
        if (targetBadge && (sourceType === "badge" || sourceType === "both")) {
          const cleanTarget = targetBadge
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          prods = prods.filter((p) => {
            const bList = Array.isArray(p.badges)
              ? p.badges.map((b) => (typeof b === "object" ? b.name : b))
              : p.badge
                ? p.badge.split(",").map((b) => b.trim())
                : [];
            return bList.some(
              (b) =>
                (typeof b === "string" ? b : "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "") === cleanTarget
            );
          });
        }

        // Fallback: If filtered list is empty, fetch general catalog products
        if (prods.length === 0) {
          const fallbackRes = await fetchProducts(null, { limit: 12 });
          prods = (fallbackRes.products || []).filter(
            (p) => p.id !== product?.id
          );
        }

        setRelatedProducts(prods.slice(0, limit));
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };

    loadRelated();
  }, [product, productDetailSettings?.relatedProductsConfig]);

  // Gallery Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (sliderIndex === null) return;
      const len = galleryLengthRef.current || 1;
      if (e.key === "ArrowRight") {
        setSliderIndex((prev) => (prev !== null ? (prev + 1) % len : null));
        setIsZoomedIn(false);
      } else if (e.key === "ArrowLeft") {
        setSliderIndex((prev) =>
          prev !== null ? (prev - 1 + len) % len : null
        );
        setIsZoomedIn(false);
      } else if (e.key === "Escape") {
        setSliderIndex(null);
        setIsZoomedIn(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sliderIndex]);

  // Touch Swipe Handlers for Fullscreen Slider
  const onTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = (galleryLength) => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50 && galleryLength > 1) {
      setSliderIndex((prev) =>
        prev !== null ? (prev + 1) % galleryLength : null
      );
      setIsZoomedIn(false);
    } else if (distance < -50 && galleryLength > 1) {
      setSliderIndex((prev) =>
        prev !== null ? (prev - 1 + galleryLength) % galleryLength : null
      );
      setIsZoomedIn(false);
    }
  };

  return {
    product,
    loading,
    error,
    selectedColorIndex,
    setSelectedColorIndex,
    selectedSize,
    setSelectedSize,
    expandedAccordion,
    setExpandedAccordion,
    relatedProducts,
    completeTheLookProducts,
    isInWishlist,
    isWishlistLoading,
    toggleWishlist,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    sliderIndex,
    setSliderIndex,
    isZoomedIn,
    setIsZoomedIn,
    recSlideIndex,
    setRecSlideIndex,
    isReturnModalOpen,
    setIsReturnModalOpen,
    galleryScrollRef,
    recSliderRef,
    galleryLengthRef,
    scrollGallery,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
