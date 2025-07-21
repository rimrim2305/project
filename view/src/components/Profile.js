import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Lấy userId từ localStorage
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal || !userLocal._id) {
          setError("Không tìm thấy thông tin người dùng.");
          setLoading(false);
          return;
        }
        // Fetch user profile
        const userRes = await fetch(`/api/user/profile?userId=${userLocal._id}`);
        if (!userRes.ok) throw new Error("Không lấy được thông tin user");
        const userData = await userRes.json();
        setUser(userData);
        // Fetch order history
        const orderRes = await fetch(`/api/user/order-history?userId=${userLocal._id}`);
        if (!orderRes.ok) throw new Error("Không lấy được lịch sử đơn hàng");
        const orderData = await orderRes.json();
        setOrders(orderData);
      } catch (err) {
        setError(err.message || "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditData({ ...user });
    setEditMode(true);
    setEditMsg("");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditMsg("");
    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(editData);
        setEditMode(false);
        setEditMsg("Cập nhật thành công!");
      } else {
        setEditMsg(data.message || "Cập nhật thất bại");
      }
    } catch {
      setEditMsg("Lỗi kết nối server");
    }
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditMsg("");
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 80, fontSize: 20, color: "#1976d2" }}>Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div style={{ textAlign: "center", marginTop: 80, fontSize: 18, color: "#d32f2f" }}>{error}</div>;
  }
  if (!user) {
    return <div style={{ textAlign: "center", marginTop: 80, fontSize: 18 }}>Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Cover background */}
      <div style={{
        width: "100%",
        height: 220,
        background: `url(${user.cover || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"}) center/cover no-repeat`,
        filter: "blur(0.5px)",
        position: "relative"
      }} />
      {/* Card user info */}
      <div style={{
        maxWidth: 700,
        margin: "-110px auto 0 auto",
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 6px 32px rgba(25,118,210,0.13)",
        padding: "40px 36px 32px 36px",
        position: "relative",
        zIndex: 2
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <img src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 16px rgba(25,118,210,0.13)", border: "6px solid #fff", position: "relative", zIndex: 2, transition: "box-shadow 0.2s" }} />
            <span style={{ position: "absolute", bottom: 12, right: 12, background: "#1976d2", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "2px solid #fff", cursor: "pointer", boxShadow: "0 1px 6px rgba(25,118,210,0.10)" }} title="Đổi ảnh đại diện">✎</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            {editMode ? (
              <form onSubmit={handleEditSave} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                <div>
                  <label style={{ fontWeight: 600 }}>Họ tên</label>
                  <input name="name" value={editData.name} onChange={handleEditChange} required style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600 }}>Email</label>
                  <input name="email" value={editData.email} onChange={handleEditChange} required style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600 }}>Ngày sinh</label>
                  <input name="dob" type="date" value={editData.dob} onChange={handleEditChange} style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600 }}>Quốc gia</label>
                  <input name="country" value={editData.country} onChange={handleEditChange} style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600 }}>Giới tính</label>
                  <select name="gender" value={editData.gender} onChange={handleEditChange} style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600 }}>Avatar (link ảnh)</label>
                  <input name="avatar" value={editData.avatar} onChange={handleEditChange} style={{ padding: 8, borderRadius: 8, border: "1.5px solid #bdbdbd", fontSize: 16 }} />
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Lưu</button>
                  <button type="button" onClick={handleEditCancel} style={{ background: "#eee", color: "#222", border: "none", borderRadius: 8, padding: "10px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Hủy</button>
                </div>
                {editMsg && <div style={{ color: editMsg.includes("thành công") ? "#388e3c" : "#d32f2f", marginTop: 6 }}>{editMsg}</div>}
              </form>
            ) : (
              <>
                <h2 style={{ margin: 0, fontWeight: 800, fontSize: 32, color: "#222" }}>{user.name}</h2>
                <div style={{ color: "#555", fontSize: 17, margin: "8px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <span role="img" aria-label="email">📧</span> {user.email}
                </div>
                <div style={{ color: "#888", fontSize: 15, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span><span role="img" aria-label="dob">🎂</span> {user.dob || "-"}</span>
                  <span><span role="img" aria-label="country">🌏</span> {user.country || "-"}</span>
                  <span><span role="img" aria-label="gender">👤</span> {user.gender || "-"}</span>
                </div>
                <button onClick={handleEditClick} style={{ marginTop: 22, background: "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)", color: "#fff", border: "none", borderRadius: 24, padding: "12px 36px", fontWeight: 700, fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(25,118,210,0.10)", transition: "background 0.2s, box-shadow 0.2s" }}>
                  Chỉnh sửa thông tin
                </button>
              </>
            )}
          </div>
        </div>
        <hr style={{ margin: "36px 0 24px 0", border: 0, borderTop: "1px solid #eee" }} />
        <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: "#1976d2" }}>Lịch sử đơn hàng</h3>
        {orders.length === 0 ? (
          <div style={{ color: "#888", fontSize: 16 }}>Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 8 }}>
            {orders.map((order, idx) => (
              <div key={order._id || order.id} style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1976d2", marginTop: 6, flexShrink: 0 }}></div>
                <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(25,118,210,0.04)", flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#222" }}>Mã đơn: {order._id || order.id}</div>
                  <div style={{ color: "#555", fontSize: 15, margin: "4px 0 8px 0" }}>Ngày đặt: {order.date || order.createdAt?.slice(0,10) || "-"} | Tổng tiền: {order.total?.toLocaleString() || "-"} đ | Trạng thái: <span style={{ color: order.status === "delivered" || order.orderInfo?.shippingStatus === "delivered" ? "#388e3c" : "#1976d2", fontWeight: 700 }}>{order.status || order.orderInfo?.shippingStatus || "-"}</span></div>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, color: "#444", fontSize: 15 }}>
                    {(order.items || order.products || []).map((item, i) => (
                      <li key={i}>{item.name} x{item.qty || item.quantity || 1} <span style={{ color: "#1976d2" }}>({(item.price || 0).toLocaleString()} đ)</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 