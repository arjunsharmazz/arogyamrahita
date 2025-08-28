// Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../css/navbar.module.css";
import logo from "../images/arogyamlogo.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(false); // ✅ close dropdown after click
  };

  return (
    <>
      {/* 🔹 Top Navbar Block */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Search here..." />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.navIcons}>
          <button>Sign Up</button>
          <button>Login</button>
          <button className={styles.cartBtn}>
            🛒 Cart <span className={styles.cartCount}>2</span>
          </button>
          <div className={styles.iconBox}>🤍</div>
          <div className={styles.iconBox}>👤</div>
        </div>
      </header>

      {/* 🔹 Category Navbar Block */}
      <nav className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <div className={styles.allCategoriesBtn} onClick={toggleDropdown}>
            <span className={styles.hamburgerIcon}>&#9776;</span>
            <span>All Categories</span>
          </div>
        </div>

        <ul className={styles.navbarMenu}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/category">category</Link></li>
          <li><Link to="/featureproduct">FeaturedProduct</Link></li>
           <li><Link to="/review">Review</Link></li>
        </ul>

        {isDropdownOpen && (
          <div className={styles.productDropdown}>
            <ul>
              <li><Link to="/electronics" onClick={handleCategoryClick}>Electronics</Link></li>
              <li><Link to="/clothing" onClick={handleCategoryClick}>Clothing</Link></li>
              <li><Link to="/home-kitchen" onClick={handleCategoryClick}>Home & Kitchen</Link></li>
              <li><Link to="/books" onClick={handleCategoryClick}>Books</Link></li>
              <li><Link to="/sports" onClick={handleCategoryClick}>Sports & Outdoors</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
