// src/components/PageTransition.js
import React from "react";
import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}   // starting chhota + invisible
      animate={{ opacity: 1, scale: 1 }}     // zoom in & visible
      exit={{ opacity: 0, scale: 0.95 }}     // jab exit kare toh halka shrink
      transition={{
        duration: 0.5,       // smooth speed
        ease: [0.25, 0.1, 0.25, 1] // smooth cubic-bezier easing
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
