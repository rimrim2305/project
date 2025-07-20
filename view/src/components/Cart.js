import React, { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
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
        if (res.ok) {
          setCart(data && data.length ? data[0] : null);
        } else {
          setError(data.message || "Không lấy được giỏ hàng");
        }
      } catch (err) {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const handleRemove = async (productId) => {
    if (!cart) return;
    const item = cart.products.find(p => p.productId === productId);
    if (!item || !item._id) {
      alert("Không tìm thấy sản phẩm trong giỏ hàng!");
      return;
    }
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      const res = await fetch(`/api/cart/${item._id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setCart({ ...cart, products: cart.products.filter(p => p.productId !== productId) });
        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
      } else {
        alert(data.message || "Xóa thất bại!");
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
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Giá</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cart.products.map((item, idx) => (
            <tr key={item.productId || idx}>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.name}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.color}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.size}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.quantity}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{item.price?.toLocaleString()} đ</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <button onClick={() => handleRemove(item.productId)} style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>Xóa</button>
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