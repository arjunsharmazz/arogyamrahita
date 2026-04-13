import React, { useEffect, useState } from "react";
import { sharePostAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const INITIAL_FORM = {
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
};

const AdminSharePosts = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await sharePostAPI.listAll();
            const list = data.data || data;
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError("Failed to load share posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError("");
            const response = await sharePostAPI.uploadImage(file);
            setFormData((prev) => ({ ...prev, imageUrl: response.imageUrl || "" }));
        } catch (e) {
            setError(e?.response?.data?.message || "Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData(INITIAL_FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setSuccess("");
            const payload = {
                ...formData,
                sortOrder: Number(formData.sortOrder || 0),
            };

            if (editing) {
                await sharePostAPI.update(editing._id, payload);
                setSuccess("Share post updated successfully");
            } else {
                await sharePostAPI.create(payload);
                setSuccess("Share post published successfully");
            }

            resetForm();
            fetchItems();
        } catch (e) {
            setError(e?.response?.data?.message || "Save failed");
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            content: item.content || "",
            imageUrl: item.imageUrl || "",
            sortOrder: item.sortOrder || 0,
            isActive: !!item.isActive,
        });
    };

    const handleDelete = async (id) => {
        try {
            setError("");
            setSuccess("");
            await sharePostAPI.remove(id);
            setSuccess("Share post deleted successfully");
            fetchItems();
        } catch (e) {
            setError("Delete failed");
        }
    };

    return (
        <div className={styles.pageSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <p className={styles.eyebrow}>Share Posts</p>
                    <h2 className={styles.sectionHeading}>Blog and photo posts</h2>
                    <p className={styles.sectionSubtext}>
                        Ek image, title, short description aur full blog-type content ke saath public feed ke liye post publish karo.
                    </p>
                </div>
            </div>

            {error && <div className={styles.emptyState}>{error}</div>}
            {success && <div className={styles.emptyState}>{success}</div>}

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>{editing ? "Edit" : "Publish"} share post</h3>
                        <p className={styles.cardDescription}>
                            Image upload karo, title likho, aur full content add karo jise user click karke read kar sake.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.quickActions}>
                    <div className={styles.filterField}>
                        <label>Post Title</label>
                        <input className={styles.filterInput} name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className={styles.filterField}>
                        <label>Short Description</label>
                        <textarea className={styles.deliveryLogTextarea} name="description" value={formData.description} onChange={handleChange} placeholder="Card preview description" />
                    </div>

                    <div className={styles.filterField}>
                        <label>Full Content</label>
                        <textarea className={styles.deliveryLogTextarea} name="content" value={formData.content} onChange={handleChange} placeholder="Full blog/post content" style={{ minHeight: 180 }} />
                    </div>

                    <div className={styles.filterField}>
                        <label>Upload Image</label>
                        <input className={styles.filterInput} type="file" accept="image/*" onChange={handleImageUpload} />
                        {uploading ? <span className={styles.listMeta}>Uploading image...</span> : null}
                    </div>

                    <div className={styles.filterField}>
                        <label>Image URL</label>
                        <input className={styles.filterInput} name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Uploaded image URL" required />
                    </div>

                    {formData.imageUrl ? (
                        <div className={styles.filterField}>
                            <label>Preview</label>
                            <img src={formData.imageUrl} alt="Preview" className={styles.productImage} style={{ height: 180, borderRadius: 16 }} />
                        </div>
                    ) : null}

                    <div className={styles.filterField}>
                        <label>Sort Order</label>
                        <input className={styles.filterInput} type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
                    </div>

                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button className={styles.primaryButton} type="submit" disabled={uploading}>
                            {editing ? "Update Post" : "Publish Post"}
                        </button>
                        {editing ? <button type="button" className={styles.secondaryButton} onClick={resetForm}>Cancel</button> : null}
                    </div>
                </form>
            </div>

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>Published share posts</h3>
                        <p className={styles.cardDescription}>
                            Ye posts public videos page ke mixed feed me dikhengi.
                        </p>
                    </div>
                </div>

                {loading ? <p>Loading...</p> : (
                    <div className={styles.listStack}>
                        {items.length === 0 ? (
                            <div className={styles.emptyState}>Abhi koi share post publish nahi hui hai.</div>
                        ) : items.map((item) => (
                            <div key={item._id} className={styles.listItem}>
                                <div>
                                    <p className={styles.listTitle}>{item.title}</p>
                                    <p className={styles.listMeta}>{item.description || "No short description"}</p>
                                    {item.content ? <p className={styles.listMeta}>{item.content.slice(0, 120)}...</p> : null}
                                </div>
                                <div className={styles.userMetaGroup}>
                                    <span className={item.isActive ? styles.successBadge : styles.neutralBadge}>
                                        {item.isActive ? "Active" : "Inactive"}
                                    </span>
                                    <span className={styles.groupBadge}>Order {item.sortOrder || 0}</span>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button className={styles.secondaryButton} type="button" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className={styles.dangerButton} type="button" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSharePosts;