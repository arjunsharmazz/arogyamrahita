import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logoImage from "../images/arogyamlogo.png";
import styles from "../css/InvoiceModal.module.css";

export const InvoiceContent = React.forwardRef(({ order }, ref) => {
  const shippingAddress = order.shippingAddress || {};
  const fullAddress = [
    shippingAddress.address,
    shippingAddress.addressLine2,
    shippingAddress.landmark,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const formatPhone = (phone) => {
    if (phone && /^\d{10}$/.test(phone)) return `+91-${phone}`;
    return phone || "N/A";
  };

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div ref={ref} className={styles.invoicePage}>
      {/* Header */}
      <div className={styles.invoiceHeader}>
        <div className={styles.brandSection}>
          <img src={logoImage} alt="Arogyam Rahita" className={styles.logo} />
          <div>
            <h1 className={styles.brandName}>Arogyam Rahita</h1>
            <p className={styles.brandTagline}>Pure & Natural Wellness</p>
          </div>
        </div>
        <div className={styles.invoiceMeta}>
          <h2 className={styles.invoiceTitle}>INVOICE</h2>
          <div className={styles.metaRow}>
            <span>Invoice #</span>
            <strong>INV-{order.invoiceNumber || "---"}</strong>
          </div>
          <div className={styles.metaRow}>
            <span>Date</span>
            <strong>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "---"}
            </strong>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Customer Address */}
      <div className={styles.addressGrid}>
        <div className={styles.addressBlock}>
          <h3 className={styles.addressLabel}>Ship To</h3>
          <p className={styles.addressName}>
            {shippingAddress.name || order.user?.name || "Customer"}
          </p>
          <p>{fullAddress || "N/A"}</p>
          <p>Phone: {formatPhone(shippingAddress.phone)}</p>
        </div>
      </div>

      {/* Items Table — no images */}
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th className={styles.thSno}>#</th>
            <th className={styles.thItem}>Item</th>
            <th className={styles.thQty}>Qty</th>
            <th className={styles.thPrice}>Unit Price</th>
            <th className={styles.thAmount}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, idx) => (
            <tr key={idx}>
              <td className={styles.tdCenter}>{idx + 1}</td>
              <td>
                <span className={styles.itemName}>{item.name}</span>
                {item.variant?.weight && item.variant?.weightUnit && (
                  <span className={styles.itemVariant}>
                    {" "}({item.variant.weight} {item.variant.weightUnit})
                  </span>
                )}
              </td>
              <td className={styles.tdCenter}>{item.quantity}</td>
              <td className={styles.tdRight}>₹{item.price}</td>
              <td className={styles.tdRight}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className={styles.totalsSection}>
        <div className={styles.totalsBox}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>₹{(order.totalAmount || subtotal).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.invoiceFooter}>
        <div className={styles.footerLeft}>
          <p className={styles.thankYou}>Thank you for your order!</p>
          <p className={styles.footerNote}>
            For any queries, contact us at contact@arogyamrahita.com
          </p>
        </div>
        <div className={styles.footerRight}>
          <p>Authorized Signature</p>
          <div className={styles.signatureLine} />
          <p className={styles.companyStamp}>Arogyam Rahita</p>
        </div>
      </div>
    </div>
  );
});

InvoiceContent.displayName = "InvoiceContent";

const InvoiceModal = ({ order, onClose }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${order.user?.name || "Customer"}-${
      order.invoiceNumber || order._id
    }`,
  });

  if (!order) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalActions}>
          <button className={styles.printBtn} onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.invoiceScroll}>
          <InvoiceContent ref={printRef} order={order} />
        </div>
      </div>
    </div>
  );
};

// For bulk printing multiple orders
export const BulkInvoicePrint = React.forwardRef(({ orders }, ref) => {
  return (
    <div ref={ref}>
      {(orders || []).map((order, idx) => (
        <div key={order._id} style={{ pageBreakAfter: idx < orders.length - 1 ? "always" : "auto" }}>
          <InvoiceContent order={order} />
        </div>
      ))}
    </div>
  );
});

BulkInvoicePrint.displayName = "BulkInvoicePrint";

export default InvoiceModal;
