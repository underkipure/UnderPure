import { useState, useEffect, useCallback } from "react";
import { fetchProducts, fetchProduct, deleteProduct } from "../../../../lib/api";
import { toast } from "sonner";
import { getProductStatus } from "../utils/adminProductHelpers";

const PAGE_SIZE = 20;

export function useAdminProductsState({ token }) {
  const [adminProducts, setAdminProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load products from server
  const loadAdminProducts = useCallback(
    async (pageNumber = 1, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          page: pageNumber,
          limit: PAGE_SIZE,
        };
        if (filterCategory) params.category = filterCategory;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const res = await fetchProducts(token, params);
        const prods = res?.products || (Array.isArray(res) ? res : []);
        const total = res?.total ?? prods.length;
        const more = res?.hasMore ?? false;

        if (append) {
          setAdminProducts((prev) => [...prev, ...prods]);
        } else {
          setAdminProducts(prods);
        }
        setTotalCount(total);
        setHasMore(more);
        setPage(pageNumber);
      } catch (err) {
        console.error("Failed to load admin products:", err);
        toast.error("Failed to load products from server");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [token, filterCategory, debouncedSearch]
  );

  useEffect(() => {
    loadAdminProducts(1, false);
  }, [loadAdminProducts]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadAdminProducts(page + 1, true);
    }
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(token, productToDelete);
      setAdminProducts((prev) =>
        prev.filter((p) => p.id !== productToDelete)
      );
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setProductToDelete(null);
    }
  };

  const filtered = filterStatus
    ? adminProducts.filter((p) => getProductStatus(p) === filterStatus)
    : adminProducts;

  const updateProductInList = useCallback((updatedProduct) => {
    if (!updatedProduct || !updatedProduct.id) return;
    setAdminProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
  }, []);

  const refreshProducts = useCallback(
    async ({ isEdit, editingId, payload } = {}) => {
      if (isEdit && editingId) {
        try {
          const res = await fetchProduct(editingId);
          const fresh = res?.product || res;
          if (fresh && (fresh.id || fresh.name)) {
            setAdminProducts((prev) =>
              prev.map((p) => (p.id === editingId ? { ...p, ...fresh } : p))
            );
            return;
          }
        } catch (err) {
          console.warn("Single product fetch failed during refresh:", err);
        }

        // Fallback: merge payload if fetchProduct didn't return expected object
        if (payload) {
          setAdminProducts((prev) =>
            prev.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    ...payload,
                    images: payload.images || p.images,
                    category_ids: payload.category_ids || p.category_ids,
                  }
                : p
            )
          );
        }
      } else {
        // New product added: reload from page 1
        await loadAdminProducts(1, false);
      }
    },
    [loadAdminProducts]
  );

  return {
    adminProducts,
    setAdminProducts,
    updateProductInList,
    filtered,
    loading,
    isLoadingMore,
    totalCount,
    hasMore,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    productToDelete,
    setProductToDelete,
    handleLoadMore,
    handleDelete,
    confirmDelete,
    refreshProducts,
  };
}
