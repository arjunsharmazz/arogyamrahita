
import React from 'react'
import ScrollAnimation from '../components/ScrollAnimation'

import Banner from '../components/Banner' 
import Handpick from '../components/Handpick'
import Products from '../components/Product'
import DiscountHero from '../components/DiscountHero'
import Review from "../components/Review"
import ProductsSection from "../components/ProductsSection"

function Home() {
  return (
    <div>
      <ScrollAnimation direction="up">
        <Banner/>
      </ScrollAnimation>

      <ScrollAnimation direction="up">
        <Handpick/>
      </ScrollAnimation>

      <ScrollAnimation direction="up">
        <Products/>
      </ScrollAnimation>

      <ScrollAnimation direction="up">
        <ProductsSection/>
      </ScrollAnimation>

      <ScrollAnimation direction="up">
        <DiscountHero/>
      </ScrollAnimation>

      <ScrollAnimation direction="up">
        <Review/>
      </ScrollAnimation>
    </div>
  )
}

export default Home






















// import React from 'react'
// // import { BrowserRouter,Routes,Route } from 'react-router-dom'

// // import Navbar from '../components/Navbar'
// // import Categorry from '../components/Category'
// import Banner from '../components/Banner' 
// import Handpick from '../components/Handpick'
// import Products from '../components/Product'
// import DiscountHero from '../components/DiscountHero'
// // import Fotter from '../components/Fotter'
// import Review from "../components/Review"
// import ProductsSection from "../components/ProductsSection"

// function Home() {
//   return (
//     <div>
// {/* 
//       <Categorry/> */}
//       <Banner/>
//       <Handpick/>
//       <Products/>
//       <ProductsSection/>
//       <DiscountHero/>
//       <Review/>

//     </div>
//   )
// }

// export default Home
