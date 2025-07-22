import React, { useState, useEffect } from "react";

const MENU = [
  { key: "products", label: "Sản phẩm", icon: "📦" },
  { key: "orders", label: "Đơn hàng", icon: "🧾" },
  { key: "users", label: "Người dùng", icon: "👤" },
];

const FIELD_MAP = {
  products: ["name", "price", "category", "rating", "totalQuantity", "createdAt"],
  orders: ["_id", "customerId", "items", "status", "createdAt"],
  users: ["email", "name", "role", "country", "createdAt"],
};

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  description: "",
  tags: [],
  rating: 0,
  feedback: "",
  specs: [],
};

function getTotalQuantity(specs) {
  return Array.isArray(specs)
    ? specs.reduce((sum, s) => sum + (s.quantity || 0), 0)
    : 0;
}

function AdminDashboard({ user }) {
  const [activeMenu, setActiveMenu] = useState("products");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // CRUD state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(emptyProduct);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  // Tags input state
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeMenu]);

  function fetchData() {
    let url = "";
    if (activeMenu === "products") url = "/api/products";
    if (activeMenu === "orders") url = "/api/admin/orders";
    if (activeMenu === "users") url = "/api/admin/users";
    if (!url) return;
    setLoading(true);
    setError("");
    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : d[activeMenu] || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi tải dữ liệu");
        setLoading(false);
      });
  }

  // CRUD handlers
  function openAddForm() {
    setFormMode("add");
    // Reset form về emptyProduct, đảm bảo đủ trường
    setFormData({ ...emptyProduct });
    setFormError("");
    setFormSuccess("");
    setTagInput("");
    setShowForm(true);
  }
  function openEditForm(product) {
    setFormMode("edit");
    // Merge emptyProduct với dữ liệu cũ để không thiếu trường nào
    setFormData({
      ...emptyProduct,
      ...product,
      tags: Array.isArray(product.tags) ? product.tags : (product.tags ? product.tags.split(",") : []),
      specs: product.specs ? JSON.parse(JSON.stringify(product.specs)) : [],
    });
    setFormError("");
    setFormSuccess("");
    setTagInput("");
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setFormError("");
    setFormSuccess("");
  }
  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }
  // Tags CRUD
  function handleTagInput(e) {
    setTagInput(e.target.value);
  }
  function handleTagKeyDown(e) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  }
  function removeTag(idx) {
    const tags = [...formData.tags];
    tags.splice(idx, 1);
    setFormData({ ...formData, tags });
  }
  // --- Specs CRUD giữ nguyên ---
  function addSpec() {
    setFormData({
      ...formData,
      specs: [
        ...formData.specs,
        { colorId: "", title: "", quantity: 0, sizes: [], imgList: [] },
      ],
    });
  }
  function updateSpec(idx, field, value) {
    const specs = [...formData.specs];
    specs[idx][field] = value;
    setFormData({ ...formData, specs });
  }
  function removeSpec(idx) {
    const specs = [...formData.specs];
    specs.splice(idx, 1);
    setFormData({ ...formData, specs });
  }
  function addSize(idx) {
    const specs = [...formData.specs];
    specs[idx].sizes = specs[idx].sizes || [];
    specs[idx].sizes.push("");
    setFormData({ ...formData, specs });
  }
  function updateSize(idx, sidx, value) {
    const specs = [...formData.specs];
    specs[idx].sizes[sidx] = value;
    setFormData({ ...formData, specs });
  }
  function removeSize(idx, sidx) {
    const specs = [...formData.specs];
    specs[idx].sizes.splice(sidx, 1);
    setFormData({ ...formData, specs });
  }
  function addImg(idx) {
    const specs = [...formData.specs];
    specs[idx].imgList = specs[idx].imgList || [];
    specs[idx].imgList.push("");
    setFormData({ ...formData, specs });
  }
  function updateImg(idx, iidx, value) {
    const specs = [...formData.specs];
    specs[idx].imgList[iidx] = value;
    setFormData({ ...formData, specs });
  }
  function removeImg(idx, iidx) {
    const specs = [...formData.specs];
    specs[idx].imgList.splice(iidx, 1);
    setFormData({ ...formData, specs });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    // Validate
    if (!formData.name || !formData.price || !formData.category) {
      setFormError("Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }
    for (const spec of formData.specs) {
      if (!spec.colorId || !spec.title || spec.quantity < 0) {
        setFormError("Vui lòng nhập đầy đủ thông tin cho từng màu!");
        return;
      }
      if (spec.sizes.some((s) => !s)) {
        setFormError("Không được để trống size!");
        return;
      }
      if (spec.imgList.some((img) => !img)) {
        setFormError("Không được để trống link ảnh!");
        return;
      }
    }
    const payload = { ...formData };
    payload.price = Number(payload.price);
    payload.rating = Number(payload.rating);
    payload.specs = payload.specs.map((s) => ({
      ...s,
      quantity: Number(s.quantity),
    }));
    if (formMode === "add") {
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.product) {
            setFormSuccess("Thêm sản phẩm thành công!");
            setTimeout(() => {
              setShowForm(false);
              fetchData();
            }, 1000);
          } else {
            setFormError(d.message || "Lỗi thêm sản phẩm");
          }
        })
        .catch(() => setFormError("Lỗi kết nối server"));
    } else if (formMode === "edit") {
      fetch(`/api/products/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.product) {
            setFormSuccess("Cập nhật sản phẩm thành công!");
            setTimeout(() => {
              setShowForm(false);
              fetchData();
            }, 1000);
          } else {
            setFormError(d.message || "Lỗi cập nhật sản phẩm");
          }
        })
        .catch(() => setFormError("Lỗi kết nối server"));
    }
  }
  function handleDeleteProduct(id) {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.message && d.message.includes("thành công")) {
          setFormSuccess("Đã xoá sản phẩm!");
          setTimeout(() => {
            setFormSuccess("");
            fetchData();
          }, 1000);
        } else {
          alert(d.message || "Lỗi xoá sản phẩm");
        }
      })
      .catch(() => alert("Lỗi kết nối server"));
  }

  function handleDeleteUser(id) {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.message && d.message.includes("thành công")) {
          setFormSuccess("Đã xoá người dùng!");
          setTimeout(() => {
            setFormSuccess("");
            fetchData();
          }, 1000);
        } else {
          alert(d.message || "Lỗi xoá người dùng");
        }
      })
      .catch(() => alert("Lỗi kết nối server"));
  }

  const fields = FIELD_MAP[activeMenu] || (data[0] ? Object.keys(data[0]) : []);

  return (
    <div style={{ display: "flex", minHeight: "90vh", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: "#1976d2", color: "#fff", padding: 24, borderTopLeftRadius: 16, borderBottomLeftRadius: 16, boxShadow: "2px 0 12px rgba(25,118,210,0.07)" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 36, letterSpacing: 1 }}>Admin Panel</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {MENU.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveMenu(item.key)}
                style={{
                  width: "100%",
                  background: activeMenu === item.key ? "#fff" : "transparent",
                  color: activeMenu === item.key ? "#1976d2" : "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 0 12px 12px",
                  marginBottom: 10,
                  fontWeight: 600,
                  fontSize: 17,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: activeMenu === item.key ? "0 2px 8px rgba(25,118,210,0.10)" : "none",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span> {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, background: "#fff", borderTopRightRadius: 16, borderBottomRightRadius: 16, margin: 18, padding: 36, minHeight: 600, boxShadow: "0 2px 16px rgba(25,118,210,0.07)" }}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 4 }}>{MENU.find((m) => m.key === activeMenu)?.label}</h2>
            <div style={{ color: "#1976d2", fontWeight: 500, fontSize: 15 }}>
              {activeMenu === "products" && "Xem, tìm kiếm và quản lý sản phẩm trong hệ thống."}
              {activeMenu === "orders" && "Quản lý tất cả đơn hàng của khách hàng."}
              {activeMenu === "users" && "Quản lý tài khoản người dùng và admin."}
            </div>
          </div>
          {activeMenu === "products" && (
            <button onClick={openAddForm} style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(25,118,210,0.10)" }}>
              + Thêm sản phẩm
            </button>
          )}
        </div>
        {loading && (
          <div style={{ textAlign: "center", margin: 40 }}>
            <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48 }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ marginTop: 12, color: "#1976d2" }}>Đang tải dữ liệu...</div>
          </div>
        )}
        {error && <div style={{ color: "#d32f2f", fontWeight: 600, margin: 24, textAlign: "center" }}>{error}</div>}
        {!loading && !error && (
          <div style={{ overflowX: "auto", borderRadius: 10, boxShadow: "0 1px 8px rgba(25,118,210,0.04)", background: "#fafbfc" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  {fields.map((k) => (
                    <th key={k} style={{ borderBottom: "2px solid #1976d2", padding: 10, textAlign: "left", background: "#e3f0ff", fontWeight: 700, fontSize: 15 }}>
                      {k === "totalQuantity" ? "Tổng số lượng tồn kho" : k}
                    </th>
                  ))}
                  {(activeMenu === "products" || activeMenu === "users") && <th style={{ background: "#e3f0ff" }}>Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row._id || idx} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    {fields.map((k, i) => (
                      <td key={i} style={{ padding: 9, fontSize: 15, maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {k === "totalQuantity"
                          ? getTotalQuantity(row.specs)
                          : (typeof row[k] === "object" && row[k] !== null
                              ? JSON.stringify(row[k])
                              : String(row[k] ?? ""))}
                      </td>
                    ))}
                    {activeMenu === "products" && (
                      <td style={{ padding: 9 }}>
                        <button onClick={() => openEditForm(row)} style={{ background: "#fffbe6", color: "#1976d2", border: "1px solid #ffe082", borderRadius: 6, padding: "4px 12px", fontWeight: 500, marginRight: 8, cursor: "pointer" }}>Sửa</button>
                        <button onClick={() => handleDeleteProduct(row._id)} style={{ background: "#fff0f0", color: "#d32f2f", border: "1px solid #ffcdd2", borderRadius: 6, padding: "4px 12px", fontWeight: 500, cursor: "pointer" }}>Xoá</button>
                      </td>
                    )}
                    {activeMenu === "users" && (
                      <td style={{ padding: 9 }}>
                        <button onClick={() => handleDeleteUser(row._id)} style={{ background: "#fff0f0", color: "#d32f2f", border: "1px solid #ffcdd2", borderRadius: 6, padding: "4px 12px", fontWeight: 500, cursor: "pointer" }}>Xoá</button>
                      </td>
                    )}
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan={fields.length + (activeMenu === "products" || activeMenu === "users" ? 1 : 0)} style={{ textAlign: "center", color: "#888", padding: 32, fontSize: 16 }}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {formSuccess && (
          <div style={{ background: "#e3fcec", color: "#388e3c", border: "1px solid #b2dfdb", borderRadius: 7, padding: 12, marginBottom: 18, textAlign: "center", fontWeight: 600 }}>{formSuccess}</div>
        )}
        {/* Form thêm/sửa sản phẩm nâng cao */}
        {showForm && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <form onSubmit={handleFormSubmit} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 32px rgba(25,118,210,0.13)", padding: 32, minWidth: 340, maxWidth: 520, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>{formMode === "add" ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleFormChange} style={{ padding: 10, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15 }} />
                <input name="price" placeholder="Giá" value={formData.price} onChange={handleFormChange} type="number" min="0" style={{ padding: 10, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15 }} />
                <input name="category" placeholder="Danh mục" value={formData.category} onChange={handleFormChange} style={{ padding: 10, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15 }} />
                <input name="rating" placeholder="Đánh giá (0-5)" value={formData.rating} onChange={handleFormChange} type="number" min="0" max="5" step="0.1" style={{ padding: 8, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15, width: 120 }} />
                <textarea name="description" placeholder="Mô tả sản phẩm" value={formData.description} onChange={handleFormChange} rows={3} style={{ padding: 10, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15, resize: "vertical" }} />
                {/* Tags input */}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>Tags:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} style={{ background: "#e3f0ff", color: "#1976d2", borderRadius: 6, padding: "4px 10px", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} style={{ background: "none", border: "none", color: "#1976d2", fontWeight: 700, marginLeft: 2, cursor: "pointer" }}>×</button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={handleTagInput}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Nhập tag và Enter"
                      style={{ padding: 7, borderRadius: 6, border: "1px solid #bdbdbd", fontSize: 15, minWidth: 90 }}
                    />
                  </div>
                </div>
                {/* Feedback */}
                <textarea name="feedback" placeholder="Feedback (ý kiến, nhận xét nội bộ)" value={formData.feedback} onChange={handleFormChange} rows={2} style={{ padding: 10, borderRadius: 7, border: "1px solid #bdbdbd", fontSize: 15, resize: "vertical" }} />
                {/* Specs CRUD UI giữ nguyên, chỉ thêm preview ảnh */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Màu sắc & chi tiết</div>
                  {formData.specs.map((spec, idx) => (
                    <div key={idx} style={{ background: "#f5f7fa", borderRadius: 8, padding: 14, marginBottom: 10, border: "1px solid #e0e0e0" }}>
                      <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                        <input placeholder="Mã màu (colorId)" value={spec.colorId} onChange={e => updateSpec(idx, "colorId", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bdbdbd" }} />
                        <input placeholder="Tên màu (title)" value={spec.title} onChange={e => updateSpec(idx, "title", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bdbdbd" }} />
                        <input placeholder="Số lượng" type="number" min="0" value={spec.quantity} onChange={e => updateSpec(idx, "quantity", e.target.value)} style={{ width: 100, padding: 8, borderRadius: 6, border: "1px solid #bdbdbd" }} />
                        <button type="button" onClick={() => removeSpec(idx)} style={{ background: "#fff0f0", color: "#d32f2f", border: "1px solid #ffcdd2", borderRadius: 6, padding: "4px 10px", fontWeight: 500, cursor: "pointer", marginLeft: 4 }}>Xoá màu</button>
                      </div>
                      {/* Sizes */}
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>Size:</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {spec.sizes && spec.sizes.map((size, sidx) => (
                            <span key={sidx} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <input value={size} onChange={e => updateSize(idx, sidx, e.target.value)} style={{ width: 54, padding: 5, borderRadius: 5, border: "1px solid #bdbdbd" }} />
                              <button type="button" onClick={() => removeSize(idx, sidx)} style={{ background: "#eee", color: "#222", border: "none", borderRadius: 5, padding: "2px 7px", marginLeft: 2, cursor: "pointer" }}>x</button>
                            </span>
                          ))}
                          <button type="button" onClick={() => addSize(idx)} style={{ background: "#e3f0ff", color: "#1976d2", border: "1px solid #90caf9", borderRadius: 5, padding: "2px 10px", fontWeight: 500, cursor: "pointer" }}>+ Size</button>
                        </div>
                      </div>
                      {/* ImgList + preview */}
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>Ảnh:</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {spec.imgList && spec.imgList.map((img, iidx) => (
                            <span key={iidx} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <input value={img} onChange={e => updateImg(idx, iidx, e.target.value)} style={{ width: 180, padding: 5, borderRadius: 5, border: "1px solid #bdbdbd" }} placeholder="Link ảnh" />
                              {img && <img src={img} alt="preview" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 4, border: "1px solid #eee", marginLeft: 4 }} />}
                              <button type="button" onClick={() => removeImg(idx, iidx)} style={{ background: "#eee", color: "#222", border: "none", borderRadius: 5, padding: "2px 7px", marginLeft: 2, cursor: "pointer" }}>x</button>
                            </span>
                          ))}
                          <button type="button" onClick={() => addImg(idx)} style={{ background: "#e3f0ff", color: "#1976d2", border: "1px solid #90caf9", borderRadius: 5, padding: "2px 10px", fontWeight: 500, cursor: "pointer" }}>+ Ảnh</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addSpec} style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 7, padding: "7px 18px", fontWeight: 600, marginTop: 4, cursor: "pointer" }}>+ Thêm màu</button>
                </div>
              </div>
              {formError && <div style={{ color: "#d32f2f", marginTop: 10, fontWeight: 500 }}>{formError}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                <button type="button" onClick={closeForm} style={{ background: "#eee", color: "#222", border: "none", borderRadius: 7, padding: "8px 18px", fontWeight: 500, cursor: "pointer" }}>Huỷ</button>
                <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>{formMode === "add" ? "Thêm" : "Lưu"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 