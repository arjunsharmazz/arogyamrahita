import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/banner.module.css";
import lamp from "../images/benar1.jpg";
import bottle from "../images/benar2.jpg";
import logo from "../images/benar3.jpg";
import { homeBannerAPI } from "../services/Api";

const preloadedBannerImages = new Set();

const fallbackSlides = [
  { image: lamp, title: "", subtitle: "" },
  { image: bottle, title: "", subtitle: "" },
  { image: logo, title: "", subtitle: "" },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: "absolute",
    transition: { duration: 0.5, ease: "easeInOut" },
  }),
};

const preloadSlides = (items) => {
  items.forEach((item) => {
    const imageSrc = item?.image;

    if (!imageSrc || preloadedBannerImages.has(imageSrc)) {
      return;
    }

    const image = new Image();
    image.src = imageSrc;
    preloadedBannerImages.add(imageSrc);
  });
};

const Banner = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await homeBannerAPI.getActive();
        const items = response?.data;
        if (Array.isArray(items) && items.length > 0) {
          preloadSlides(items);
          setSlides(items);
        }
      } catch (_error) {
        setSlides(fallbackSlides);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    preloadSlides(slides);
  }, [slides]);

  useEffect(() => {
    setCurrent(([prev]) => [Math.min(prev, Math.max(slides.length - 1, 0)), 0]);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrent(([prev]) => [(prev + 1) % slides.length, 1]);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goTo = (index) => {
    if (index === current) {
      return;
    }

    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        <AnimatePresence mode="sync" custom={direction}>
          <motion.img
            key={slides[current]?.image || fallbackSlides[0].image}
            src={slides[current]?.image || fallbackSlides[0].image}
            alt={slides[current]?.title || "banner"}
            className={styles.slideImage}
            loading="eager"
            fetchPriority="high"
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
