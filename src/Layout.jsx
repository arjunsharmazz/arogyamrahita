import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Fotter from "../src/components/Fotter";
// import Categorry from "./components/Category";


function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "110px" }}>
        <Outlet /> {/* Page content yaha aayega */}
      </main>
      <Fotter />
    </>
  );
}

export default Layout;
