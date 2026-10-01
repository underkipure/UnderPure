import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteSettingsStore } from '../store/siteSettingsStore';
import { sanitizeHtml } from '../utils/sanitizeHtml';

const CustomPage = () => {
  const { pageSlug } = useParams();
  const { customPages } = useSiteSettingsStore();
  
  const page = customPages?.find(p => p.slug === pageSlug);

  if (!page || !page.isPublished) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-3xl mb-4 text-center">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24 animate-in fade-in duration-700">
      <h1 className="font-serif text-3xl md:text-5xl mb-12 text-center break-words">{page.title}</h1>
      
      {/* 
        Using dangerouslySetInnerHTML is protected by DOMPurify sanitization
        to prevent Stored XSS from rich-text editor inputs.
      */}
      <div 
        className="prose prose-sm sm:prose-base max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-black prose-a:underline-offset-4 prose-a:decoration-1 hover:prose-a:decoration-2 text-justify break-words"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }} 
      />
    </div>
  );
};

export default CustomPage;
