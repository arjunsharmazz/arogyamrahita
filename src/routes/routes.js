import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
// import Home from "../pages/Home";
// import Products from "../components/Product";
// import Review from "../components/Review"

// // Layout (Navbar + Footer common)
// import Layout from "../Layout";
// import Handpick from "../components/Handpick";
// import ProductsSection from "../components/ProductsSection"
import AnimatedRoutes from "./AnimatedRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
     <AnimatedRoutes />

      {/* <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />         
          <Route path="product" element={<Products />} />
          <Route path="category" element={<Handpick/>} />
          <Route path="featureproduct" element={<ProductsSection />} />
          <Route path="review" element={<Review />} />
        </Route>
      </Routes> */}
    </BrowserRouter>
  );
}

export default AppRoutes;
