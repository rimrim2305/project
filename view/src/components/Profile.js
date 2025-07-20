import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        borderRadius: 18,
        boxShadow: "0 4px 32px rgba(25,118,210,0.10)",
        padding: "36px 32px 32px 32px",
        position: "relative",
        zIndex: 2
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <img src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 16px rgba(25,118,210,0.13)", border: "5px solid #fff", position: "relative", zIndex: 2 }} />
            <span style={{ position: "absolute", bottom: 8, right: 8, background: "#1976d2", color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid #fff" }}>✎</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 32, color: "#222" }}>{user.name}</h2>
            <div style={{ color: "#555", fontSize: 17, margin: "8px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <span role="img" aria-label="email">📧</span> {user.email}
            </div>
            <div style={{ color: "#888", fontSize: 15, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span><span role="img" aria-label="dob">🎂</span> {user.dob || "-"}</span>
              <span><span role="img" aria-label="country">🌏</span> {user.country || "-"}</span>
              <span><span role="img" aria-label="gender">👤</span> {user.gender || "-"}</span>
            </div>
            <button style={{ marginTop: 22, background: "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 32px", fontWeight: 700, fontSize: 17, cursor: "pointer", boxShadow: "0 2px 8px rgba(25,118,210,0.10)" }}>
              Chỉnh sửa thông tin
            </button>
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
                <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 18, boxShadow: "0 1px 6px rgba(25,118,210,0.04)", flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Mã đơn: {order._id || order.id}</div>
                  <div style={{ color: "#555", fontSize: 15, margin: "4px 0 8px 0" }}>Ngày đặt: {order.date || order.createdAt?.slice(0,10) || "-"} | Tổng tiền: {order.total?.toLocaleString() || "-"} đ | Trạng thái: <span style={{ color: "#388e3c", fontWeight: 600 }}>{order.status || order.orderInfo?.shippingStatus || "-"}</span></div>
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