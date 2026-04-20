import React from "react";
import { motion } from "framer-motion";
import styles from "../css/Fotter.module.css";
import { Link } from "react-router-dom";

const Fotter = () => {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.footerContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`${styles.footerSection} ${styles.newsletterSection}`}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className={styles.newsletterTitle}>Don't Miss Out</h3>
          <p className={styles.newsletterText}>
            Sign up for the latest beauty news, product samples and coupons
          </p>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              required
            />
            <input type="date" placeholder="MM/DD/YYYY" required />
            <button type="submit">Sign Up</button>
          </form>
          <p className={styles.note}>
            This site is intended for US consumers. By signing up, you agree to
            our <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
            <Link to="/terms-and-conditions">Terms of Use</Link>.
          </p>
        </motion.div>

        {/* Footer Columns */}
        <motion.div
          className={`${styles.footerSection} ${styles.linksSection}`}
          whileHover={{ x: 5 }}
        >
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/shipping-delivery">Shipping & Delivery</Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className={`${styles.footerSection} ${styles.linksSection}`}
          whileHover={{ x: 5 }}
        >
          <h3>Customer Service</h3>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/help-support">Help & Support</Link>
            </li>
            <li>
              <Link to="/returnRefund">Return & Refund Policy</Link>
            </li>
            <li>
              <Link to="/account-deletion">Account & Data Deletion</Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className={`${styles.footerSection} ${styles.linksSection}`}
          whileHover={{ x: 5 }}
        >
          <h3>Legal & More</h3>
          <ul>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/user-content-policy">User Content Policy</Link>
            </li>
            <li>
              <Link to="/videos">Videos</Link>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.footerBottom}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className={styles.certificateBadge}>
          <span className={styles.certificateLabel}>FSSAI Registered</span>
          <strong className={styles.certificateNumber}>Lic. No. 22725628000102</strong>
        </div>
        <div className={styles.socialIcons}>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://x.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
          <a href="https://in.pinterest.com" target="_blank" rel="noreferrer"><i className="fab fa-pinterest"></i></a>
        </div>
        <div className={styles.bottomLinks}>
          <Link to="/sitemap">Site Map</Link>
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-and-conditions">Terms</Link>
          <Link to="/shipping-delivery">Shipping</Link>
          <Link to="/user-content-policy">User Content Terms</Link>
        </div>
        <p>© 2025 Āarogyām Rahita. All rights reserved.</p>
      </motion.div>
    </footer>
  );
};

export default Fotter;
