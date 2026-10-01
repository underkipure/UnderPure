import React from 'react';

export const renderQuoteHeading = (text, styleKey, defaultStyle) => {
  if (!text) return null;
  const style = styleKey || defaultStyle;

  if (style === 'serif-bold') {
    return (
      <h3
        className="text-[15vw] md:text-[2vw] tracking-[-0.01em] leading-none mb-[0vw] md:mb-[1.5vw] text-black font-bold uppercase font-serif"
      >
        {text}
      </h3>
    );
  }

  if (style === 'sans-heavy') {
    return (
      <h3
        className="font-sans text-[6vw] md:text-[1vw] font-black tracking-[0.2em] uppercase leading-none mb-[0vw] md:mb-[1.5vw] text-black"
      >
        {text}
      </h3>
    );
  }

  if (style === 'sans-light') {
    return (
      <h3
        className="font-sans text-[7vw] md:text-[1.1vw] font-light tracking-[0.15em] uppercase leading-none mb-[0vw] md:mb-[1.5vw] text-[#777777]"
      >
        {text}
      </h3>
    );
  }

  if (style === 'sans-bold') {
    return (
      <h3
        className="font-sans text-[7vw] md:text-[1.1vw] font-bold tracking-[0.15em] uppercase leading-none mb-[0vw] md:mb-[1.5vw] text-black"
      >
        {text}
      </h3>
    );
  }

  const words = text.trim().split(/\s+/);
  if (words.length <= 1) {
    return (
      <h3
        className="font-sans text-[7vw] md:text-[1.1vw] font-bold tracking-[0.15em] uppercase leading-none mb-[0vw] md:mb-[1.5vw] text-black"
      >
        {text}
      </h3>
    );
  }

  const midIdx = words.length === 2 ? 0 : Math.floor((words.length - 1) / 2);
  const leftWords = words.slice(0, midIdx).join(' ');
  const centerWord = words[midIdx];
  const rightWords = words.slice(midIdx + 1).join(' ');

  return (
    <h3
      className="font-sans text-[7vw] md:text-[1.1vw] font-light tracking-[0.15em] uppercase leading-none mb-[0vw] md:mb-[1.5vw] text-[#777777]"
    >
      {leftWords ? leftWords + ' ' : ''}
      <span className="text-black font-bold">{centerWord}</span>
      {rightWords ? ' ' + rightWords : ''}
    </h3>
  );
};
