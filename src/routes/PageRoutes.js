import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/HomePage";
import About from "../pages/AboutPage";
import Products from "../pages/ProductsPage";
import Footer from "../components/Footer";

const PageRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                {/*
                 add Quick Link Privacy Policy
Terms Of Use
FAQ
Contact
 */}
            </Routes>
            <Footer />
        </>
    );
};

export default PageRoutes;
