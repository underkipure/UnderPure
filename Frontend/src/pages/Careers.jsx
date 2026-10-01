import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { useSiteSettingsStore, DEFAULTS } from '../store/siteSettingsStore';

const Careers = () => {
  const settings = useSiteSettingsStore();
  const data = settings.careersData || DEFAULTS.careersData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 px-6 lg:px-12 xl:px-24 max-w-[1000px] mx-auto min-h-[60vh]">
      <SEO 
        title={`${data.title || 'Careers'} - UnderPure`} 
        description="Join the UnderPure team."
      />
      
      <h1 
        className="text-4xl md:text-[50px] font-dala-roman text-black mb-16 text-center lowercase tracking-wide"
      >
        {data.title || 'join the underpure team'}
      </h1>

      <div className="space-y-12 mb-16 max-w-[800px] mx-auto">
        {(data.departments || []).map((dept, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h2 className="text-[13px] font-sans font-bold uppercase tracking-widest text-black mb-1">
              {dept.name}
            </h2>
            <div className="flex flex-col gap-1.5">
              {(dept.jobs || []).map((job, jIdx) => (
                <a 
                  key={jIdx} 
                  href={job.url || '#'} 
                  target={job.url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="text-[14px] text-[#A67F7F] font-sans hover:opacity-70 transition-opacity"
                >
                  {job.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.bottomText && (
        <div className="max-w-[800px] mx-auto border-t border-black/10 pt-10">
          <p className="text-[13.5px] text-black font-sans leading-[1.8]">
            {data.bottomText}
          </p>
        </div>
      )}
    </div>
  );
};

export default Careers;
