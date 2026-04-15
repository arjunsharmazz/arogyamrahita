import React, { useEffect, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import styles from "../css/AdminPanel.module.css";
import { homeBannerAPI } from "../services/Api";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const HOME_BANNER_UPLOAD_URL = `${API_BASE_URL}/home-banners/upload-image`;

const initialForm = {
  image: "",
  title: "",
  subtitle: "",
  sortOrder: 0,
  isActive: true,
};

const AdminHomeBanner = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await homeBannerAPI.listAll();
      const list = data.data || data;
      setItems(Array.isArray(list) ? list : []);
    } catch (fetchError) {
      setError("Failed to load home banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onImageUpload = (url) => setFormData((prev) => ({ ...prev, image: url }));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setSuccess("");

      if (editing) {
        await homeBannerAPI.update(editing._id, formData);
        setSuccess("Home banner updated");
      } else {
        await homeBannerAPI.create(formData);
        setSuccess("Home banner created");
      }

      resetForm();
      fetchItems();
    } catch (saveError) {
      setError(saveError?.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      image: item.image || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      sortOrder: item.sortOrder || 0,
      isActive: !!item.isActive,
    });
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      setSuccess("");
      await homeBannerAPI.remove(id);
      setSuccess("Home banner deleted");
      fetchItems();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className={styles.pageSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Homepage</p>
          <h2 className={styles.sectionHeading}>Home banner management</h2>
          <p className={styles.sectionSubtext}>
            Home page ke top slider ko yahin se upload, reorder, aur activate karo.
          </p>
        </div>
      </div>

      {error && <div className={styles.emptyState}>{error}</div>}
      {success && <div className={styles.emptyState}>{success}</div>}

      <div className={styles.panelCard}>
        <div className={styles.cardHeaderRow}>
          <div>
            <h3 className={styles.cardTitle}>{editing ? "Edit" : "Create"} home banner</h3>
            <p className={styles.cardDescription}>
              Image required hai. Title aur subtitle optional hain agar baad me overlay dikhana ho.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.quickActions}>
          <ImageUpload
            onImageUpload={onImageUpload}
            currentImageUrl={formData.image}
            label="Banner Image"
            uploadPath={HOME_BANNER_UPLOAD_URL}
          />

          <div>
            <label>Title</label>
            <input
              className={styles.filterInput}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Optional heading"
            />
          </div>

          <div>
            <label>Subtitle</label>
            <input
              className={styles.filterInput}
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Optional supporting line"
            />
          </div>

          <div>
            <label>Sort Order</label>
            <input
              className={styles.filterInput}
              type="number"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className={styles.primaryButton} type="submit">
              {editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button type="button" className={styles.secondaryButton} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.panelCard}>
        <div className={styles.cardHeaderRow}>
          <div>
            <h3 className={styles.cardTitle}>Existing banners</h3>
            <p className={styles.cardDescription}>
              Jo slides active hongi wahi homepage ke top slider me dikhengi.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Image</th>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Subtitle</th>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Order</th>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Active</th>
                  <th style={{ textAlign: "left", padding: "12px 10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "12px 10px" }}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title || "Home banner"}
                          style={{ width: 72, height: 48, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ padding: "12px 10px" }}>{item.title || "-"}</td>
                    <td style={{ padding: "12px 10px" }}>{item.subtitle || "-"}</td>
                    <td style={{ padding: "12px 10px" }}>{item.sortOrder || 0}</td>
                    <td style={{ padding: "12px 10px" }}>{item.isActive ? "Yes" : "No"}</td>
                    <td style={{ padding: "12px 10px", display: "flex", gap: 8 }}>
                      <button className={styles.secondaryButton} onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className={styles.dangerButton} onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
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

export default AdminHomeBanner;