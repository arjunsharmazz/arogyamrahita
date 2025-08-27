import { useState, useRef } from "react";
import styles from "../css/ProductsSection.js.module.css";

export default function FeaturedProductsSection() {
  const scrollContainerRef = useRef(null);

  const [products] = useState([
    {
      id: 1,
      name: "Mango Pickel",
      price: 230,
      oldPrice: null,
      badge: "New",
      imageUrl: "https://placehold.co/400x500/F58B55/000000?text=Mango",
    },
    {
      id: 2,
      name: "Lemon Pickel",
      price: 230,
      oldPrice: 320,
      badge: "Sales",
      imageUrl: "https://placehold.co/400x500/FFEC84/000000?text=Lemon",
    },
    {
      id: 3,
      name: "Lime Pickel",
      price: 180,
      oldPrice: 250,
      badge: "Sales",
      imageUrl: "https://placehold.co/400x500/B2D8C9/000000?text=Lime",
    },
    {
      id: 4,
      name: "Garlic Paste",
      price: 150,
      oldPrice: null,
      badge: "New",
      imageUrl: "https://placehold.co/400x500/D0D8CF/000000?text=Garlic",
    },
     {
      id: 4,
      name: "Garlic Paste",
      price: 150,
      oldPrice: null,
      badge: "New",
      imageUrl: "https://placehold.co/400x500/D0D8CF/000000?text=Garlic",
    },
     {
      id: 4,
      name: "Garlic Paste",
      price: 150,
      oldPrice: null,
      badge: "New",
      imageUrl: "https://placehold.co/400x500/D0D8CF/000000?text=Garlic",
    },
     {
      id: 4,
      name: "Garlic Paste",
      price: 150,
      oldPrice: null,
      badge: "New",
      imageUrl: "https://placehold.co/400x500/D0D8CF/000000?text=Garlic",
    },
  ]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // matches card width
      scrollContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className={styles.featuredProductsContainer}>
      {/* Header & Nav */}
      <div className={styles.headerNavigation}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.navigationButtons}>
          <button onClick={() => scroll("left")} className={styles.scrollButton}>
            ◀
          </button>
          <button
            onClick={() => scroll("right")}
            className={styles.scrollButton}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Product Scroll Row */}
      <div ref={scrollContainerRef} className={styles.productCarousel}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.productImagese}
              />
              {product.badge && (
                <span
                  className={`${styles.productBadge} ${
                    product.badge === "New" ? styles.new : styles.sale
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
            <div className={styles.productContent}>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.productPriceInfo}>
                {product.oldPrice && (
                  <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                )}
                <span className={styles.currentPrice}>₹{product.price}</span>
              </div>
              <div className={styles.productActions}>
                <button className={styles.buyButton}>Buy Now</button>
                <button className={styles.cartButton}>🛒</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
