import React from "react";
import styles from "../css/Home.module.css";
import { Truck, ShoppingBag, Leaf, Headset } from "lucide-react";
import heroImageWrapper from "../images/logo.png";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

// Mock data for the product sections
const popularProducts = [
    {
        name: "Dal's",
        image:
            "https://media.istockphoto.com/id/2160775869/photo/image-of-dried-yellow-split-pea-chickpea-chana-dal-lentils-in-white-ceramic-bowl-surrounded.jpg?s=2048x2048&w=is&k=20&c=lW9JQMZSzcU_F0rpSkH4Qu0PzR8EgHSyXT3bVUmbY6U=",
    },
    {
        name: "Dry Fruit's",
        image: "https://images.pexels.com/photos/5425017/pexels-photo-5425017.jpeg",
    },
    {
        name: "Oil's",
        image: "https://images.pexels.com/photos/8450512/pexels-photo-8450512.jpeg",
    },
    {
        name: "Spices's",
        image: "https://images.pexels.com/photos/618491/pexels-photo-618491.jpeg",
    },
    {
        name: "Pickel's",
        image:
            "https://media.istockphoto.com/id/1313674046/photo/mango-pickel-or-homemade-mango-pickle-or-aam-ka-achar-or-kairi-loncha-in-a-wodded-bowl-with.jpg?s=2048x2048&w=is&k=20&c=dTjP96W4xu5E7SXV8Tyfa4mk9vYT9EFMOHGEEmhTbwg=",
    },
];

// Mock data for product deals
const bestDeals = [
    {
        name: "Black Mustard Oil",
        image:
            "https://media.istockphoto.com/id/1311256168/photo/mustard-oil-in-glass-jar-with-black-mustard-seed-flower-and-mustard-cake-isolated-on-white.jpg?s=2048x2048&w=is&k=20&c=j-9Si5ZqRi4ySVZfxpl6o6CLM1qPNNI24ykscRxUP7E=",
        price: 2999,
        oldPrice: 3500,
        discount: "50% Discount",
    },
    {
        name: "Mango Pickle",
        image: "https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg",
        price: 599,
        oldPrice: 650,
        discount: "50% Discount",
    },
    {
        name: "Sabut Jeera",
        image:
            "https://media.istockphoto.com/id/450227743/photo/cumin-seeds.jpg?s=2048x2048&w=is&k=20&c=MrYyP_nkOK3sboS08u-OnDTfUqGZcEFrFRORfVzsjbk=",
        price: 499,
        oldPrice: 550,
        discount: "50% Discount",
    },
    {
        name: "Afghani Akroad",
        image: "https://5.imimg.com/data5/YX/PC/MY-17779515/akrod-500x500.png",
        price: 799,
        oldPrice: 850,
        discount: "50% Discount",
    },
    {
        name: "Yellow Mustard Oil",
        image:
            "https://www.surbhiutpad.com/wp-content/uploads/2023/07/yellow-mustured-oil.png",
        price: 299,
        oldPrice: 350,
        discount: "50% Discount",
    },
    {
        name: "Small Green Chilly",
        image:
            "https://connect.healthkart.com/wp-content/uploads/2022/11/900x500_banner_HK-Connect_Health-Benefits-of-green-chillies.png",
        price: 699,
        oldPrice: 1000,
        discount: "50% Discount",
    },
    {
        name: "Green Elachi",
        image:
            "https://5.imimg.com/data5/SELLER/Default/2023/6/321260192/FB/XQ/YU/84813594/green-cardamom-elachi-.jpg",
        price: 499,
        oldPrice: 700,
        discount: "50% Discount",
    },
    {
        name: "Mountain Anjir",
        image:
            "https://nutshub.in/wp-content/uploads/2024/05/51nq28Gh0sL._AC_UF10001000_QL80_.jpg",
        price: 999,
        oldPrice: 2000,
        discount: "50% Discount",
    },
    {
        name: "ASUS Zenbook A14 OLED",
        image:
            "https://press.asus.com/assets/w_1200,h_630/e879b74c-55b3-4dba-a036-e76abec777c6/ASUS%20Zenbook%20A14%20(Iceland%20Gray).png",
        price: 99990,
        oldPrice: 100000,
        discount: "50% Discount",
    },
    {
        name: "Lemon Pickle",
        image:
            "https://punguskitchen.com/wp-content/uploads/2024/09/Naranga-Achar-Lemon-Pickle.jpg",
        price: 299,
        oldPrice: 500,
        discount: "50% Discount",
    },
];

// Mock data for testimonials
const testimonials = [
    {
        name: "Aisha R.",
        text: "This is my second card set and it fits perfectly. The fabric is super soft, and it looks even better in person. Definitely shopping here again!",
    },
    {
        name: "Liam T.",
        text: "I placed my order on a Monday, got it by Wednesday. Everything came neatly packaged and the fit is just great! I'm really happy with my first purchase.",
    },
    {
        name: "Priya M.",
        text: "They have pretty unique pieces that I don't see on other sites. Took off one star because of the late shipping, but customer support was helpful with the exchange.",
    },
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
        <div className={styles.productDealCardOneBox}>
            <img src={product.image} alt={product.name} />
            <p className={styles.dealName}>{product.name}</p>
        </div>

        <div className={styles.productDealCardPriceAndBuyBox}>
            <div className={styles.dealPrices}>
                <span className={styles.currentPrice}>₹{product.price}</span>
                <span className={styles.oldPrice}>₹{product.oldPrice}</span>
            </div>

            <div className={styles.productDealCardTwoBox}>
                <p className={styles.discountTag}>{product.discount}</p>
                <Link className={styles.buyNowBtn}>Buy Now</Link>
            </div>
        </div>
    </div>
);

const HomePage = () => {
    return (
        <div className={styles.mainApp}>
            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <p className={styles.heroContentSubtitle}>
                        Discover specialized, natural health products for a balanced and
                        healthier life.
                    </p>
                    <h1 className={styles.heroContentTitle}>
                        Arogyam Rahita Wellness Rooted in Nature.
                    </h1>
                    <p className={styles.heroContentText}>
                        We provide Best Quality using the least amount of time, energy, and
                        money.
                    </p>
                    <button className={styles.shopNowBtn}>SHOP NOW</button>
                </div>
                <div className={styles.heroImageWrapper}>
                    <img src={heroImageWrapper} alt="Arogyam Rahita Logo" />
                </div>
            </header>

            <main className={styles.container}>
                {/* Popular Products Section */}
                <section className={styles.populerSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionHeaderTitle}>
                            Popular <span>Product's</span>
                        </h2>
                        <a href="#" className={styles.viewAllLink}>
                            View All &gt;
                        </a>
                    </div>
                    <div className={styles.popularProductsGrid}>
                        {popularProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </section>

                {/* Best Deals Section */}
                <section className={styles.dealSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionHeaderTitle}>
                            Best deal on <span>Product's</span>
                        </h2>
                        <a href="#" className={styles.viewAllLink}>
                            View All &gt;
                        </a>
                    </div>
                    <div className={styles.bestDealsGrid}>
                        {bestDeals.map((product, index) => (
                            <ProductDealCard key={index} product={product} />
                        ))}
                    </div>
                </section>

                {/* Testimonials and CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaSectionSpan}>
                        <h2 className={styles.ctaSectionTitle}>
                            Ready to Transform Your Health?
                        </h2>
                        <p className={styles.ctaSectionText}>
                            Discover a wide range of nutritious and delicious products. Start
                            your journey to a healthier, happier you today!
                        </p>
                    </div>
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={styles.testimonialCard}>
                                <div className={styles.testimonialStars}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <h3 className={styles.testimonialName}>
                                    {testimonial.name}{" "}
                                    <FaCheckCircle className={styles.checkIcon} />
                                </h3>
                                <p className={styles.testimonialText}>"{testimonial.text}"</p>
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
