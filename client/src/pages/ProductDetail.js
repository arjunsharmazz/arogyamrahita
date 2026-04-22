import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/Api";
import styles from "../css/ProductDetail.module.css";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      if (response.success) {
        setProduct(response.product);
        if (response.product.variants && response.product.variants.length > 0) {
          setSelectedVariant(0);
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Error loading product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    let mounted = true;

    const loadAllProducts = async () => {
      try {
        const response = await productAPI.getAllProducts();
        if (mounted && response.success) {
          setAllProducts(response.products || []);
        }
      } catch (fetchError) {
        console.error("Error fetching related products:", fetchError);
      }
    };

    loadAllProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const getProductCategoryName = useCallback((item) => {
    const categoryValue = typeof item?.category === "string"
      ? item.category
      : item?.category?.name;

    return categoryValue?.trim() || "General";
  }, []);

  const formatCategoryLabel = useCallback((categoryName) => (
    categoryName
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  ), []);

  const getCardPrice = useCallback((item) => {
    const firstAvailableVariant = item?.variants?.find((variant) => variant?.newPrice);
    return firstAvailableVariant?.newPrice || item?.newPrice || 0;
  }, []);

  const getCardOldPrice = useCallback((item) => {
    const firstAvailableVariant = item?.variants?.find(
      (variant) => variant?.oldPrice && variant.oldPrice > variant.newPrice
    );

    if (firstAvailableVariant) {
      return firstAvailableVariant.oldPrice;
    }

    return item?.oldPrice && item.oldPrice > item.newPrice ? item.oldPrice : null;
  }, []);

  const visibleProducts = useMemo(
    () => allProducts.filter((item) => item?._id !== id),
    [allProducts, id]
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const currentCategory = getProductCategoryName(product);

    return visibleProducts
      .filter((item) => getProductCategoryName(item) === currentCategory)
      .slice(0, 4);
  }, [getProductCategoryName, product, visibleProducts]);

  const groupedProducts = useMemo(() => {
    const groups = visibleProducts.reduce((accumulator, item) => {
      const categoryName = getProductCategoryName(item);

      if (!accumulator[categoryName]) {
        accumulator[categoryName] = [];
      }

      accumulator[categoryName].push(item);
      return accumulator;
    }, {});

    return Object.entries(groups).sort(([left], [right]) =>
      left.localeCompare(right, undefined, { sensitivity: "base" })
    );
  }, [getProductCategoryName, visibleProducts]);

  const renderProductCard = (item) => (
    <motion.article
      key={item._id}
      className={styles.recommendationCard}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className={styles.recommendationImageButton}
        onClick={() => navigate(`/product/${item._id}`)}
      >
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name || "Product"}
          className={styles.recommendationImage}
        />
      </button>

      <div className={styles.recommendationContent}>
        <p className={styles.recommendationCategory}>
          {formatCategoryLabel(getProductCategoryName(item))}
        </p>
        <h3 className={styles.recommendationName}>{item.name}</h3>
        <div className={styles.recommendationPriceRow}>
          {getCardOldPrice(item) && (
            <span className={styles.recommendationOldPrice}>₹{getCardOldPrice(item)}</span>
          )}
          <span className={styles.recommendationPrice}>₹{getCardPrice(item)}</span>
        </div>
        <motion.button
          type="button"
          className={styles.recommendationButton}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/product/${item._id}`)}
        >
          View Product
        </motion.button>
      </div>
    </motion.article>
  );

  // ----------- NEW: compute out-of-stock state (variant-aware) --------------
  const isVariantOutOfStock = () => {
    if (!product) return false;
    if (product.variants && product.variants.length > 0 && selectedVariant !== null) {
      return product.variants[selectedVariant].stock <= 0;
    }
    return product.stock <= 0;
  };

  const isOutOfStock = isVariantOutOfStock();
  // -------------------------------------------------------------------------

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate("/signup");
      return;
    }

    const variantObj =
      product.variants &&
        product.variants.length > 0 &&
        selectedVariant !== null
        ? product.variants[selectedVariant]
        : null;

    addToCart(
      {
        _id: product._id,
        name: product.name,
        newPrice: variantObj
          ? variantObj.price || product.newPrice
          : product.newPrice,
        oldPrice: product.oldPrice,
        image: product.image,
        category: product.category,
        selectedVariant: variantObj,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      navigate("/signup");
      return;
    }

    const variantObj =
      product.variants &&
        product.variants.length > 0 &&
        selectedVariant !== null
        ? product.variants[selectedVariant]
        : null;

    addToCart(
      {
        _id: product._id,
        name: product.name,
        newPrice: variantObj
          ? variantObj.price || product.newPrice
          : product.newPrice,
        oldPrice: product.oldPrice,
        image: product.image,
        category: product.category,
        selectedVariant: variantObj,
      },
      quantity
    );

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Product Not Found</h2>
          <p>{error || "The product you are looking for does not exist."}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className={styles.backBtn}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        // APPLY grayscale class conditionally on the whole container when out of stock
        className={`${styles.container} ${isOutOfStock ? styles.outOfStockCard : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.productDetail}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            // make the image wrapper relative so badge can be absolute
            className={`${styles.productImages} ${styles.imageWrapper}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.mainImage}>
              <img src={product.image} alt={product.name} />
              {/* NEW: Out of stock badge on image */}
              {isOutOfStock && (
                <div className={styles.outOfStockBadge}>
                  Out of Stock
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.productInfo}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.nameRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className={styles.productName}>{product.name}</h1>
              {product.variants &&
                product.variants.length > 0 &&
                selectedVariant !== null ? (
                <span className={styles.productWeight}>
                  {product.variants[selectedVariant].weight}{" "}
                  {product.variants[selectedVariant].weightUnit}
                </span>
              ) : (
                <span className={styles.productWeight}>
                  {product.weight} {product.weightUnit}
                </span>
              )}
            </motion.div>

            <div className={styles.productPrices}>
              <span className={styles.currentPrice}>
                ₹
                {product.variants &&
                  product.variants.length > 0 &&
                  selectedVariant !== null
                  ? product.variants[selectedVariant]?.newPrice || product.newPrice
                  : product.newPrice}
              </span>
              {product.variants && product.variants.length > 0 && selectedVariant !== null ? (
                product.variants[selectedVariant]?.oldPrice && product.variants[selectedVariant]?.oldPrice > product.variants[selectedVariant]?.newPrice ? (
                  <span className={styles.oldPrice}>₹{product.variants[selectedVariant]?.oldPrice}</span>
                ) : null
              ) : (
                product.oldPrice && product.oldPrice > product.newPrice ? (
                  <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                ) : null
              )}
            </div>

            {/* Discount display for selected variant */}
            {product.variants && product.variants.length > 0 && selectedVariant !== null ? (
              product.variants[selectedVariant]?.oldPrice && product.variants[selectedVariant]?.oldPrice > product.variants[selectedVariant]?.newPrice ? (
                <motion.div
                  className={styles.discount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Save ₹{product.variants[selectedVariant]?.oldPrice - product.variants[selectedVariant]?.newPrice}</span>
                </motion.div>
              ) : null
            ) : (
              product.oldPrice && product.oldPrice > product.newPrice ? (
                <motion.div
                  className={styles.discount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Save ₹{product.oldPrice - product.newPrice}</span>
                </motion.div>
              ) : null
            )}

            <motion.div
              className={styles.productDescription}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Description</h3>
              <p>{product.description}</p>
            </motion.div>

            <motion.div
              className={styles.quantitySelector}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label>Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={
                    isOutOfStock ||
                    (
                      product.variants &&
                        product.variants.length > 0 &&
                        selectedVariant !== null
                        ? product.variants[selectedVariant].stock <= 0 ||
                        quantity >= product.variants[selectedVariant].stock
                        : product.stock <= 0 || quantity >= product.stock
                    )
                  }
                >
                  +
                </button>
              </div>
              {/* Variant selector */}
              {product.variants && product.variants.length > 0 && (
                <div className={styles.variantSelector}>
                  <div className={styles.variantSelectorHeader}>
                    <label htmlFor="variant-select" className={styles.variantLabel}>Select Weight</label>
                    <span className={styles.variantHint}>Choose the pack size you want to order</span>
                  </div>
                  <div className={styles.variantDropdownWrap}>
                    <select
                      id="variant-select"
                      value={selectedVariant}
                      onChange={(e) => {
                        setSelectedVariant(Number(e.target.value));
                        setQuantity(1);
                      }}
                      className={styles.variantDropdown}
                      disabled={isOutOfStock}
                    >
                      {product.variants.map((variant, idx) => (
                        <option key={idx} value={idx}>
                          {variant.name} - {variant.weight} {variant.weightUnit} {variant.stock === 0 ? "(Out of stock)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              className={styles.productActions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Now
              </motion.button>
              <motion.button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>

            {isOutOfStock && (
              <motion.p
                className={styles.outOfStock}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                This product is currently out of stock
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {(relatedProducts.length > 0 || groupedProducts.length > 0) && (
        <section className={styles.recommendationsSection}>
          {relatedProducts.length > 0 && (
            <div className={styles.recommendationBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Related Products</h2>
                <p className={styles.sectionText}>
                  Same category ke aur products jo is item ke saath relevant hain.
                </p>
              </div>
              <div className={styles.recommendationGrid}>
                {relatedProducts.map(renderProductCard)}
              </div>
            </div>
          )}

          {groupedProducts.length > 0 && (
            <div className={styles.recommendationBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Explore More Products</h2>
                <p className={styles.sectionText}>
                  Sab products category wise organize karke niche dikh rahe hain.
                </p>
              </div>

              <div className={styles.categoryStack}>
                {groupedProducts.map(([categoryName, items]) => (
                  <section key={categoryName} className={styles.categorySection}>
                    <div className={styles.categoryHeader}>
                      <h3 className={styles.categoryTitle}>{formatCategoryLabel(categoryName)}</h3>
                    </div>
                    <div className={styles.recommendationGrid}>
                      {items.map(renderProductCard)}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ProductDetail;
