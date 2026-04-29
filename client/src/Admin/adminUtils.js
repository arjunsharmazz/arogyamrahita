import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const categories = [
  "general",
  "health",
  "wellness",
  "supplements",
  "herbs",
  "other",
  "oils",
  "seeds",
  "aata",
  "pickle",
  "dal",
  "dry fruits",
  "millets",
  "sabut masala",
  "masala",
  "Special Churan",
  "rice",
  "daliya",
  "vegetables",
  "vinegar",
  "aamla",
  "tea",
  "fast(varat)",
  "clusters",
  "vegetables"
];

export const orderStatuses = [
  "PLACED",
  "READY_FOR_DELIVERY",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const formatOrderDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPhoneNumber = (phone) => {
  if (phone && /^\d{10}$/.test(phone)) {
    return `+91-${phone}`;
  }

  return phone || "N/A";
};

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Arogyam Rahita", 20, 20);
  doc.setFontSize(11);
  doc.text("Sanik Vihar, Meerut", 20, 28);
  doc.text("Phone: (000) 000-0000", 20, 34);

  doc.text(`Invoice: INV-${order.invoiceNumber}`, 150, 40);
  doc.text(`Date: ${order.createdAt ? order.createdAt.slice(0, 10) : "_____"}`, 150, 46);
  doc.text(`Customer ID: ${order.user?._id || "_____"}`, 20, 46);
  doc.text("Terms: Net 30 Days", 150, 52);

  doc.setFontSize(12);
  doc.text("Bill To:", 20, 60);
  doc.setFontSize(11);
  doc.text(order.user?.name || "_________", 20, 66);
  doc.text(order.user?.email || "_________", 20, 72);
  doc.text(order.user?.address || "_________", 20, 78);

  doc.setFontSize(12);
  doc.text("Ship To:", 100, 60);
  doc.setFontSize(11);
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

  doc.text(`Name: ${shippingAddress.name || order.user?.name || "N/A"}`, 100, 66);
  doc.text(`Email: ${order.user?.email || "N/A"}`, 100, 72);
  doc.text(`Phone: ${formatPhoneNumber(shippingAddress.phone)}`, 100, 78);
  doc.text(`Address: ${fullAddress || "N/A"}`, 100, 84, { maxWidth: 100 });

  const items = (order.items || []).map((item) => [
    item.variant && item.variant.weight && item.variant.weightUnit
      ? `${item.name} (${item.variant.weight} ${item.variant.weightUnit})`
      : item.name,
    item.quantity,
    String(item.price),
    String(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: doc.getTextDimensions(fullAddress, { maxWidth: 100 }).h + 90,
    head: [["Description", "Qty", "Unit Price", "Amount"]],
    body: items,
    styles: { fontSize: 11 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`TOTAL: ${order.totalAmount || 0}`, 150, finalY);
  doc.setFontSize(10);
  doc.text("Thank you for your business!", 20, finalY + 20);
  doc.text("If you have any questions about this invoice, please contact:", 20, finalY + 28);
  doc.text("Arogyam Rahita | Phone: (000) 000-0000 | email@domain.com", 20, finalY + 34);

  const userName = (order.user?.name || "user").replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `Invoice-${userName}-${order.invoiceNumber || order._id}.pdf`;
  doc.setProperties({ title: fileName });
  doc.output("dataurlnewwindow", { filename: fileName });
};