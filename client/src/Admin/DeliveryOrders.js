import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheckCircle, FiFileText, FiFilter, FiPrinter, FiTruck } from "react-icons/fi";
import InvoiceModal, { BulkInvoicePrint } from "../components/InvoiceModal";
import OrderTracker from "../components/OrderTracker";
import styles from "../css/AdminPanel.module.css";
import { ordersAPI } from "../services/Api";
import { useReactToPrint } from "react-to-print";
import { formatOrderDate, orderStatuses } from "./adminUtils";

const STATUS_TABS = [
  { key: "PLACED", label: "Accept Orders", icon: "📥" },
  { key: "READY_FOR_DELIVERY", label: "Ready for Delivery", icon: "📦" },
  { key: "SHIPPED", label: "Shipped", icon: "🚚" },
  { key: "DELIVERED", label: "Delivered", icon: "✅" },
  { key: "CANCELLED", label: "Cancelled", icon: "❌" },
];

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderUpdating, setOrderUpdating] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("PLACED");
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Payment collection modal state
  const [paymentModal, setPaymentModal] = useState({ open: false, orderId: null, fromDropdown: false, newStatus: null });

  const bulkPrintRef = useRef();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.listAll();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setSelectedOrders([]);
  }, [activeTab]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (order.status !== activeTab) return false;
        let matches = true;
        if (nameFilter) {
          matches = order.user?.name?.toLowerCase().includes(nameFilter.toLowerCase());
        }
        if (matches && dateFilter) {
          matches = (order.createdAt || "").slice(0, 10) === dateFilter;
        }
        return matches;
      }),
    [dateFilter, nameFilter, orders, activeTab]
  );

  const tabCounts = useMemo(() => {
    const counts = {};
    STATUS_TABS.forEach((tab) => {
      counts[tab.key] = orders.filter((o) => o.status === tab.key).length;
    });
    return counts;
  }, [orders]);

  const stats = useMemo(() => {
    const active = orders.filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
    ).length;
    const delivered = orders.filter((order) => order.status === "DELIVERED").length;
    const cancelled = orders.filter((order) => order.status === "CANCELLED").length;

    return [
      { label: "Total orders", value: orders.length },
      { label: "In progress", value: active },
      { label: "Delivered", value: delivered },
      { label: "Cancelled", value: cancelled },
    ];
  }, [orders]);

  const updateOrderStatus = async (orderId, status, paymentCollectedAs) => {
    try {
      setOrderUpdating(orderId);
      await ordersAPI.updateStatus(orderId, status, paymentCollectedAs);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order", error);
    } finally {
      setOrderUpdating(null);
    }
  };

  // When delivery boy changes status to DELIVERED, ask for payment method
  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === "DELIVERED") {
      setPaymentModal({ open: true, orderId, fromDropdown: true, newStatus });
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const handlePaymentSelect = async (method) => {
    const { orderId } = paymentModal;
    setPaymentModal({ open: false, orderId: null, fromDropdown: false, newStatus: null });
    await updateOrderStatus(orderId, "DELIVERED", method);
  };

  const getPaymentBadgeMeta = (paymentType) => {
    if (paymentType === "cash") {
      return { label: "Cash", background: "#fef3c7", color: "#92400e", icon: "💵" };
    }
    if (paymentType === "due") {
      return { label: "Due", background: "#fee2e2", color: "#b91c1c", icon: "🧾" };
    }
    return { label: "UPI", background: "#dbeafe", color: "#1e40af", icon: "📱" };
  };

  const handleBulkPrint = useReactToPrint({
    contentRef: bulkPrintRef,
    documentTitle: `All-Invoices-${activeTab}-${dateFilter || new Date().toISOString().slice(0, 10)}`,
  });

  const toggleSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o._id));
    }
  };

  const isPlacedTab = activeTab === "PLACED";

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Delivery</p>
          <h2 className={styles.sectionHeading}>Order management</h2>
          <p className={styles.sectionSubtext}>
            Manage orders, update status, and collect payment on delivery.
          </p>
        </div>
      </div>

      <div className={styles.statGridCompact}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCardCompact}>
            <span className={styles.statIcon}><FiTruck /></span>
            <div>
              <p className={styles.statLabel}>{item.label}</p>
              <h3 className={styles.statValueCompact}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className={styles.orderTabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.orderTab} ${activeTab === tab.key ? styles.orderTabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={styles.tabBadge}>{tabCounts[tab.key] || 0}</span>
          </button>
        ))}
      </div>

      <section className={styles.panelCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <label><FiFilter /> Filter by name</label>
            <input
              className={styles.filterInput}
              type="text"
              placeholder="Search customer"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className={styles.filterField}>
            <label>Date</label>
            <input
              className={styles.filterInput}
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <button
            className={styles.secondaryButton}
            onClick={handleBulkPrint}
            disabled={filteredOrders.length === 0}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FiPrinter /> Print All Invoices ({filteredOrders.length})
          </button>
        </div>

        {loading ? (
          <div className={styles.emptyState}>Order data loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>No orders in "{STATUS_TABS.find((t) => t.key === activeTab)?.label}" tab.</div>
        ) : (
          <div className={styles.orderGrid}>
            {filteredOrders.map((order) => (
              <article key={order._id} className={`${styles.orderCard} ${selectedOrders.includes(order._id) ? styles.orderCardSelected : ""}`}>
                <div className={styles.orderCardHeader}>
                  <div>
                    <h3>{order.user?.name || "Guest User"}</h3>
                    <p>{order.user?.email || "No email available"}</p>
                  </div>
                  <span className={styles.statusBadge}>{order.status}</span>
                </div>

                <p className={styles.orderMeta}>{formatOrderDate(order.createdAt)}</p>

                <div className={styles.shippingBox}>
                  <h4>Shipping address</h4>
                  <p><strong>Name:</strong> {order.shippingAddress?.name || "-"}</p>
                  <p><strong>Address:</strong> {order.shippingAddress?.address || "-"}</p>
                  <p><strong>City:</strong> {order.shippingAddress?.city || "-"}</p>
                  <p><strong>State:</strong> {order.shippingAddress?.state || "-"}</p>
                  <p><strong>Pincode:</strong> {order.shippingAddress?.pincode || "-"}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress?.phone || "-"}</p>
                </div>

                <div className={styles.orderItemsBlock}>
                  {(order.items || []).map((item, index) => (
                    <div key={`${order._id}-${index}`} className={styles.orderItemRow}>
                      <span>
                        {item.quantity} x {item.name}
                        {item.variant?.weight && item.variant?.weightUnit
                          ? ` (${item.variant.weight} ${item.variant.weightUnit})`
                          : ""}
                      </span>
                      <strong>₹{item.price}</strong>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <strong>Total: ₹{order.totalAmount}</strong>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={orderUpdating === order._id}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show payment collected info on delivered orders */}
                {order.status === "DELIVERED" && order.paymentCollectedAs && (
                  (() => {
                    const paymentMeta = getPaymentBadgeMeta(order.paymentCollectedAs);
                    return (
                      <div style={{
                        marginTop: 10,
                        padding: "8px 14px",
                        borderRadius: 8,
                        background: paymentMeta.background,
                        color: paymentMeta.color,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        display: "inline-block",
                      }}>
                        {paymentMeta.icon} Payment: {paymentMeta.label}
                      </div>
                    );
                  })()
                )}

                <div className={styles.orderActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setInvoiceOrder(order)}
                  >
                    <FiFileText /> View Invoice
                  </button>
                </div>

                <div className={styles.trackerWrap}>
                  <OrderTracker status={order.status} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Payment Collection Modal */}
      {paymentModal.open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999,
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "32px 28px",
            maxWidth: 380, width: "90%", textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ marginBottom: 8, color: "#18392f" }}>Payment Collection</h3>
            <p style={{ color: "#6b7280", marginBottom: 24, fontSize: "0.9rem" }}>
              How was the payment handled?
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => handlePaymentSelect("cash")}
                style={{
                  padding: "14px 28px", borderRadius: 10, border: "2px solid #f59e0b",
                  background: "#fffbeb", color: "#92400e", fontWeight: 700,
                  fontSize: "1rem", cursor: "pointer", flex: 1,
                  transition: "transform 0.15s",
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                💵 Cash
              </button>
              <button
                onClick={() => handlePaymentSelect("upi")}
                style={{
                  padding: "14px 28px", borderRadius: 10, border: "2px solid #3b82f6",
                  background: "#eff6ff", color: "#1e40af", fontWeight: 700,
                  fontSize: "1rem", cursor: "pointer", flex: 1,
                  transition: "transform 0.15s",
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                📱 UPI
              </button>
              <button
                onClick={() => handlePaymentSelect("due")}
                style={{
                  padding: "14px 28px", borderRadius: 10, border: "2px solid #ef4444",
                  background: "#fef2f2", color: "#b91c1c", fontWeight: 700,
                  fontSize: "1rem", cursor: "pointer", flex: 1,
                  transition: "transform 0.15s",
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                🧾 Due
              </button>
            </div>
            <button
              onClick={() => setPaymentModal({ open: false, orderId: null, fromDropdown: false, newStatus: null })}
              style={{
                marginTop: 18, padding: "8px 20px", borderRadius: 8,
                border: "1px solid #d1d5db", background: "#f3f4f6",
                color: "#6b7280", cursor: "pointer", fontSize: "0.85rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

      <div style={{ display: "none" }}>
        <BulkInvoicePrint ref={bulkPrintRef} orders={filteredOrders} />
      </div>
    </div>
  );
};

export default DeliveryOrders;
