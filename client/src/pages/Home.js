import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Handpick from '../components/Handpick'
import Products from '../components/Product'
import DiscountHero from '../components/DiscountHero'
import Fotter from '../components/Fotter'
import Review from "../components/Review"
import ProductsSection from "../components/ProductsSection"

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
  )
}

export default Home
