import React, { useEffect, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import styles from "../css/AdminPanel.module.css";
import { discountHeroAPI } from "../services/Api";

const DiscountHeroAdmin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ image: "", productName: "", discountValue: 0, isActive: true });

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await discountHeroAPI.listAll();
            const list = data.data || data;
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError("Failed to load discount hero items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const onImageUpload = (url) => setFormData(prev => ({ ...prev, image: url }));
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const resetForm = () => { setEditing(null); setFormData({ image: "", productName: "", discountValue: 0, isActive: true }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(""); setSuccess("");
            if (editing) {
                await discountHeroAPI.update(editing._id, formData);
                setSuccess("Discount hero updated");
            } else {
                await discountHeroAPI.create(formData);
                setSuccess("Discount hero created");
            }
            resetForm();
            fetchItems();
        } catch (e) {
            setError(e?.response?.data?.message || "Save failed");
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ image: item.image || "", productName: item.productName || "", discountValue: item.discountValue || 0, isActive: !!item.isActive });
    };

    const handleDelete = async (id) => {
        try {
            await discountHeroAPI.remove(id);
            fetchItems();
        } catch (e) { setError("Delete failed"); }
    };

    return (
        <div className={styles.pageSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <p className={styles.eyebrow}>Campaigns</p>
                    <h2 className={styles.sectionHeading}>Discount hero management</h2>
                    <p className={styles.sectionSubtext}>
                        Manage homepage promotional banners with a cleaner editorial workflow.
                    </p>
                </div>
            </div>

            {error && <div className={styles.emptyState}>{error}</div>}
            {success && <div className={styles.emptyState}>{success}</div>}

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>{editing ? "Edit" : "Create"} discount hero item</h3>
                        <p className={styles.cardDescription}>
                            Image, title, and discount percentage can be controlled from here.
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className={styles.quickActions}>
                    <ImageUpload
                        onImageUpload={onImageUpload}
                        currentImageUrl={formData.image}
                        label="Discount Image"
                        uploadPath={"https://arogyamrahita.onrender.com/api/discount-hero/upload-image"}
                    />
                    <div>
                        <label>Product Name</label>
                        <input className={styles.filterInput} name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Discount Value (%)</label>
                        <input className={styles.filterInput} type="number" min="0" max="100" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
                        </label>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button className={styles.primaryButton} type="submit">{editing ? "Update" : "Create"}</button>
                        {editing && <button type="button" className={styles.secondaryButton} onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>Existing items</h3>
                        <p className={styles.cardDescription}>
                            Active and archived discount blocks currently stored in the system.
                        </p>
                    </div>
                </div>
                {loading ? (<p>Loading...</p>) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "12px 10px" }}>Image</th>
                                    <th style={{ textAlign: "left", padding: "12px 10px" }}>Product</th>
                                    <th style={{ textAlign: "left", padding: "12px 10px" }}>Discount</th>
                                    <th style={{ textAlign: "left", padding: "12px 10px" }}>Active</th>
                                    <th style={{ textAlign: "left", padding: "12px 10px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id}>
                                        <td style={{ padding: "12px 10px" }}>{item.image ? <img src={item.image} alt={item.productName} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} /> : "-"}</td>
                                        <td style={{ padding: "12px 10px" }}>{item.productName}</td>
                                        <td style={{ padding: "12px 10px" }}>{item.discountValue}%</td>
                                        <td style={{ padding: "12px 10px" }}>{item.isActive ? "Yes" : "No"}</td>
                                        <td style={{ padding: "12px 10px", display: "flex", gap: 8 }}>
                                            <button className={styles.secondaryButton} onClick={() => handleEdit(item)}>Edit</button>
                                            <button className={styles.dangerButton} onClick={() => handleDelete(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountHeroAdmin;


