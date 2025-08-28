import React, { useState } from 'react';
import { Link } from "react-router-dom"; 
import styles from "../css/Category.module.css"; // ✅ import CSS module

const Category = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <div className={styles.allCategoriesBtn} onClick={toggleDropdown}>
          <span className={styles.hamburgerIcon}>&#9776;</span>
          <span>All Categories</span>
        </div>
      </div>

      <nav className={styles.navbarMenu}>
        <ul>
          <li><Link to= "/"> Home</Link></li>
           <li><Link to= "/product"> Product</Link></li>
            <li><Link to= "/"> Home</Link></li>
             <li><Link to= "/"> Home</Link></li>
              <li><Link to= "/"> Home</Link></li>
         
        </ul>
      </nav>

      {isDropdownOpen && (
        <div className={styles.productDropdown}>
          <ul>
            <li><a href="#">Electronics</a></li>
            <li><a href="#">Clothing</a></li>
            <li><a href="#">Home & Kitchen</a></li>
            <li><a href="#">Books</a></li>
            <li><a href="#">Sports & Outdoors</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Category;
