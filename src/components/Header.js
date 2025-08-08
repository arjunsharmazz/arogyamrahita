import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import logo from "../images/logo.png";
import styles from "../css/Header.module.css";

const Header = () => {
    return (
        <header className={styles.headerBox}>
            {/* Mobile Menu */}
            <div className={styles.mobileMenu}>
                <button className={styles.menuButton}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Logo Section */}
            <div className={styles.logoSection}>
                <Link to="/">
                    <img
                        className={styles.logoImage}
                        src={logo}
                        alt="logo not found"
                    />
                </Link>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search"
                    className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                    <Search size={20} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className={styles.navLinks}>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                    }
                >
                    Product's
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                    }
                >
                    About us
                </NavLink>
            </nav>

            {/* User Actions */}
            <div className={styles.userActions}>
                <button className={styles.loginButton}>
                    Login
                </button>
                <button className={styles.signInButton}>
                    Sign in
                </button>
                <button className={styles.cartButton}>
                    <ShoppingCart size={24} />
                </button>
                <button className={styles.userButton}>
                    <User size={24} />
                </button>
            </div>
        </header>
    );
};

export default Header;
