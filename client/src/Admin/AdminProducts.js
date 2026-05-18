import React, { useEffect, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import ImagePlaceholder from "../components/ImagePlaceholder";
import ImageUpload from "../components/ImageUpload";
import panelStyles from "../css/AdminPanel.module.css";
import legacyStyles from "../css/AdminDashboard.module.css";
import { productAPI } from "../services/Api";
import { categories } from "./adminUtils";

const initialFormData = {
  name: "",
  description: "",
  image: "",
  oldPrice: "",
  newPrice: "",
  category: "general",
  stock: "",
  isActive: true,
  variants: [],
};

const initialVariantInput = {
  name: "",
  weight: "",
  weightUnit: "kg",
  isKit: false,
  oldPrice: "",
  newPrice: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [variantInput, setVariantInput] = useState(initialVariantInput);
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAdminProducts();
      setProducts(data.products || data || []);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matches = true;
      if (searchName) {
        matches = product.name?.toLowerCase().includes(searchName.toLowerCase());
      }
      if (matches && filterCategory) {
        matches = product.category === filterCategory;
      }
      return matches;
    });
  }, [products, searchName, filterCategory]);

  const metrics = useMemo(() => {
    const active = products.filter((product) => product.isActive).length;
    const withVariants = products.filter(
      (product) => Array.isArray(product.variants) && product.variants.length > 0
    ).length;

    return [
      { label: "Total products", value: products.length },
      { label: "Active listings", value: active },
      { label: "Catalog categories", value: categories.length },
      { label: "Variant products", value: withVariants },
    ];
  }, [products]);

  const resetForm = () => {
    setFormData(initialFormData);
    setVariantInput(initialVariantInput);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setVariantInput((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addVariant = (event) => {
    event.preventDefault();

    if (
      !variantInput.name ||
      (!variantInput.isKit && !variantInput.weight) ||
      variantInput.stock === "" ||
      variantInput.oldPrice === "" ||
      variantInput.newPrice === ""
    ) {
      return;
    }

    setFormData((current) => {
      const duplicateExists = current.variants.some(
        (variant) =>
          variant.name === variantInput.name &&
          variant.isKit === variantInput.isKit &&
          Number(variant.weight) === Number(variantInput.weight) &&
          variant.weightUnit === variantInput.weightUnit
      );

      if (duplicateExists) {
        return current;
      }

      return {
        ...current,
        variants: [
          ...current.variants,
          {
            name: variantInput.name,
            isKit: variantInput.isKit,
            weight: variantInput.isKit ? 0 : Number(variantInput.weight),
            weightUnit: variantInput.isKit ? "" : variantInput.weightUnit,
            oldPrice: Number(variantInput.oldPrice),
            newPrice: Number(variantInput.newPrice),
            stock: Number(variantInput.stock),
          },
        ],
      };
    });

    setVariantInput(initialVariantInput);
  };

  const removeVariant = (index) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.filter((_, currentIndex) => currentIndex !== index),
    }));
    if (editingVariantIndex === index) setEditingVariantIndex(null);
  };

  const startEditVariant = (index) => {
    setEditingVariantIndex(index);
  };

  const saveEditVariant = () => {
    setEditingVariantIndex(null);
  };

  const handleVariantFieldChange = (index, field, value) => {
    setFormData((current) => {
      const updated = [...current.variants];
      updated[index] = { ...updated[index], [field]: ["weight", "oldPrice", "newPrice", "stock"].includes(field) ? Number(value) : value };
      return { ...current, variants: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const submitData = {
        ...formData,
        oldPrice: formData.oldPrice === "" ? 0 : Number(formData.oldPrice),
        newPrice: formData.newPrice === "" ? 0 : Number(formData.newPrice),
        stock: formData.stock === "" ? 0 : Number(formData.stock),
        variants: Array.isArray(formData.variants) ? formData.variants : [],
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, submitData);
      } else {
        await productAPI.createProduct(submitData);
      }

      closeModal();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      oldPrice: product.oldPrice || "",
      newPrice: product.newPrice || "",
      category: product.category || "general",
      stock: product.stock || "",
      isActive: product.isActive !== undefined ? product.isActive : true,
      variants: Array.isArray(product.variants) ? product.variants : [],
    });
    setVariantInput(initialVariantInput);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.deleteProduct(productId);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <div className={panelStyles.pageSection}>
      <div className={panelStyles.sectionHeader}>
        <div>
          <p className={panelStyles.eyebrow}>Catalog</p>
          <h2 className={panelStyles.sectionHeading}>Product management</h2>
          <p className={panelStyles.sectionSubtext}>
            Professional catalog view with separate create, edit, and stock workflows.
          </p>
        </div>
        <button className={panelStyles.primaryButton} onClick={openAddModal}>
          Add product
        </button>
      </div>

      <div className={panelStyles.statGridCompact}>
        {metrics.map((item) => (
          <div key={item.label} className={panelStyles.statCardCompact}>
            <div>
              <p className={panelStyles.statLabel}>{item.label}</p>
              <h3 className={panelStyles.statValueCompact}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className={panelStyles.panelCard}>
        {/* Search & Category Filter */}
        <div className={panelStyles.filterRow}>
          <div className={panelStyles.filterField}>
            <label><FiSearch /> Search by name</label>
            <input
              className={panelStyles.filterInput}
              type="text"
              placeholder="Search product name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className={panelStyles.filterField}>
            <label><FiFilter /> Category</label>
            <select
              className={panelStyles.filterInput}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={panelStyles.emptyState}>Product catalog loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={panelStyles.emptyState}>No products match the current filters.</div>
        ) : (
          <div className={panelStyles.productGrid}>
            {filteredProducts.map((product) => (
              <article key={product._id} className={panelStyles.productCard}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={panelStyles.productImage}
                  />
                ) : (
                  <ImagePlaceholder width="100%" height="220px" text="No Image" />
                )}

                <div className={panelStyles.productBody}>
                  <div className={panelStyles.productHeaderRow}>
                    <h3>{product.name}</h3>
                    <span className={product.isActive ? panelStyles.successBadge : panelStyles.neutralBadge}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className={panelStyles.productDescription}>
                    {product.description?.length > 140
                      ? `${product.description.slice(0, 140)}...`
                      : product.description}
                  </p>

                  {Array.isArray(product.variants) && product.variants.length > 0 ? (
                    <div className={panelStyles.variantInfoBlock}>
                      <p className={panelStyles.listMeta}>Variants: {product.variants.length}</p>
                      <div className={panelStyles.variantChips}>
                        {product.variants.slice(0, 4).map((variant, index) => (
                          <span key={`${product._id}-${index}`} className={panelStyles.variantChip}>
                            {variant.name} {variant.isKit ? "(KIT)" : `${variant.weight}${variant.weightUnit}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={panelStyles.priceRow}>
                      <span className={panelStyles.oldPrice}>₹{product.oldPrice}</span>
                      <span className={panelStyles.newPrice}>₹{product.newPrice}</span>
                    </div>
                  )}

                  <div className={panelStyles.productMeta}>
                    <span>Category: {product.category}</span>
                    <span>Stock: {product.stock || 0}</span>
                  </div>

                  <div className={panelStyles.productActions}>
                    <button className={panelStyles.secondaryButton} onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className={panelStyles.dangerButton} onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className={legacyStyles.modal}>
          <div className={legacyStyles.modalContent}>
            <button className={legacyStyles.closeBtn} onClick={closeModal}>
              ×
            </button>

            <h2 className={legacyStyles.sectionTitle}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className={legacyStyles.form}>
              <div className={legacyStyles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className={legacyStyles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <ImageUpload
                onImageUpload={(imageUrl) =>
                  setFormData((current) => ({ ...current, image: imageUrl }))
                }
                currentImageUrl={formData.image}
              />

              <div className={legacyStyles.formGroup}>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className={legacyStyles.priceGroup}>
                <div className={legacyStyles.formGroup}>
                  <label>Old Price</label>
                  <input
                    type="number"
                    name="oldPrice"
                    min="0"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={legacyStyles.formGroup}>
                  <label>New Price</label>
                  <input
                    type="number"
                    name="newPrice"
                    min="0"
                    step="0.01"
                    value={formData.newPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={legacyStyles.formGroup}>
                <label>Status</label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>{formData.isActive ? "Active" : "Inactive"}</span>
                </label>
              </div>

              <div className={legacyStyles.formGroup}>
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>

              <div className={legacyStyles.formGroup}>
                <label>Add Product Variant</label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    name="name"
                    value={variantInput.name}
                    onChange={handleVariantInputChange}
                    placeholder="Variant"
                    style={{ width: "120px" }}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem" }}>
                    <input
                      type="checkbox"
                      name="isKit"
                      checked={variantInput.isKit}
                      onChange={handleVariantInputChange}
                    />
                    KIT
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={variantInput.weight}
                    onChange={handleVariantInputChange}
                    placeholder="Weight"
                    min="0"
                    step="0.01"
                    style={{ width: "100px" }}
                    disabled={variantInput.isKit}
                  />
                  <select
                    name="weightUnit"
                    value={variantInput.weightUnit}
                    onChange={handleVariantInputChange}
                    style={{ width: "100px" }}
                    disabled={variantInput.isKit}
                  >
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                    <option value="ltr">ltr</option>
                    <option value="ml">ml</option>
                  </select>
                  <input
                    type="number"
                    name="oldPrice"
                    value={variantInput.oldPrice}
                    onChange={handleVariantInputChange}
                    placeholder="Old Price"
                    min="0"
                    step="0.01"
                    style={{ width: "100px" }}
                  />
                  <input
                    type="number"
                    name="newPrice"
                    value={variantInput.newPrice}
                    onChange={handleVariantInputChange}
                    placeholder="New Price"
                    min="0"
                    step="0.01"
                    style={{ width: "100px" }}
                  />
                  <input
                    type="number"
                    name="stock"
                    value={variantInput.stock}
                    onChange={handleVariantInputChange}
                    placeholder="Stock"
                    min="0"
                    style={{ width: "100px" }}
                  />
                  <button onClick={addVariant} style={{ padding: "0.2rem 0.8rem", borderRadius: "10px" }}>
                    Add
                  </button>
                </div>

                {formData.variants.length > 0 && (
                  <div className={legacyStyles.variantTableWrapper}>
                    <table className={legacyStyles.variantTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Weight</th>
                          <th>Unit</th>
                          <th>Old Price (₹)</th>
                          <th>New Price (₹)</th>
                          <th>Stock</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.variants.map((variant, index) => (
                          <tr key={`${variant.name}-${index}`}>
                            {editingVariantIndex === index ? (
                              <>
                                <td>
                                  <input type="text" value={variant.name} onChange={(e) => handleVariantFieldChange(index, "name", e.target.value)} style={{ width: "90px" }} />
                                </td>
                                <td>
                                  <input type="checkbox" checked={variant.isKit} onChange={(e) => handleVariantFieldChange(index, "isKit", e.target.checked)} /> Kit
                                </td>
                                <td>
                                  <input type="number" value={variant.weight} onChange={(e) => handleVariantFieldChange(index, "weight", e.target.value)} min="0" step="0.01" style={{ width: "70px" }} disabled={variant.isKit} />
                                </td>
                                <td>
                                  <select value={variant.weightUnit} onChange={(e) => handleVariantFieldChange(index, "weightUnit", e.target.value)} style={{ width: "70px" }} disabled={variant.isKit}>
                                    <option value="kg">kg</option>
                                    <option value="gm">gm</option>
                                    <option value="ltr">ltr</option>
                                    <option value="ml">ml</option>
                                  </select>
                                </td>
                                <td>
                                  <input type="number" value={variant.oldPrice} onChange={(e) => handleVariantFieldChange(index, "oldPrice", e.target.value)} min="0" step="0.01" style={{ width: "80px" }} />
                                </td>
                                <td>
                                  <input type="number" value={variant.newPrice} onChange={(e) => handleVariantFieldChange(index, "newPrice", e.target.value)} min="0" step="0.01" style={{ width: "80px" }} />
                                </td>
                                <td>
                                  <input type="number" value={variant.stock} onChange={(e) => handleVariantFieldChange(index, "stock", e.target.value)} min="0" style={{ width: "70px" }} />
                                </td>
                                <td>
                                  <button type="button" onClick={saveEditVariant} style={{ marginRight: "4px", padding: "0.2rem 0.6rem", borderRadius: "8px", background: "#1e5b49", color: "#fff", border: "none", cursor: "pointer" }}>Save</button>
                                  <button type="button" onClick={() => removeVariant(index)} className={legacyStyles.variantRemoveBtn}>Remove</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{variant.name}</td>
                                <td>{variant.isKit ? "KIT" : variant.weight}</td>
                                <td>{variant.isKit ? "" : variant.weightUnit}</td>
                                <td>{variant.oldPrice}</td>
                                <td>{variant.newPrice}</td>
                                <td>{variant.stock}</td>
                                <td>
                                  <button type="button" onClick={() => startEditVariant(index)} style={{ marginRight: "4px", padding: "0.2rem 0.6rem", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}>Edit</button>
                                  <button type="button" onClick={() => removeVariant(index)} className={legacyStyles.variantRemoveBtn}>Remove</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button type="submit" className={legacyStyles.submitBtn} disabled={saving}>
                {saving ? "Processing..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;