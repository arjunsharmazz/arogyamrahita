import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiCompass,
  FiGift,
  FiGrid,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import styles from "../css/AdminPanel.module.css";

const navItems = [
  { to: "/admin/overview", label: "Overview", icon: <FiGrid /> },
  { to: "/admin/products", label: "Products", icon: <FiPackage /> },
  { to: "/admin/orders", label: "Orders", icon: <FiShoppingBag /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
  { to: "/admin/delivery-distance", label: "Delivery Distance", icon: <FiMapPin /> },
  { to: "/admin/discount-hero", label: "Discount Hero", icon: <FiGift /> },
];

const pageTitles = {
  "/admin/overview": "Overview",
  "/admin/products": "Product Manager",
  "/admin/orders": "Order Operations",
  "/admin/users": "Customer Directory",
  "/admin/delivery-distance": "Delivery Distance",
  "/admin/discount-hero": "Discount Hero Manager",
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.adminShell}>
      <aside className={styles.adminSidebar}>
        <div>
          <div className={styles.sidebarBrand}>
            <span className={styles.brandAccent}>AR</span>
            <div>
              <h1>Arogyam Admin</h1>
              <p>Operations console</p>
            </div>
          </div>

          <div className={styles.sidebarIntro}>
            <p className={styles.eyebrow}>Signed in</p>
            <h3>{user?.name || "Admin"}</h3>
            <p>{user?.email || "Manage products, orders, and promotions."}</p>
          </div>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.ghostButton} onClick={() => navigate("/") }>
            <FiCompass /> Visit main site
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className={styles.adminMain}>
        <div className={styles.adminTopbar}>
          <div>
            <p className={styles.eyebrow}>Admin Panel</p>
            <h2>{pageTitles[location.pathname] || "Dashboard"}</h2>
          </div>
          <div className={styles.topbarNote}>
            Clean route-based navigation for day-to-day operations.
          </div>
        </div>

        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;