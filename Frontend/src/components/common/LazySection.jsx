import React, { useState, useEffect, useRef } from "react";

/**
 * LazySection
 * Defers rendering and component download until the section scrolls near the viewport.
 * Uses IntersectionObserver with a generous 300px rootMargin for seamless, invisible hydration.
 */
export default function LazySection({
  children,
  minHeight = "200px",
  className = "",
  rootMargin = "300px",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible) return;

    // Fallback if IntersectionObserver is not supported
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
      {isVisible ? children : null}
    </div>
  );
}
