import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/handpick.module.css";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { categoryAPI, productAPI } from "../services/Api";



const CategoryCard = ({ title, imageUrl, onClick }) => {
  const placeholderImage = `https://placehold.co/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(title)}`;
  const [imageSrc, setImageSrc] = useState(imageUrl || placeholderImage);

  const handleImageError = () => {
    setImageSrc("");
  };

  return (
    <motion.div
      className={styles.categoryCard}
      onClick={onClick}
    // whileHover={{ scale: 1.1, rotate: 1 }}
    // whileTap={{ scale: 0.95 }}
    // transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.img
        src={imageSrc}
        alt={title}
        className={styles.cardImage}
        onError={handleImageError}
        loading="lazy"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className={styles.cardTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.div>
    </motion.div>
  );
};

const Handpick = () => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await productAPI.getCategories();
        if (data?.success && Array.isArray(data.categories) && data.categories.length) {
          setCategoryProducts(
            data.categories.map((name) => ({
              name,
              image: `https://placehold.co/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(name)}`,
            }))
          );
          return;
        }

        const fallback = await categoryAPI.getAllCategories();
        if (fallback?.success && Array.isArray(fallback.categories) && fallback.categories.length) {
          setCategoryProducts(
            fallback.categories.map((cat) => ({
              name: cat.name,
              image: cat.image || `https://placehold.co/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(cat.name)}`,
            }))
          );
          return;
        }

        const productsRes = await productAPI.getAllProducts({ limit: 100 });
        if (productsRes?.success && Array.isArray(productsRes.products) && productsRes.products.length) {
          const unique = {};
          productsRes.products.forEach((product) => {
            if (product.category && !unique[product.category]) {
              unique[product.category] = product.category;
            }
          });
          const derivedCategories = Object.keys(unique).map((name) => ({
            name,
            image: `https://placehold.co/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(name)}`,
          }));
          setCategoryProducts(derivedCategories);
        } else {
          setCategoryProducts([]);
        }
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add(styles.active);
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove(styles.active);
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove(styles.active);
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleTouchEnd = () => {
      isDown = false;
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [categoryProducts]);

  const scrollManually = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const amount = 320;
    container.scrollLeft += direction === "left" ? -amount : amount;
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.name || category)}`);
  };

  return (
    <div className={styles.mainContainer}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Shop By Category
      </motion.h2>

      {loading ? (
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.categoryCard}>
              <div className={styles.skeleton}></div>
              <div className={styles.cardTitle}>Loading...</div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          <p>Unable to load categories. Please try again later.</p>
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className={styles.errorMessage}>
          <p>No categories available at the moment.</p>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            {categoryProducts.map((product, index) => (
              <CategoryCard
                key={`cat-${index}`}
                title={product.name}
                imageUrl={product.image}
                onClick={() => handleCategoryClick(product)}
              />
            ))}
          </div>
          <button
            aria-label="Scroll left"
            onClick={() => scrollManually("left")}
            className={`${styles.scrollBtn} ${styles.leftBtn}`}
          >
            <HiChevronLeft size={22} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollManually("right")}
            className={`${styles.scrollBtn} ${styles.rightBtn}`}
          >
            <HiChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Handpick;
