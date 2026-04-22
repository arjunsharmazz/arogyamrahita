import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/ProductsSection.js.module.css";
import { productAPI } from "../services/Api";

const getCategoryName = (product) => {
  const categoryValue = typeof product?.category === "string"
    ? product.category
    : product?.category?.name;
  const normalizedCategory = categoryValue?.trim();

  return normalizedCategory || "General";
};

const formatCategoryLabel = (categoryName) => categoryName
  .split(/[-_\s]+/)
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(" ");

export default function FeaturedProductsSection() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      if (response.success) {
        setProducts(response.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error loading products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = (product) => {
    const lastVariant = product.variants && product.variants.length > 0
      ? product.variants[product.variants.length - 1]
      : null;
    return lastVariant ? lastVariant.newPrice : product.newPrice;
  };

  const getDisplayOldPrice = (product) => {
    const lastVariant = product.variants && product.variants.length > 0
      ? product.variants[product.variants.length - 1]
      : null;
    if (lastVariant) {
      return lastVariant.oldPrice && lastVariant.oldPrice > lastVariant.newPrice
        ? lastVariant.oldPrice
        : null;
    }
    return product.oldPrice && product.oldPrice > product.newPrice
      ? product.oldPrice
      : null;
  };

  if (loading) {
    return (
      <div className={styles.featuredProductsContainer}>
        <motion.div
          className={styles.headerNavigation}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </motion.div>
        <div className={styles.productCarousel}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={styles.productCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className={styles.productImageContainer}>
                <div className={styles.skeleton}></div>
              </div>
              <div className={styles.productContent}>
                <h3>Loading...</h3>
                <div className={styles.productPriceInfo}>
                  <span>₹--</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.featuredProductsContainer}>
        <motion.div
          className={styles.headerNavigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </motion.div>
        <p className={styles.error}>{error}</p>
        <button onClick={fetchProducts} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  const groupedProducts = products.reduce((groups, product) => {
    const categoryName = getCategoryName(product);

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(product);
    return groups;
  }, {});

  const sortedCategoryEntries = Object.entries(groupedProducts).sort(([left], [right]) =>
    left.localeCompare(right, undefined, { sensitivity: "base" })
  );

  return (
    <div className={styles.featuredProductsContainer}>
      <div className={styles.headerNavigation}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
      </div>

      {sortedCategoryEntries.map(([categoryName, categoryProducts], categoryIndex) => (
        <motion.section
          key={categoryName}
          className={styles.categorySection}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: categoryIndex * 0.08 }}
        >
          <div className={styles.categoryHeader}>
            <h3 className={styles.categoryTitle}>{formatCategoryLabel(categoryName)}</h3>
          </div>

          <div className={styles.productCarousel}>
            {categoryProducts.map((product) => (
              <motion.div
                key={product._id}
                className={styles.productCard}
              >
                <div className={styles.productImageContainer}>
                  <motion.img
                    src={product.image || "/placeholder.png"}
                    alt={product.name || "Product"}
                    className={styles.productImagese}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ cursor: "pointer" }}
                  />

                  {getDisplayOldPrice(product) && (
                    <span className={`${styles.productBadge} ${styles.sale}`}>
                      Sale
                    </span>
                  )}
                </div>
                <div className={styles.productContent}>
                  <h3 className={styles.productName}>
                    {product.name}{" "}
                    <span style={{ fontSize: "1rem", color: "#1f1f1fff" }}>
                      {product.weight ?? ""} {product.weightUnit ?? ""}
                    </span>
                  </h3>
                  <div className={styles.productPriceInfo}>
                    {getDisplayOldPrice(product) && (
                      <span className={styles.oldPrice}>₹{getDisplayOldPrice(product)}</span>
                    )}
                    <span className={styles.currentPrice}>₹{getDisplayPrice(product)}</span>
                  </div>
                  <p>
                    {product.description
                      ? product.description.split(" ").slice(0, 20).join(" ") +
                      (product.description.split(" ").length > 20 ? "..." : "")
                      : "No description available."}
                  </p>
                  <div className={styles.productActions}>
                    <motion.button
                      className={styles.buyButton}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
