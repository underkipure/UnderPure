import React from 'react';

export const Grid2Icon = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
    title="2 columns"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="8" height="18" rx="1" />
      <rect x="11" y="1" width="8" height="18" rx="1" />
    </svg>
  </button>
);

export const Grid3Icon = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
    title="3 columns"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="5" height="18" rx="1" />
      <rect x="7.5" y="1" width="5" height="18" rx="1" />
      <rect x="14" y="1" width="5" height="18" rx="1" />
    </svg>
  </button>
);

export const Grid4Icon = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1 transition-opacity ${active ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
    title="4 columns"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="3.5" height="18" rx="0.5" />
      <rect x="5.8" y="1" width="3.5" height="18" rx="0.5" />
      <rect x="10.6" y="1" width="3.5" height="18" rx="0.5" />
      <rect x="15.4" y="1" width="3.5" height="18" rx="0.5" />
    </svg>
  </button>
);
