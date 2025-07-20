import React, { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    if (!user || !user._id) {
      setError("Bạn cần đăng nhập để xem giỏ hàng!");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/cart?userId=${user._id}`);
      const data = await res.json();
      setCart(data && data.products ? data : null);
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const handleRemove = async (itemId) => {
    if (!cart) return;
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
      } else {
        alert(data.message || "Xóa thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleChangeQuantity = async (itemId, newQty) => {
    if (!cart) return;
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, itemId, quantity: newQty })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
      } else {
        alert(data.message || "Cập nhật số lượng thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}>Đang tải giỏ hàng...</div>;
  if (error) return <div style={{ textAlign: "center", marginTop: 80, color: "#d32f2f" }}>{error}</div>;
  if (!cart || !cart.products || cart.products.length === 0) return <div style={{ textAlign: "center", marginTop: 80 }}>Giỏ hàng của bạn đang trống.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(25,118,210,0.08)", padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Giỏ hàng của bạn</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f7fa" }}>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Tên sản phẩm</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Màu</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Size</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Số lượng</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Đơn giá</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Thành tiền</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cart.products.map((item, idx) => (
            <tr key={item._id || idx}>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.name}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.color}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee", color: !item.size ? "#d32f2f" : undefined }}>
                {item.size ? item.size : <b>Chưa chọn</b>}
              </td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <button onClick={() => handleChangeQuantity(item._id, item.quantity - 1)} style={{ padding: "2px 8px", fontWeight: 700, fontSize: 16, borderRadius: 4, border: "1px solid #ccc", background: "#fff", marginRight: 6, cursor: "pointer" }}>-</button>
                <span style={{ minWidth: 24, display: "inline-block", textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => handleChangeQuantity(item._id, item.quantity + 1)} style={{ padding: "2px 8px", fontWeight: 700, fontSize: 16, borderRadius: 4, border: "1px solid #ccc", background: "#fff", marginLeft: 6, cursor: "pointer" }}>+</button>
              </td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.price?.toLocaleString()} đ</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{(item.price * item.quantity).toLocaleString()} đ</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <button onClick={() => handleRemove(item._id)} style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: 24, fontWeight: 700, fontSize: 20 }}>
        Tổng tiền: {cart.products.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} đ
      </div>
    </div>
  );
}

export default Cart; 