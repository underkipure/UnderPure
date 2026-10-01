import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories, fetchProducts, fetchBadges, fetchSizeClasses } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useSiteSettingsStore } from '../store/siteSettingsStore';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const { token } = useAuthStore();

  const [categories, setCategories]   = useState([]);
  const [products, setProducts]       = useState([]);
  const [globalBadges, setGlobalBadges] = useState([]);
  const [sizeClasses, setSizeClasses] = useState([]);
  const [globalSizes, setGlobalSizes] = useState(['XS', 'S', 'M', 'L', 'XL']);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchCategories(token),
          fetchProducts(token),
          fetchBadges(token),
          fetchSizeClasses(token)
        ]);

        const [catRes, prodRes, badgeRes, scRes] = results;

        if (catRes.status === 'fulfilled') {
          const cats = Array.isArray(catRes.value) ? catRes.value : (catRes.value?.categories ?? []);
          setCategories(cats);
        }

        if (prodRes.status === 'fulfilled') {
          const prods = Array.isArray(prodRes.value) ? prodRes.value : (prodRes.value?.products ?? []);
          setProducts(prods);
        }

        if (badgeRes.status === 'fulfilled') {
          const badges = Array.isArray(badgeRes.value) ? badgeRes.value : (badgeRes.value?.badges ?? []);
          setGlobalBadges(badges);
        }

        if (scRes.status === 'fulfilled') {
          const sc = Array.isArray(scRes.value) ? scRes.value : (scRes.value?.size_classes ?? []);
          setSizeClasses(sc);
          const scSizes = sc.flatMap(s => Array.isArray(s.sizes) ? s.sizes : []);
          
          let settingsGlobalSizes = null;
          try {
            const st = useSiteSettingsStore.getState();
            if (Array.isArray(st.globalSizes) && st.globalSizes.length > 0) {
              settingsGlobalSizes = st.globalSizes;
            }
          } catch(e) {}
          
          if (settingsGlobalSizes && settingsGlobalSizes.length > 0) {
            setGlobalSizes(settingsGlobalSizes);
          } else if (scSizes.length > 0) {
            setGlobalSizes([...new Set(scSizes)]);
          }
        }
      } catch (err) {
        console.error('AdminContext load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [token]);

  const reloadSizeClasses = async () => {
    try {
      const res = await fetchSizeClasses(token);
      const sc = Array.isArray(res) ? res : (res?.size_classes ?? []);
      setSizeClasses(sc);
      const scSizes = sc.flatMap(s => Array.isArray(s.sizes) ? s.sizes : []);
      let settingsGlobalSizes = null;
      try {
        const st = useSiteSettingsStore.getState();
        if (Array.isArray(st.globalSizes) && st.globalSizes.length > 0) {
          settingsGlobalSizes = st.globalSizes;
        }
      } catch(e) {}
      if (!settingsGlobalSizes && scSizes.length > 0) {
        setGlobalSizes([...new Set(scSizes)]);
      }
    } catch (err) {
      console.error('reloadSizeClasses error:', err);
    }
  };

  const value = {
    categories, setCategories,
    products,   setProducts,
    globalBadges, setGlobalBadges,
    sizeClasses, setSizeClasses, reloadSizeClasses,
    globalSizes, setGlobalSizes,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    return {
      categories: [],  setCategories: () => {},
      products: [],    setProducts: () => {},
      globalBadges: [], setGlobalBadges: () => {},
      sizeClasses: [], setSizeClasses: () => {}, reloadSizeClasses: async () => {},
      globalSizes: [], setGlobalSizes: () => {},
      loading: false,
    };
  }
  return context;
};
