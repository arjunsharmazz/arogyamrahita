import React from 'react';
import styles from '../css/Home.module.css';
import { Truck, ShoppingBag, Leaf, Headset } from 'lucide-react';

// Mock data for the product sections
const popularProducts = [
    { name: "Dal's", image: "https://placehold.co/100x100/A08A5E/fff?text=Dal's" },
    { name: "Dry Fruit's", image: "https://placehold.co/100x100/F0D29E/fff?text=Dry+Fruit's" },
    { name: "Oil's", image: "https://placehold.co/100x100/A08A5E/fff?text=Oil's" },
    { name: "Spices's", image: "https://placehold.co/100x100/F0D29E/fff?text=Spices's" },
    { name: "Pickel's", image: "https://placehold.co/100x100/A08A5E/fff?text=Pickel's" },
];

// Mock data for product deals
const bestDeals = [
    { name: "Black Mustard Oil", image: "https://placehold.co/100x100/F0D29E/fff?text=Oil", price: 2999, oldPrice: 3500, discount: "50% Discount" },
    { name: "Mango Pickle", image: "https://placehold.co/100x100/A08A5E/fff?text=Pickle", price: 599, oldPrice: 650, discount: "50% Discount" },
    { name: "Sabut Jeera", image: "https://placehold.co/100x100/F0D29E/fff?text=Jeera", price: 499, oldPrice: 550, discount: "50% Discount" },
    { name: "Afghani Akroad", image: "https://placehold.co/100x100/A08A5E/fff?text=Akroad", price: 799, oldPrice: 850, discount: "50% Discount" },
    { name: "Yellow Mustard Oil", image: "https://placehold.co/100x100/F0D29E/fff?text=Oil", price: 299, oldPrice: 350, discount: "50% Discount" },
    { name: "Small Green Chilly", image: "https://placehold.co/100x100/A08A5E/fff?text=Chilly", price: 699, oldPrice: 1000, discount: "50% Discount" },
    { name: "Green Elachi", image: "https://placehold.co/100x100/F0D29E/fff?text=Elachi", price: 499, oldPrice: 700, discount: "50% Discount" },
    { name: "Mountain Anjir", image: "https://placehold.co/100x100/A08A5E/fff?text=Anjir", price: 999, oldPrice: 2000, discount: "50% Discount" },
    { name: "ASUS Zenbook A14 OLED", image: "https://placehold.co/100x100/F0D29E/fff?text=Laptop", price: 99990, oldPrice: 100000, discount: "50% Discount" },
    { name: "Lemon Pickle", image: "https://placehold.co/100x100/A08A5E/fff?text=Pickle", price: 299, oldPrice: 500, discount: "50% Discount" },
];

// Mock data for testimonials
const testimonials = [
    { name: "Aisha R.", text: "This is my second card set and it fits perfectly. The fabric is super soft, and it looks even better in person. Definitely shopping here again!" },
    { name: "Liam T.", text: "I placed my order on a Monday, got it by Wednesday. Everything came neatly packaged and the fit is just great! I'm really happy with my first purchase." },
    { name: "Priya M.", text: "They have pretty unique pieces that I don't see on other sites. Took off one star because of the late shipping, but customer support was helpful with the exchange." },
];

// Reusable Product Card component
const ProductCard = ({ product }) => (
    <div className={styles.productCard}>
        <img src={product.image} alt={product.name} />
        <p>{product.name}</p>
    </div>
);

// Reusable Product Deal Card component
const ProductDealCard = ({ product }) => (
    <div className={styles.productDealCard}>
        <img src={product.image} alt={product.name} />
        <p className={styles.dealName}>{product.name}</p>
        <div className={styles.dealPrices}>
            <span className={styles.currentPrice}>₹{product.price}</span>
            <span className={styles.oldPrice}>₹{product.oldPrice}</span>
        </div>
        <p className={styles.discountTag}>{product.discount}</p>
    </div>
);

const HomePage = () => {
    return (
        <div className={styles.mainApp}>
            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <p className={styles.heroContentSubtitle}>Discover specialized, natural health products for a balanced and healthier life.</p>
                    <h1 className={styles.heroContentTitle}>Arogyam Rahita Wellness Rooted in Nature.</h1>
                    <p className={styles.heroContentText}>We provide Best Quality using the least amount of time, energy, and money.</p>
                    <button className={styles.shopNowBtn}>SHOP NOW</button>
                </div>
                <div className={styles.heroImageWrapper}>
                    <img src="https://placehold.co/400x200/F0D29E/fff?text=Arogyam+Rahita+Logo" alt="Arogyam Rahita Logo" />
                </div>
            </header>

            <main className={styles.container}>

                {/* Popular Products Section */}
                <section className="mb-12">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionHeaderTitle}>Popular <span>Product's</span></h2>
                        <a href="#" className={styles.viewAllLink}>View All &gt;</a>
                    </div>
                    <div className={styles.popularProductsGrid}>
                        {popularProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </section>

                {/* Best Deals Section */}
                <section className="mb-12">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionHeaderTitle}>Best deal on <span>Product's</span></h2>
                        <a href="#" className={styles.viewAllLink}>View All &gt;</a>
                    </div>
                    <div className={styles.bestDealsGrid}>
                        {bestDeals.map((product, index) => (
                            <ProductDealCard key={index} product={product} />
                        ))}
                    </div>
                </section>

                {/* Testimonials and CTA Section */}
                <section className={styles.ctaSection}>
                    <h2 className={styles.ctaSectionTitle}>Ready to Transform Your Health?</h2>
                    <p className={styles.ctaSectionText}>Discover a wide range of nutritious and delicious products. Start your journey to a healthier, happier you today!</p>
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={styles.testimonialCard}>
                                <div className={styles.testimonialStars}>
                                    {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                                <p className={styles.testimonialName}>{testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* USP/Features Section */}
                <section className={styles.uspSection}>
                    <div className={styles.uspGrid}>
                        <div className={styles.uspItem}>
                            <ShoppingBag className={styles.uspIcon} />
                            <h3 className={styles.uspItemTitle}>High Quality Products</h3>
                        </div>
                        <div className={styles.uspItem}>
                            <Truck className={styles.uspIcon} />
                            <h3 className={styles.uspItemTitle}>Free Home Delivery</h3>
                        </div>
                        <div className={styles.uspItem}>
                            <Leaf className={styles.uspIcon} />
                            <h3 className={styles.uspItemTitle}>100% Organic</h3>
                        </div>
                        <div className={styles.uspItem}>
                            <Headset className={styles.uspIcon} />
                            <h3 className={styles.uspItemTitle}>24 X 7 Support</h3>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
