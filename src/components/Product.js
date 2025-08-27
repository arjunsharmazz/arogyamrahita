import React from "react";
import styles from "../css/product.module.css";  // import module css
import image from "../images/mango.png";

// Dummy Products Data
const products = [
  { id: 1, name: "Mango Pickle", price: "₹230", oldPrice: "₹290", image: image },
  { id: 2, name: "Lemon Pickle", price: "₹200", oldPrice: "₹250", image: image },
  { id: 3, name: "Chili Pickle", price: "₹180", oldPrice: "₹220", image: image },
  { id: 4, name: "Mixed Pickle", price: "₹240", oldPrice: "₹300", image: image },
];

// Product Card Component
const ProductCard = ({ product }) => (
  <div className={styles.prodCard}>
    <img src={product.image} alt={product.name} className={styles.productImage} />
    <h3 className={styles.productName}>{product.name}</h3>
    <div className={styles.productPrices}>
      <span className={styles.productPrice}>{product.price}</span>
      <span className={styles.productOldPrice}>{product.oldPrice}</span>
    </div>
    <button className={styles.buyBtn}>Buy Now</button>
  </div>
);

// Main Products Component
function Products() {
  return (
    <section className={styles.productsSection}>
      <h2 className={styles.title}>Our Products</h2>
      <div className={styles.producterGrid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default Products;
