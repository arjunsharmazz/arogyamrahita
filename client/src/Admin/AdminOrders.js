import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheckCircle, FiDownload, FiFileText, FiFilter, FiPrinter, FiTruck } from "react-icons/fi";
import InvoiceModal, { BulkInvoicePrint } from "../components/InvoiceModal";
import OrderTracker from "../components/OrderTracker";
import styles from "../css/AdminPanel.module.css";
import { adminAPI, ordersAPI } from "../services/Api";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import {
  formatOrderDate,
  orderStatuses,
} from "./adminUtils";

const STATUS_TABS = [
  { key: "PLACED", label: "Accept Orders", icon: "📥" },
  { key: "READY_FOR_DELIVERY", label: "Ready for Delivery", icon: "📦" },
  { key: "SHIPPED", label: "Shipped", icon: "🚚" },
  { key: "DELIVERED", label: "Delivered", icon: "✅" },
  { key: "CANCELLED", label: "Cancelled", icon: "❌" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderUpdating, setOrderUpdating] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [bulkAccepting, setBulkAccepting] = useState(false);
  const [activeTab, setActiveTab] = useState("PLACED");
  const [selectedOrders, setSelectedOrders] = useState([]);

  const bulkPrintRef = useRef();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.listOrders();
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

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedOrders([]);
  }, [activeTab]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        // Filter by active tab status
        if (order.status !== activeTab) return false;

        let matches = true;
        if (nameFilter) {
          const q = nameFilter.toLowerCase();
          matches = (order.user?.name || order.shippingAddress?.name || "")
            .toLowerCase()
            .includes(q);
        }
        if (matches && dateFilter) {
          matches = (order.createdAt || "").slice(0, 10) === dateFilter;
        }
        if (matches && monthFilter) {
          matches = (order.createdAt || "").slice(0, 7) === monthFilter;
        }
        return matches;
      }),
    [dateFilter, monthFilter, nameFilter, orders, activeTab]
  );

  const deliveredExportOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (order.status !== "DELIVERED") return false;

        let matches = true;
        if (nameFilter) {
          const q = nameFilter.toLowerCase();
          matches = (order.user?.name || order.shippingAddress?.name || "")
            .toLowerCase()
            .includes(q);
        }
        if (matches && dateFilter) {
          matches = (order.createdAt || "").slice(0, 10) === dateFilter;
        }
        if (matches && monthFilter) {
          matches = (order.createdAt || "").slice(0, 7) === monthFilter;
        }
        return matches;
      }),
    [dateFilter, monthFilter, nameFilter, orders]
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      setOrderUpdating(orderId);
      await ordersAPI.updateStatus(orderId, status);
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order", error);
    } finally {
      setOrderUpdating(null);
    }
  };

  // Bulk accept ALL placed orders for the date
  const handleBulkAcceptAll = async () => {
    const targetDate = dateFilter || new Date().toISOString().slice(0, 10);
    const placedCount = filteredOrders.filter((o) => o.status === "PLACED").length;
    if (placedCount === 0) {
      alert("No PLACED orders found for " + targetDate);
      return;
    }
    if (!window.confirm(`Accept all ${placedCount} PLACED orders for ${targetDate}?`)) return;
    try {
      setBulkAccepting(true);
      await ordersAPI.bulkAccept(targetDate);
      await fetchOrders();
      alert(`${placedCount} order(s) accepted successfully!`);
    } catch (error) {
      console.error("Bulk accept failed", error);
      alert("Failed to bulk accept orders.");
    } finally {
      setBulkAccepting(false);
    }
  };

  // Accept only selected orders
  const handleAcceptSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to accept.");
      return;
    }
    if (!window.confirm(`Accept ${selectedOrders.length} selected order(s)?`)) return;
    try {
      setBulkAccepting(true);
      await Promise.all(
        selectedOrders.map((id) => ordersAPI.updateStatus(id, "READY_FOR_DELIVERY"))
      );
      setSelectedOrders([]);
      await fetchOrders();
      alert(`${selectedOrders.length} order(s) accepted!`);
    } catch (error) {
      console.error("Accept selected failed", error);
      alert("Failed to accept selected orders.");
    } finally {
      setBulkAccepting(false);
    }
  };

  const handleBulkPrint = useReactToPrint({
    contentRef: bulkPrintRef,
    documentTitle: `All-Invoices-${activeTab}-${dateFilter || new Date().toISOString().slice(0, 10)}`,
  });

  const getNormalizedPaymentType = (paymentType) => {
    if (paymentType === "cash") return "cash";
    if (paymentType === "due") return "due";
    return "upi";
  };

  const getPaymentLabel = (paymentType) => {
    const normalized = getNormalizedPaymentType(paymentType);
    if (normalized === "cash") return "Cash";
    if (normalized === "due") return "Due";
    return "UPI";
  };

  const handleExportDeliveredExcel = () => {
    if (deliveredExportOrders.length === 0) {
      alert("No delivered orders found for selected filters.");
      return;
    }

    const rows = deliveredExportOrders.map((order) => {
      const shipping = order.shippingAddress || {};
      const total = Number(order.totalAmount || 0);
      const paymentType = getNormalizedPaymentType(order.paymentCollectedAs);
      const cashAmount = paymentType === "cash" ? total : 0;
      const upiAmount = paymentType === "upi" ? total : 0;
      const dueAmount = paymentType === "due" ? total : 0;
      const addressText = [
        shipping.address,
        shipping.addressLine2,
        shipping.landmark,
        shipping.city,
        shipping.state,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        Date: (order.createdAt || "").slice(0, 10),
        Name: shipping.name || order.user?.name || "-",
        Address: addressText || "-",
        MobileNo: shipping.phone || order.user?.phone || order.user?.number || "-",
        UserGroup: order.user?.group || "group1",
        Payment: getPaymentLabel(order.paymentCollectedAs),
        Cash: cashAmount,
        UPI: upiAmount,
        Due: dueAmount,
        Total: total,
        "Total Collected Amt": cashAmount + upiAmount,
        "Due Only": dueAmount,
        Pincode: shipping.pincode || "-",
      };
    });

    const summary = rows.reduce(
      (acc, row) => {
        acc.Cash += Number(row.Cash || 0);
        acc.UPI += Number(row.UPI || 0);
        acc.Due += Number(row.Due || 0);
        acc.Total += Number(row.Total || 0);
        acc["Total Collected Amt"] += Number(row["Total Collected Amt"] || 0);
        acc["Due Only"] += Number(row["Due Only"] || 0);
        return acc;
      },
      { Cash: 0, UPI: 0, Due: 0, Total: 0, "Total Collected Amt": 0, "Due Only": 0 }
    );

    rows.push({
      Date: "",
      Name: "TOTAL",
      Address: "",
      MobileNo: "",
      UserGroup: "",
      Payment: "",
      Cash: summary.Cash,
      UPI: summary.UPI,
      Due: summary.Due,
      Total: summary.Total,
      "Total Collected Amt": summary["Total Collected Amt"],
      "Due Only": summary["Due Only"],
      Pincode: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DeliveredOrders");

    const stamp = dateFilter || monthFilter || new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Delivered-Orders-${stamp}.xlsx`);
  };

  const getPaymentBadgeMeta = (paymentType) => {
    if (paymentType === "cash") {
      return { label: "Cash", background: "#fef3c7", color: "#92400e" };
    }
    if (paymentType === "due") {
      return { label: "Due", background: "#fee2e2", color: "#b91c1c" };
    }
    return { label: "UPI", background: "#dbeafe", color: "#1e40af" };
  };

  // Checkbox helpers
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
          <p className={styles.eyebrow}>Fulfilment</p>
          <h2 className={styles.sectionHeading}>Order management</h2>
          <p className={styles.sectionSubtext}>
            Manage orders by status. Accept new orders, track delivery, and print invoices.
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

      {/* ── Status Tabs ── */}
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
              onChange={(event) => setNameFilter(event.target.value)}
            />
          </div>
          <div className={styles.filterField}>
            <label>Date</label>
            <input
              className={styles.filterInput}
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>
          <div className={styles.filterField}>
            <label>Month</label>
            <input
              className={styles.filterInput}
              type="month"
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          {isPlacedTab && (
            <>
              <button
                className={styles.primaryButton}
                onClick={handleBulkAcceptAll}
                disabled={bulkAccepting}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <FiCheckCircle />
                {bulkAccepting ? "Accepting..." : `Accept All (${filteredOrders.length})`}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={handleAcceptSelected}
                disabled={bulkAccepting || selectedOrders.length === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <FiCheckCircle />
                Accept Selected ({selectedOrders.length})
              </button>
            </>
          )}
          <button
            className={styles.secondaryButton}
            onClick={handleBulkPrint}
            disabled={filteredOrders.length === 0}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FiPrinter /> Print All Invoices ({filteredOrders.length})
          </button>
          {activeTab === "DELIVERED" && (
            <button
              className={styles.primaryButton}
              onClick={handleExportDeliveredExcel}
              disabled={deliveredExportOrders.length === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FiDownload /> Export Delivered Excel ({deliveredExportOrders.length})
            </button>
          )}
        </div>

        {/* Select All checkbox for PLACED tab */}
        {isPlacedTab && filteredOrders.length > 0 && (
          <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
              onChange={toggleSelectAll}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <span style={{ fontWeight: 600, color: "#18392f" }}>
              Select All ({filteredOrders.length})
            </span>
          </div>
        )}

        {loading ? (
          <div className={styles.emptyState}>Order data loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>No orders in "{STATUS_TABS.find((t) => t.key === activeTab)?.label}" tab.</div>
        ) : (
          <div className={styles.orderGrid}>
            {filteredOrders.map((order) => (
              <article key={order._id} className={`${styles.orderCard} ${selectedOrders.includes(order._id) ? styles.orderCardSelected : ""}`}>
                {/* Selection checkbox on PLACED tab */}
                {isPlacedTab && (
                  <div style={{ marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelect(order._id)}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                  </div>
                )}

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
                    onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                    disabled={orderUpdating === order._id}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {order.status === "DELIVERED" && order.paymentCollectedAs && (
                  (() => {
                    const paymentMeta = getPaymentBadgeMeta(order.paymentCollectedAs);
                    return (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 14px",
                          borderRadius: 8,
                          background: paymentMeta.background,
                          color: paymentMeta.color,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          display: "inline-block",
                        }}
                      >
                        Payment Collected: {paymentMeta.label}
                      </div>
                    );
                  })()
                )}

                <div className={styles.orderActions}>
                  {isPlacedTab && (
                    <button
                      className={styles.primaryButton}
                      onClick={() => updateOrderStatus(order._id, "READY_FOR_DELIVERY")}
                      disabled={orderUpdating === order._id}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 8 }}
                    >
                      <FiCheckCircle /> Accept
                    </button>
                  )}
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

      {/* Invoice Modal for single order */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Hidden container for bulk print */}
      <div style={{ display: "none" }}>
        <BulkInvoicePrint ref={bulkPrintRef} orders={filteredOrders} />
      </div>
    </div>
  );
};

export default AdminOrders;