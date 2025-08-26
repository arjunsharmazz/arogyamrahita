import React, { useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    ShoppingCart,
    Menu,
    ListFilter,
} from "lucide-react";

import styles from "../css/ProductPage.module.css";

const ProductPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openFilters, setOpenFilters] = useState({
        category: true,
        price: true,
        size: true,
        dressStyle: true,
    });

    const [priceValue, setPriceValue] = useState(200);
    const [selectedSize, setSelectedSize] = useState("Large");

    const category = [
        "Neem Oil",
        "Chyawanprash",
        "Tulsi Drops",
        "Karela Juice",
        "Saffron",
        "Herbal Tea",
        "Chyawanprash",
    ];
    const products = [
        {
            id: 1,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 2,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 3,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 4,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 5,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 6,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 7,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 8,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 9,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 10,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 11,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
        {
            id: 12,
            name: "Lemon Pickel",
            price: 230,
            oldPrice: 250,
            imageUrl:
                "https://images.pexels.com/photos/1907644/pexels-photo-1907644.jpeg",
        },
    ];

    const FilterSection = ({ title, children, sectionKey }) => {
        const isOpen = openFilters[sectionKey];
        return (
            <div className={styles.filterSection}>
                <div
                    className={styles.filterHeader}
                    onClick={() =>
                        setOpenFilters((prev) => ({
                            ...prev,
                            [sectionKey]: !isOpen,
                        }))
                    }
                >
                    <h3 className={styles.filterTitle}>{title}</h3>
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div
                    className={`${styles.filterContent} ${isOpen ? styles.open : styles.closed
                        }`}
                >
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Hamburger Button (Mobile) */}
            <button
                className={styles.hamburgerBtn}
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <aside
                className={`${styles.sidebar} ${isSidebarOpen ? styles.showSidebar : ""
                    }`}
            >
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Filters</h2>
                    <div className={styles.sidebarIcons}>
                        <ListFilter size={20} />
                        {/* Close button */}
                        <Menu
                            size={20}
                            className={styles.closeBtn}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>

                {/* Category */}
                <FilterSection title="Category" sectionKey="category">
                    <ul className={styles.list}>
                        {category.map((item, index) => (
                            <li key={index} className={styles.listItem}>
                                <span>{item}</span>
                                <ChevronRight size={16} />
                            </li>
                        ))}
                    </ul>
                </FilterSection>

                {/* Price */}
                <FilterSection title="Price" sectionKey="price">
                    <div className={styles.priceRange}>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            className={styles.rangeInput}
                        />
                        <div className={styles.priceLabels}>
                            <span>₹0</span>
                            <span>₹1000</span>
                        </div>
                        <div className={styles.currentPrice}>
                            Selected: ₹{priceValue}
                        </div>
                    </div>
                </FilterSection>

                <button className={styles.applyButton}>Apply Filters</button>
            </aside>

            {/* Product Grid */}
            <main className={styles.main}>
                <div className={styles.topBar}>
                    <h1 className={styles.pageTitle}>Organic Products</h1>
                    <div className={styles.sortSection}>
                        <span className={styles.productCount}>
                            Showing 1-12 of 100 Products
                        </span>
                        <div className={styles.sortWrapper}>
                            <span className={styles.sortLabel}>Sort by</span>
                            <select className={styles.sortSelect}>
                                <option className={styles.sortOption}>Most Popular</option>
                                <option className={styles.sortOption}>
                                    Price: Low to High
                                </option>
                                <option className={styles.sortOption}>
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.card}>
                            <div className={styles.saleBadge}>Sale</div>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.src =
                                        "https://placehold.co/300x300/FACC15/FFFFFF?text=Placeholder";
                                }}
                            />
                            <div className={styles.cardBody}>
                                <div className={styles.priceWrapper}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.newPrice}>₹{product.price}</span>
                                    <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.cartButton}>
                                        <ShoppingCart size={20} />
                                    </button>
                                    <button className={styles.buyButton}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProductPage;
