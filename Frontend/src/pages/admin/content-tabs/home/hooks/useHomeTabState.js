import { useState, useEffect } from 'react';
import { useSiteSettingsStore, DEFAULTS } from '../../../../../store/siteSettingsStore';
import { useAuthStore } from '../../../../../store/authStore';
import { useAdmin } from '../../../../../context/AdminContext';
import { toast } from 'sonner';

export function useHomeTabState() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const { products, categories, globalBadges } = useAdmin();
  const activeCategories = (categories || []).filter(c => c.isVisible !== false);

  const [expandedSection, setExpandedSection] = useState('hero');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const [sectionToggles, setSectionToggles] = useState(
    settings.homeSectionToggles || DEFAULTS.homeSectionToggles
  );

  const toggleSection = async (key) => {
    const currentVal = sectionToggles[key] !== false;
    const newVal = !currentVal;
    const newToggles = { ...sectionToggles, [key]: newVal };
    setSectionToggles(newToggles);
    try {
      await settings.updateSettings({ homeSectionToggles: newToggles }, token);
      toast.success(`${key} visibility updated!`);
    } catch (err) {
      toast.error('Failed to update visibility');
      setSectionToggles(prev => ({ ...prev, [key]: currentVal }));
    }
  };

  // Specific states for different banner sections
  const [heroData, setHeroData] = useState(
    settings.heroData || {
      heading: 'NEW ARRIVALS',
      buttonText: 'SHOP NOW',
      buttonColor: '#FFFFFF',
      buttonLink: '/collections/new-arrivals',
      mediaType: 'image',
      mediaUrl: '',
    }
  );

  const [categoryBanners, setCategoryBanners] = useState(
    settings.categoryBanners || DEFAULTS.categoryBanners
  );
  const [sportBanner, setSportBanner] = useState(
    settings.sportBanner || DEFAULTS.sportBanner
  );
  const [featuredBanners, setFeaturedBanners] = useState(
    settings.featuredBanners || DEFAULTS.featuredBanners
  );
  const [pleasureSwimBanners, setPleasureSwimBanners] = useState(
    settings.pleasureSwimBanners || DEFAULTS.pleasureSwimBanners
  );
  const [shopTheFeed, setShopTheFeed] = useState(
    settings.shopTheFeed || DEFAULTS.shopTheFeed
  );
  const [pressQuotes, setPressQuotes] = useState(
    settings.pressQuotes || DEFAULTS.pressQuotes
  );
  const [brandDescription, setBrandDescription] = useState(
    settings.brandDescription || DEFAULTS.brandDescription
  );
  const [carousels, setCarousels] = useState(
    settings.homeCarousels || DEFAULTS.homeCarousels
  );

  useEffect(() => {
    if (settings._loaded) {
      if (settings.homeSectionToggles) setSectionToggles(settings.homeSectionToggles);
      if (settings.heroData) setHeroData(settings.heroData);
      if (settings.categoryBanners) setCategoryBanners(settings.categoryBanners);
      if (settings.sportBanner) setSportBanner(settings.sportBanner);
      if (settings.featuredBanners) setFeaturedBanners(settings.featuredBanners);
      if (settings.pleasureSwimBanners) setPleasureSwimBanners(settings.pleasureSwimBanners);
      if (settings.shopTheFeed) setShopTheFeed(settings.shopTheFeed);
      if (settings.pressQuotes) setPressQuotes(settings.pressQuotes);
      if (settings.brandDescription) setBrandDescription(settings.brandDescription);
      if (settings.homeCarousels) setCarousels(settings.homeCarousels);
    }
  }, [
    settings._loaded,
    settings.homeSectionToggles,
    settings.heroData,
    settings.categoryBanners,
    settings.sportBanner,
    settings.featuredBanners,
    settings.pleasureSwimBanners,
    settings.shopTheFeed,
    settings.pressQuotes,
    settings.brandDescription,
    settings.homeCarousels,
  ]);

  // Upload file to server and return a permanent URL
  const uploadFileToServer = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=hero_media`
      );
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            let percentComplete = Math.round((event.loaded / event.total) * 100);
            if (percentComplete > 95) percentComplete = 95;
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (onProgress) onProgress(100);
            resolve(data.url);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'Upload failed'));
          } catch (e) {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  };

  const handleHeroMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const localPreviewUrl = URL.createObjectURL(file);
    setHeroData(prev => ({ ...prev, mediaType: type, mediaUrl: localPreviewUrl }));
    setUploadingHero(true);
    setUploadProgress(0);
    try {
      const serverUrl = await uploadFileToServer(file, (progress) => {
        setUploadProgress(progress);
      });
      setHeroData(prev => ({ ...prev, mediaType: type, mediaUrl: serverUrl }));
      URL.revokeObjectURL(localPreviewUrl);
    } catch (err) {
      toast.error('Media upload failed. Please try again.');
      setHeroData(prev => ({ ...prev, mediaUrl: settings.heroData?.mediaUrl || '' }));
      URL.revokeObjectURL(localPreviewUrl);
    } finally {
      setUploadingHero(false);
      setUploadProgress(0);
    }
  };

  const saveSectionData = async (key, data) => {
    try {
      await settings.updateSettings({ [key]: data }, token);
      toast.success(`${key} saved globally!`);
    } catch (err) {
      toast.error(`Failed to save ${key}`);
    }
  };

  const saveHeroData = async () => {
    try {
      await settings.updateSettings({ heroData }, token);
      toast.success('Hero section saved globally!');
    } catch (err) {
      toast.error('Failed to save Hero section');
    }
  };

  return {
    products,
    categories,
    globalBadges,
    activeCategories,
    expandedSection,
    setExpandedSection,
    uploadingHero,
    uploadProgress,
    isUploadingGlobal,
    setIsUploadingGlobal,
    setUploadProgress,
    sectionToggles,
    toggleSection,
    heroData,
    setHeroData,
    categoryBanners,
    setCategoryBanners,
    sportBanner,
    setSportBanner,
    featuredBanners,
    setFeaturedBanners,
    pleasureSwimBanners,
    setPleasureSwimBanners,
    shopTheFeed,
    setShopTheFeed,
    pressQuotes,
    setPressQuotes,
    brandDescription,
    setBrandDescription,
    carousels,
    setCarousels,
    uploadFileToServer,
    handleHeroMediaUpload,
    saveSectionData,
    saveHeroData,
  };
}
