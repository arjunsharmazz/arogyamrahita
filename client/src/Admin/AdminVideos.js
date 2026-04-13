import React, { useEffect, useState } from "react";
import { videoAPI } from "../services/Api";
import styles from "../css/AdminPanel.module.css";

const INITIAL_FORM = {
    title: "",
    youtubeUrl: "",
    description: "",
    sortOrder: 0,
    isActive: true,
};

const AdminVideos = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await videoAPI.listAll();
            const list = data.data || data;
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError("Failed to load videos");
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
                await videoAPI.update(editing._id, payload);
                setSuccess("Video updated successfully");
            } else {
                await videoAPI.create(payload);
                setSuccess("Video posted successfully");
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
            youtubeUrl: item.youtubeUrl || "",
            description: item.description || "",
            sortOrder: item.sortOrder || 0,
            isActive: !!item.isActive,
        });
    };

    const handleDelete = async (id) => {
        try {
            setError("");
            setSuccess("");
            await videoAPI.remove(id);
            setSuccess("Video deleted successfully");
            fetchItems();
        } catch (e) {
            setError("Delete failed");
        }
    };

    return (
        <div className={styles.pageSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <p className={styles.eyebrow}>Video Library</p>
                    <h2 className={styles.sectionHeading}>YouTube videos management</h2>
                    <p className={styles.sectionSubtext}>
                        YouTube URL paste karo aur video public videos page par embed ho jayegi.
                    </p>
                </div>
            </div>

            {error && <div className={styles.emptyState}>{error}</div>}
            {success && <div className={styles.emptyState}>{success}</div>}

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>{editing ? "Edit" : "Post"} video</h3>
                        <p className={styles.cardDescription}>
                            Sirf YouTube URL, title aur optional description required hai.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.quickActions}>
                    <div className={styles.filterField}>
                        <label>Video Title</label>
                        <input className={styles.filterInput} name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className={styles.filterField}>
                        <label>YouTube URL</label>
                        <input className={styles.filterInput} name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." required />
                    </div>
                    <div className={styles.filterField}>
                        <label>Description</label>
                        <textarea className={styles.deliveryLogTextarea} name="description" value={formData.description} onChange={handleChange} placeholder="Optional description" />
                    </div>
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
                        <button className={styles.primaryButton} type="submit">{editing ? "Update" : "Post Video"}</button>
                        {editing ? <button type="button" className={styles.secondaryButton} onClick={resetForm}>Cancel</button> : null}
                    </div>
                </form>
            </div>

            <div className={styles.panelCard}>
                <div className={styles.cardHeaderRow}>
                    <div>
                        <h3 className={styles.cardTitle}>Posted videos</h3>
                        <p className={styles.cardDescription}>
                            Current YouTube videos shown on the public videos page.
                        </p>
                    </div>
                </div>

                {loading ? <p>Loading...</p> : (
                    <div className={styles.listStack}>
                        {items.length === 0 ? (
                            <div className={styles.emptyState}>Abhi koi video post nahi hui hai.</div>
                        ) : items.map((item) => (
                            <div key={item._id} className={styles.listItem}>
                                <div>
                                    <p className={styles.listTitle}>{item.title}</p>
                                    <p className={styles.listMeta}>{item.youtubeUrl}</p>
                                    {item.description ? <p className={styles.listMeta}>{item.description}</p> : null}
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

export default AdminVideos;
