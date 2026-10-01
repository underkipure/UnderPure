import { create } from 'zustand';
import { fetchCategories } from '../lib/api';

const CACHE_KEY = 'underpure_categories_cache';
const CACHE_TIME_KEY = 'underpure_categories_cache_time';
const FRESHNESS_TTL = 300000; // 5 minutes freshness

const getStoredCategories = () => {
  try {
    const c = localStorage.getItem(CACHE_KEY);
    return c ? JSON.parse(c) : [];
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

let activeCategoryPromise = null;
let lastCategoryLoadTime = getStoredTime();

export const useCategoryStore = create((set, get) => ({
  categories: getStoredCategories(),
  loading: false,
  error: null,
  _loaded: getStoredCategories().length > 0,

  /** Load all public categories with SWR caching */
  loadCategories: async (options = {}) => {
    const currentCategories = get().categories;
    const hasData = Array.isArray(currentCategories) && currentCategories.length > 0;
    const isFresh = hasData && (Date.now() - lastCategoryLoadTime < FRESHNESS_TTL);

    if (isFresh && !options.force) {
      return currentCategories;
    }

    if (activeCategoryPromise) {
      return activeCategoryPromise;
    }

    if (!hasData) {
      set({ loading: true, error: null });
    }

    activeCategoryPromise = (async () => {
      try {
        const data = await fetchCategories(null);
        const categories = Array.isArray(data) ? data : (data?.categories ?? []);

        lastCategoryLoadTime = Date.now();
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(categories));
          localStorage.setItem(CACHE_TIME_KEY, lastCategoryLoadTime.toString());
        } catch (e) {}

        set({ categories, loading: false, _loaded: true, error: null });
        return categories;
      } catch (err) {
        set({ error: err.message, loading: false, _loaded: true });
        return get().categories;
      } finally {
        activeCategoryPromise = null;
      }
    })();

    return activeCategoryPromise;
  },

  /** Refetch categories (forces fresh data from backend) */
  refreshCategories: async () => {
    return get().loadCategories({ force: true });
  },

  /** Get a single category by slug */
  getBySlug: (slug) => {
    const lowerSlug = slug?.toLowerCase();
    return get().categories.find(c => c.slug?.toLowerCase() === lowerSlug) || null;
  },
}));
