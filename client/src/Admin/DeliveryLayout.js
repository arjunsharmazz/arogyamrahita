import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiShoppingBag, FiCompass, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import styles from "../css/AdminPanel.module.css";

const navItems = [
  { to: "/delivery/orders", label: "Orders", icon: <FiShoppingBag /> },
  { to: "/delivery/distance", label: "Distance", icon: <FiMapPin /> },
];

const pageTitles = {
  "/delivery/orders": "Order Operations",
  "/delivery/distance": "Delivery Distance",
};

const DeliveryLayout = () => {
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
              <h1>Delivery Panel</h1>
              <p>Delivery operations</p>
            </div>
          </div>

          <div className={styles.sidebarIntro}>
            <p className={styles.eyebrow}>Signed in</p>
            <h3>{user?.name || "Delivery"}</h3>
            <p>{user?.email || ""}</p>
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
          <button className={styles.ghostButton} onClick={() => navigate("/")}>
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
            <p className={styles.eyebrow}>Delivery Panel</p>
            <h2>{pageTitles[location.pathname] || "Orders"}</h2>
          </div>
        </div>

        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;
