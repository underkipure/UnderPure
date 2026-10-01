import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../store/siteSettingsStore';
import { fixImageUrl, optimizeImage } from '../lib/productUtils';

const FAQs = () => {
  const { faqs, faqHeroImage } = useSiteSettingsStore();
  const rawFaqs = faqs || DEFAULTS.faqs;
  const heroImage = faqHeroImage || DEFAULTS.faqHeroImage || "";

  // Group flat array into categorized array expected by UI
  const groupedFaqs = useMemo(() => {
    const map = new Map();
    rawFaqs.forEach(item => {
      const cat = (item.category || 'general').toLowerCase();
      if (!map.has(cat)) map.set(cat, { category: cat, questions: [] });
      map.get(cat).questions.push({ q: item.question, a: item.answer });
    });
    return Array.from(map.values());
  }, [rawFaqs]);

  const [openCategory, setOpenCategory] = useState('order status'); // Pre-open 'order status' like screenshot
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (catName) => {
    setOpenCategory(openCategory === catName ? null : catName);
    setOpenQuestion(null);
  };

  const toggleQuestion = (catName, qIdx) => {
    const key = `${catName}-${qIdx}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  const filteredFaqs = searchQuery.trim()
    ? groupedFaqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : groupedFaqs;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] flex items-center justify-center">
        {heroImage && (
          <img loading="lazy" src={optimizeImage(fixImageUrl(heroImage), 1800)}
            alt="FAQs Hero"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Search Bar on image */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center w-[90%] max-w-[500px] shadow-lg">
          <div className="relative flex-1 bg-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an answer"
              className="w-full bg-transparent py-4 pl-12 pr-4 text-[14px] text-gray-800 placeholder-gray-400 outline-none border-none font-sans"
            />
          </div>
          <button className="bg-black text-white text-[13px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-gray-800 transition-colors border border-black">
            SEARCH
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-[800px] mx-auto px-6 py-20">
        {filteredFaqs.length === 0 && (
          <p className="text-center text-[14px] text-gray-500 py-10 font-sans">No results found for "{searchQuery}"</p>
        )}
        
        {filteredFaqs.map((cat, catIdx) => (
          <div key={catIdx} className="border-b border-black">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(cat.category)}
              className="w-full flex justify-between items-center py-5 text-left bg-transparent border-none cursor-pointer group"
            >
              <span 
                className="text-[18px] md:text-[20px] font-dala-roman text-black group-hover:opacity-70 transition-opacity"
              >
                {cat.category}
              </span>
              <svg
                viewBox="0 0 200 100"
                className={`w-4 h-4 text-black transition-transform duration-300 ${openCategory === cat.category ? 'rotate-0' : 'rotate-180'}`}
                fill="currentColor"
              >
                <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
              </svg>
            </button>

            {/* Questions inside category */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openCategory === cat.category ? 'max-h-[2000px]' : 'max-h-0'
              }`}
            >
              <div className="pb-6 pt-2">
                {cat.questions.map((item, qIdx) => (
                  <div key={qIdx} className="pl-4">
                    <button
                      onClick={() => toggleQuestion(cat.category, qIdx)}
                      className="w-full flex justify-between items-center py-3 text-left bg-transparent border-none cursor-pointer group"
                    >
                      <span className="text-[14px] font-sans text-black group-hover:opacity-70 transition-colors pr-4">
                        {item.q}
                      </span>
                      <svg
                        viewBox="0 0 200 100"
                        className={`w-3.5 h-3.5 text-black flex-shrink-0 transition-transform duration-300 ${openQuestion === `${cat.category}-${qIdx}` ? 'rotate-0' : 'rotate-180'}`}
                        fill="currentColor"
                      >
                        <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-in-out ${
                        openQuestion === `${cat.category}-${qIdx}` ? 'max-h-[600px]' : 'max-h-0'
                      }`}
                    >
                      <p className="text-[13px] font-sans text-gray-600 leading-relaxed pb-4 pl-0 pr-8">
                        {item.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
