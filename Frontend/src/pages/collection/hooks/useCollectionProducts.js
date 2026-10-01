import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchProducts, fetchSizeClasses } from '../../../lib/api';
import { getProductSizes, getProductColors } from '../utils/collectionHelpers';

export function useCollectionProducts(collectionSettings) {
  const params = useParams();
  const categoryId = (params['*'] || '').replace(/\/$/, '');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  const badgeQuery = queryParams.get('badge');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbSizes, setDbSizes] = useState([]);

  const PAGE_SIZE = 24;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter States
  const [activeFilters, setActiveFilters] = useState({
    sort: 'newest',
    sizes: [],
    colors: [],
    types: [],
    minPrice: '',
    maxPrice: '',
  });

  const buildPayload = useCallback(
    (pageNumber = 1) => {
      const searchParams = new URLSearchParams(location.search);
      const badgeParam = searchParams.get('badge');

      const payload = {
        page: pageNumber,
        limit: PAGE_SIZE,
      };

      if (categoryId !== 'search' && categoryId !== 'all') {
        payload.category = categoryId;
      }
      if (searchQuery) {
        payload.search = searchQuery;
      }
      if (badgeParam) {
        payload.badge = badgeParam;
      }
      if (activeFilters.sort) {
        payload.sort = activeFilters.sort;
      }
      if (activeFilters.minPrice) {
        payload.minPrice = activeFilters.minPrice;
      }
      if (activeFilters.maxPrice) {
        payload.maxPrice = activeFilters.maxPrice;
      }
      if (activeFilters.sizes && activeFilters.sizes.length > 0) {
        payload.sizes = activeFilters.sizes
          .map((s) => (typeof s === 'object' ? s.name : s))
          .join(',');
      }
      if (activeFilters.colors && activeFilters.colors.length > 0) {
        payload.colors = activeFilters.colors
          .map((c) => (typeof c === 'object' ? c.name || c.color : c))
          .join(',');
      }

      return payload;
    },
    [categoryId, searchQuery, location.search, activeFilters]
  );

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const payload = buildPayload(1);
        const res = await fetchProducts(null, payload);
        const fetchedProds = res.products || [];

        setProducts(fetchedProds);
        setTotalCount(res.total !== undefined ? res.total : fetchedProds.length);
        setHasMore(
          res.hasMore !== undefined
            ? res.hasMore
            : fetchedProds.length >= PAGE_SIZE
        );

        // Fetch DB sizes once if not loaded
        if (dbSizes.length === 0) {
          try {
            const sizeRes = await fetchSizeClasses();
            let allSizes = new Set();
            if (sizeRes && Array.isArray(sizeRes)) {
              sizeRes.forEach((sc) => {
                if (sc.sizes && Array.isArray(sc.sizes)) {
                  sc.sizes.forEach((s) => allSizes.add(s));
                }
              });
            }
            if (allSizes.size > 0) {
              setDbSizes(Array.from(allSizes));
            }
          } catch (e) {
            console.error('Failed to fetch size classes', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products for category', err);
        setProducts([]);
        setTotalCount(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [categoryId, searchQuery, location.search, activeFilters, buildPayload]);

  const loadMoreFromServer = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const payload = buildPayload(nextPage);
      const res = await fetchProducts(null, payload);
      const newProds = res.products || [];

      setProducts((prev) => [...prev, ...newProds]);
      setCurrentPage(nextPage);
      setTotalCount(
        res.total !== undefined
          ? res.total
          : products.length + newProds.length
      );
      setHasMore(
        res.hasMore !== undefined
          ? res.hasMore
          : newProds.length >= PAGE_SIZE
      );
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Derived Filter Options
  const availableSizes = useMemo(() => {
    const sizes = new Set(dbSizes);
    products.forEach((p) => {
      getProductSizes(p).forEach((s) => sizes.add(s));
    });
    return Array.from(sizes);
  }, [products, dbSizes]);

  const availableColors = useMemo(() => {
    const colors = new Set();
    products.forEach((p) => {
      getProductColors(p).forEach((c) => colors.add(c));
    });
    return Array.from(colors);
  }, [products]);

  const availableTypes = useMemo(() => {
    const typeCount = {};
    products.forEach((p) => {
      const typeName =
        p.type ||
        p.category?.name ||
        (typeof p.category === 'string' ? p.category : null);
      if (typeName) {
        typeCount[typeName] = (typeCount[typeName] || 0) + 1;
      }
    });
    return Object.keys(typeCount)
      .map((name) => ({ name, count: typeCount[name] }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Derived Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Size Filter
    if (activeFilters.sizes.length > 0) {
      result = result.filter((p) => {
        const pSizes = getProductSizes(p);
        return activeFilters.sizes.some((filterSize) => {
          const rawFilter =
            typeof filterSize === 'object' ? filterSize.name : filterSize;
          const target = String(rawFilter || '')
            .trim()
            .toLowerCase();
          if (!target) return false;
          for (const s of pSizes) {
            if (String(s).trim().toLowerCase() === target) {
              return true;
            }
          }
          return false;
        });
      });
    }

    // Type Filter
    if (activeFilters.types.length > 0) {
      result = result.filter((p) => {
        const typeName =
          p.type ||
          p.category?.name ||
          (typeof p.category === 'string' ? p.category : null);
        return typeName && activeFilters.types.includes(typeName);
      });
    }

    // Color Filter
    if (activeFilters.colors.length > 0) {
      result = result.filter((p) => {
        const pColors = getProductColors(p);
        return activeFilters.colors.some((filterColor) => {
          const rawFilter =
            typeof filterColor === 'object' ? filterColor.name : filterColor;
          const target = String(rawFilter || '')
            .trim()
            .toLowerCase();
          if (!target) return false;
          for (const c of pColors) {
            if (String(c).trim().toLowerCase() === target) {
              return true;
            }
          }
          return false;
        });
      });
    }

    // Price Filter
    if (activeFilters.minPrice !== '') {
      result = result.filter(
        (p) => parseFloat(p.price) >= parseFloat(activeFilters.minPrice)
      );
    }
    if (activeFilters.maxPrice !== '') {
      result = result.filter(
        (p) => parseFloat(p.price) <= parseFloat(activeFilters.maxPrice)
      );
    }

    // Sort
    const sortId =
      activeFilters.sort || collectionSettings?.defaultSort || 'newest';

    if (sortId === 'price-asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortId === 'price-desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortId === 'basics' || sortId === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortId === 'trending' || sortId === 'best-selling') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // newest
      result.sort(
        (a, b) =>
          new Date(b.created_at || Date.now()) -
          new Date(a.created_at || Date.now())
      );
    }

    return result;
  }, [products, activeFilters, collectionSettings?.defaultSort]);

  return {
    categoryId,
    searchQuery,
    badgeQuery,
    products,
    loading,
    totalCount,
    hasMore,
    isLoadingMore,
    activeFilters,
    setActiveFilters,
    loadMoreFromServer,
    availableSizes,
    availableColors,
    availableTypes,
    filteredProducts,
  };
}
