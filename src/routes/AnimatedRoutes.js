import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout & Pages
import Layout from "../Layout";
import Home from "../pages/Home";
import Products from "../components/Product";
import Review from "../components/Review";
import Handpick from "../components/Handpick";
import ProductsSection from "../components/ProductsSection";

// Transition Wrapper
import PageTransition from "../components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Layout wrapper for Navbar/Footer */}
        <Route path="/" element={<Layout />}>
          
          {/* Home page */}
          <Route
            index
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />

          {/* Product page */}
          <Route
            path="product"
            element={
              <PageTransition>
                <>
                  <Products />
                  {/* <Review /> */}
                </>
              </PageTransition>
            }
          />

          {/* Category page */}
          <Route
            path="category"
            element={
              <PageTransition>
                <>
                  <Handpick />
                  {/* <Review /> */}
                </>
              </PageTransition>
            }
          />

          {/* Feature Product page */}
          <Route
            path="featureproduct"
            element={
              <PageTransition>
                <ProductsSection />
              </PageTransition>
            }
          />

          {/* Review page */}
          <Route
            path="review"
            element={
              <PageTransition>
                <Review />
              </PageTransition>
            }
          />

        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
