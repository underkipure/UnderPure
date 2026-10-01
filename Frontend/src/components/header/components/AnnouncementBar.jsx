import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';

export default function AnnouncementBar({ hasShadow }) {
  const announcementBar = useSiteSettingsStore((s) => s.announcementBar);
  const announcementBarEnabled = useSiteSettingsStore((s) => s.announcementBarEnabled);
  const announcementBarLink = useSiteSettingsStore((s) => s.announcementBarLink);
  const announcementBarBgColor = useSiteSettingsStore((s) => s.announcementBarBgColor);
  const announcementBarTextColor = useSiteSettingsStore((s) => s.announcementBarTextColor);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!announcementBar) return;

    const messages = announcementBar
      .split("|")
      .map((m) => m.trim())
      .filter(Boolean);
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [announcementBar]);

  if (!announcementBarEnabled || !announcementBar) return null;

  const renderMessages = announcementBar
    .split("|")
    .map((m) => m.trim())
    .filter(Boolean);
  const currentMessage =
    renderMessages.length > 0
      ? renderMessages[currentIndex] || renderMessages[0]
      : announcementBar;

  const content = (
    <div
      style={{
        backgroundColor: announcementBarBgColor || "#000000",
        color: announcementBarTextColor || "#FFFFFF",
      }}
      className={`relative z-20 text-[3.5vw] md:text-[0.95vw] min-h-[10vw] md:min-h-[2.5vw] py-[1.5vw] md:py-[0.6vw] px-[2vw] flex items-center justify-center tracking-[0.02em] font-sans transition-shadow duration-300 ${hasShadow ? "shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : ""}`}
    >
      <p className="m-0 text-center">{currentMessage}</p>
    </div>
  );

  if (announcementBarLink) {
    return (
      <Link to={announcementBarLink} className="no-underline block w-full">
        {content}
      </Link>
    );
  }
  return content;
}
