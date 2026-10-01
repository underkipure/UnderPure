import React from 'react';

// Mock VideoPlayer component
// Backend developer: Replace with real video player (e.g., ReactPlayer)
export function VideoPlayer({ src, className = '' }) {
  return (
    <video preload="none" src={src}
      className={`rounded-sm ${className}`}
      controls
      muted
      playsInline
    />
  );
}
