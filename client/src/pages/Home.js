import React from "react";
import Banner from "../components/Banner";
import Handpick from "../components/Handpick";
import Products from "../components/Product";
import DiscountHero from "../components/DiscountHero";
import Review from "../components/Review";
import ProductsSection from "../components/ProductsSection";

function Home() {
  return (
    <div>
      <Banner />
      <Handpick />
      <Products />
      <ProductsSection />
      <DiscountHero />
      <Review />
    </div>
  );
}

export default Home;
