import { create } from 'zustand';
import { fetchProducts } from '../lib/api';

const CACHE_KEY = 'underpure_products_cache';
const CACHE_TIME_KEY = 'underpure_products_cache_time';
const FRESHNESS_TTL = 180000; // 3 minutes freshness

const getStoredProducts = () => {
  try {
    const p = localStorage.getItem(CACHE_KEY);
    return p ? JSON.parse(p) : [];
  } catch {
    return [];
  }
};

const getStoredTime = () => {
  try {
    const t = localStorage.getItem(CACHE_TIME_KEY);
    return t ? parseInt(t, 10) : 0;
  } catch {
    return 0;
  }
};

let activeProductsPromise = null;
let lastLoadTime = getStoredTime();

export const useProductStore = create((set, get) => ({
  products: getStoredProducts(),
  loading: false,
  error: null,
  _loaded: getStoredProducts().length > 0,

  /** Load all public products from backend with SWR caching */
  loadProducts: async (options = {}) => {
    const currentProducts = get().products;
    const hasData = Array.isArray(currentProducts) && currentProducts.length > 0;
    const isFresh = hasData && (Date.now() - lastLoadTime < FRESHNESS_TTL);

    // If data is fresh and no forced reload requested, return instantly from memory
    if (isFresh && !options.force) {
      return currentProducts;
    }

    // Reuse existing in-flight request to avoid duplicate fetches
    if (activeProductsPromise) {
      return activeProductsPromise;
    }

    // Only show loading spinner if we have NO data in cache yet
    if (!hasData) {
      set({ loading: true, error: null });
    }

    activeProductsPromise = (async () => {
      try {
        const data = await fetchProducts(null);
        const products = Array.isArray(data) ? data : (data?.products ?? []);
        
        lastLoadTime = Date.now();
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(products));
          localStorage.setItem(CACHE_TIME_KEY, lastLoadTime.toString());
        } catch (e) {}

        set({ products, loading: false, _loaded: true, error: null });
        return products;
      } catch (error) {
        set({ error: error.message, loading: false, _loaded: true });
        return get().products;
      } finally {
        activeProductsPromise = null;
      }
    })();

    return activeProductsPromise;
  },

  /** Refetch products (forces fresh data from backend) */
  refreshProducts: async () => {
    return get().loadProducts({ force: true });
  }
}));
