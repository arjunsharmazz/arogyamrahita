import React from "react";
import Banner from "../components/Banner";
import Handpick from "../components/Handpick";
import DiscountHero from "../components/DiscountHero";
import ProductsSection from "../components/ProductsSection";

function Home() {
  return (
    <div>
      <Banner />
      <Handpick />
      {/* <Products /> */}
      <ProductsSection />
      <DiscountHero />
      {/* <Review /> */}
    </div>
  );
}

export default Home;
