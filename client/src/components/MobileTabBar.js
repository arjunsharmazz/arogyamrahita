import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiHome5Line, RiShoppingBag3Line, RiShoppingCart2Line } from "react-icons/ri";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdOutlinePerson } from "react-icons/md";
import { FiGrid, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../css/MobileTabBar.module.css";

const hiddenPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/payment",
];

function MobileTabBar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  const pathname = location.pathname;

  const { isAdmin, isDelivery } = useAuth();

  // Hide completely on a set of sensitive paths (auth, payment, etc.)
  if (hiddenPaths.includes(pathname)) return null;

  // If on admin/delivery routes, only show the bar when the signed-in user
  // has the appropriate role. Otherwise hide it.
  if (pathname.startsWith("/admin") && !isAdmin()) return null;
  if (pathname.startsWith("/delivery") && !isDelivery()) return null;

  const tabs = [
    {
      key: "home",
      label: "Home",
      to: "/",
      icon: RiHome5Line,
      isActive: pathname === "/",
    },
    {
      key: "products",
      label: "Products",
      to: "/products",
      icon: RiShoppingBag3Line,
      isActive: pathname === "/products" || pathname.startsWith("/product/"),
    },
    {
      key: "orders",
      label: "Orders",
      to: isAuthenticated() ? "/orders-history" : "/login",
      icon: HiOutlineClipboardList,
      isActive: pathname === "/orders-history",
    },
    {
      key: "account",
      label: "Account",
      to: isAuthenticated() ? "/profile" : "/login",
      icon: MdOutlinePerson,
      isActive: pathname === "/profile",
    },
    {
      key: "cart",
      label: "Cart",
      to: "/cart",
      icon: RiShoppingCart2Line,
      isActive: pathname === "/cart",
      badge: cartCount,
    },
  ];

  // Add an Admin / Delivery quick tab for users with those roles
  if (isAdmin() || isDelivery()) {
    const adminTab = isAdmin()
      ? {
          key: "admin",
          label: "Admin",
          to: "/admin/overview",
          icon: FiGrid,
          isActive: pathname.startsWith("/admin"),
        }
      : {
          key: "delivery",
          label: "Delivery",
          to: "/delivery/orders",
          icon: FiMapPin,
          isActive: pathname.startsWith("/delivery"),
        };

    // put admin button first for visibility
    tabs.unshift(adminTab);
  }

  return (
    <nav className={styles.mobileTabBar} aria-label="Mobile quick navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <NavLink
            key={tab.key}
            to={tab.to}
            className={`${styles.tabItem} ${tab.isActive ? styles.active : ""}`}
            aria-current={tab.isActive ? "page" : undefined}
          >
            <span className={styles.iconWrap}>
              <Icon className={styles.tabIcon} />
              {tab.badge > 0 && <span className={styles.badge}>{tab.badge}</span>}
            </span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileTabBar;