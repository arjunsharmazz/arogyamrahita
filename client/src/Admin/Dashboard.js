import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBox,
  FiClock,
  FiPackage,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { adminAPI, discountHeroAPI, productAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [discountItems, setDiscountItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [productData, userData, orderData, discountData] = await Promise.all([
          productAPI.getAdminProducts(),
          adminAPI.listUsers(),
          adminAPI.listOrders(),
          discountHeroAPI.listAll(),
        ]);

        setProducts(productData.products || productData || []);
        setUsers(Array.isArray(userData) ? userData : []);
        setOrders(Array.isArray(orderData) ? orderData : orderData.orders || []);
        setDiscountItems(discountData.data || discountData || []);
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive).length;
    const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
    const pendingOrders = orders.filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
    ).length;
    const onlineUsers = users.filter((user) => user.online).length;

    return [
      {
        label: "Total Products",
        value: products.length,
        hint: `${activeProducts} active listings`,
        icon: <FiPackage />,
      },
      {
        label: "Live Orders",
        value: pendingOrders,
        hint: `${deliveredOrders} delivered successfully`,
        icon: <FiShoppingBag />,
      },
      {
        label: "Customer Accounts",
        value: users.length,
        hint: `${onlineUsers} currently online`,
        icon: <FiUsers />,
      },
      {
        label: "Campaign Banners",
        value: discountItems.length,
        hint: `${discountItems.filter((item) => item.isActive).length} active on site`,
        icon: <FiBox />,
      },
    ];
  }, [discountItems, orders, products, users]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 5),
    [orders]
  );

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => {
          if (Array.isArray(product.variants) && product.variants.length > 0) {
            return product.variants.some((variant) => Number(variant.stock || 0) <= 5);
          }

          return Number(product.stock || 0) <= 5;
        })
        .slice(0, 6),
    [products]
  );

  const quickActions = [
    {
      title: "Manage Products",
      description: "Create, update, and organize catalog listings with pricing and variants.",
      to: "/admin/products",
    },
    {
      title: "Track Orders",
      description: "Monitor active orders, update shipment status, and generate invoices.",
      to: "/admin/orders",
    },
    {
      title: "Review Users",
      description: "See customer activity and identify active sessions at a glance.",
      to: "/admin/users",
    },
    {
      title: "Update Discount Hero",
      description: "Refresh homepage promotional blocks and active campaign visuals.",
      to: "/admin/discount-hero",
    },
  ];

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Control Room</p>
          <h2 className={styles.sectionHeading}>Admin overview</h2>
          <p className={styles.sectionSubtext}>
            Sales, inventory, customers, and promotional activity in one place.
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Dashboard data loading...</div>
      ) : (
        <>
          <div className={styles.statGrid}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.statCard}>
                <div className={styles.statIcon}>{metric.icon}</div>
                <p className={styles.statLabel}>{metric.label}</p>
                <h3 className={styles.statValue}>{metric.value}</h3>
                <p className={styles.statHint}>{metric.hint}</p>
              </div>
            ))}
          </div>

          <div className={styles.panelGrid}>
            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Quick routes</h3>
                  <p className={styles.cardDescription}>
                    Dedicated sections keep admin work cleaner and faster.
                  </p>
                </div>
              </div>

              <div className={styles.quickActions}>
                {quickActions.map((item) => (
                  <Link key={item.to} to={item.to} className={styles.actionTile}>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <FiArrowRight />
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Recent orders</h3>
                  <p className={styles.cardDescription}>
                    Latest customer orders with quick operational visibility.
                  </p>
                </div>
                <Link to="/admin/orders" className={styles.textLink}>
                  Open orders
                </Link>
              </div>

              <div className={styles.listStack}>
                {recentOrders.length === 0 ? (
                  <div className={styles.emptyState}>No orders available right now.</div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order._id} className={styles.listItem}>
                      <div>
                        <p className={styles.listTitle}>{order.user?.name || "Guest User"}</p>
                        <p className={styles.listMeta}>{order.user?.email || "No email"}</p>
                      </div>
                      <div className={styles.listAside}>
                        <span className={styles.statusBadge}>{order.status}</span>
                        <p className={styles.listMeta}>
                          <FiClock /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Low stock watchlist</h3>
                  <p className={styles.cardDescription}>
                    Products that need restocking attention soon.
                  </p>
                </div>
                <Link to="/admin/products" className={styles.textLink}>
                  Open catalog
                </Link>
              </div>

              <div className={styles.listStack}>
                {lowStockProducts.length === 0 ? (
                  <div className={styles.emptyState}>All tracked products are sufficiently stocked.</div>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product._id} className={styles.listItem}>
                      <div>
                        <p className={styles.listTitle}>{product.name}</p>
                        <p className={styles.listMeta}>{product.category || "general"}</p>
                      </div>
                      <div className={styles.listAside}>
                        <span className={styles.warningBadge}>
                          {Array.isArray(product.variants) && product.variants.length > 0
                            ? "Variant stock low"
                            : `${product.stock || 0} left`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className={styles.panelCard}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h3 className={styles.cardTitle}>Customer activity</h3>
                  <p className={styles.cardDescription}>
                    Quick visibility into customer availability and engagement.
                  </p>
                </div>
                <Link to="/admin/users" className={styles.textLink}>
                  Open users
                </Link>
              </div>

              <div className={styles.listStack}>
                {users.slice(0, 6).map((user) => (
                  <div key={user._id || user.id} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{user.name}</p>
                      <p className={styles.listMeta}>{user.email}</p>
                    </div>
                    <span className={user.online ? styles.successBadge : styles.neutralBadge}>
                      {user.online ? "Online" : "Offline"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
