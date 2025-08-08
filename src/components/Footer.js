import React from 'react';
import { NavLink, } from "react-router-dom";
import styles from "../css/Footer.module.css"
import logoImage from "../images/logo.png"

const Footer = () => {
    return (
        <footer className={styles.footerMainBox}>
            <div className={styles.footerContainer}>
                <div className={styles.footerMain}>

                    {/* Logo Section */}
                    <div className={styles.footerLogoSection}>
                        <div className={styles.footerLogoWrapper}>
                            <img src={logoImage} alt="Logo" className={styles.footerLogo} />
                        </div>
                    </div>

                    {/* Support */}
                    <div className={styles.footerSupport}>
                        <h3>Support</h3>
                        <address>
                            3E-Near Divider Road,<br />
                            Meerut, Uttar Pradesh<br />
                            <a href="mailto:rhrhythm@gmail.com">rhrhythm@gmail.com</a><br />
                            91+ 9012897031
                        </address>
                    </div>

                    {/* Quick Link */}
                    <div className={styles.footerLinks}>
                        <h3>Quick Link</h3>
                        <ul>
                            <li>
                                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
                            </li>
                            <li>
                                <NavLink to="/terms-of-use">Terms Of Use</NavLink>
                            </li>
                            <li>
                                <NavLink to="/faq">FAQ</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact">Contact</NavLink>
                            </li>

                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={styles.footerBottom}>
                    <p>© Copyright Aarogyam Rahita 2025. All right reserved</p>
                </div>
            </div>
        </footer>

    );
}

export default Footer;
