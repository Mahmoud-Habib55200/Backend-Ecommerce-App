import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { banners } from "../data/banners";
import "./BannerSlider.css";

const AUTOPLAY_DELAY = 5000;

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => {
    setIndex((i + banners.length) % banners.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  };

  return (
    <section
      className="banner-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Promotional banners"
    >
      <div
        className="banner-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="banner-slide"
            aria-hidden={banners[index].id !== banner.id}
          >
            <img
              className="banner-image"
              src={banner.image}
              alt={banner.title}
              loading={banner.id === 1 ? "eager" : "lazy"}
            />
            <div className="banner-overlay" />
            <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <Link to={banner.link} className="banner-cta">
                {banner.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="banner-arrow banner-arrow-prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="banner-arrow banner-arrow-next"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="banner-dots">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            className={`banner-dot ${i === index ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  );
}
