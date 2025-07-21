import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cities = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định",
  "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk",
  "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội",
  "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
  "Kon Tum", "Lai Châu"
];

function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || { products: [] };
  const [payment, setPayment] = useState("cash");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");

  const shippingFee = 30000;
  const total = cart.products?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const hasProducts = cart.products && cart.products.length > 0;
  const grandTotal = hasProducts ? total + shippingFee : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasProducts) return;
    if (!address || !ward || !city) {
      alert("Vui lòng nhập đầy đủ địa chỉ, phường và chọn thành phố!");
      return;
    }
    alert(
      `Đặt hàng thành công!\nĐịa chỉ: ${address}, Phường: ${ward}, Thành phố: ${city}\nPhương thức thanh toán: ${payment === "cash" ? "Tiền mặt" : "Chuyển khoản"}\nTổng tiền: ${grandTotal.toLocaleString()} đ`
    );
    localStorage.setItem("lastOrder", JSON.stringify({
      address,
      ward,
      city,
      payment,
      total: grandTotal,
      products: cart.products
    }));
    localStorage.removeItem("cart");
    // Xóa giỏ hàng trên server
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      await fetch(`/api/cart/clear?userId=${user._id}`, { method: "DELETE" });
    }
    navigate("/orders");
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(25,118,210,0.08)", padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: "center" }}>Thanh toán</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 12 }}>Thông tin nhận hàng</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Địa chỉ (số nhà, đường...)"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                flex: 2,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16
              }}
              disabled={!hasProducts}
            />
            <input
              type="text"
              placeholder="Phường"
              value={ward}
              onChange={e => setWard(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16
              }}
              disabled={!hasProducts}
            />
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16
              }}
              disabled={!hasProducts}
            >
              <option value="">Chọn thành phố</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 12 }}>Sản phẩm</h3>
          {hasProducts ? (
            <>
              <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                {cart.products.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                    <b>{item.name}</b> ({item.quantity} x {item.price?.toLocaleString()} đ)
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {item.color && <>Màu: {item.color} </>}
                      {item.size && <>| Size: {item.size}</>}
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: "right", fontWeight: 700, fontSize: 18, marginTop: 12 }}>
                Tạm tính: {total.toLocaleString()} đ
              </div>
              <div style={{ textAlign: "right", fontWeight: 500, fontSize: 16 }}>
                Phí vận chuyển: {shippingFee.toLocaleString()} đ
              </div>
              <div style={{ textAlign: "right", fontWeight: 700, fontSize: 20, marginTop: 8 }}>
                Tổng cộng: {grandTotal.toLocaleString()} đ
              </div>
            </>
          ) : (
            <div style={{ color: "#d32f2f" }}>Giỏ hàng trống.</div>
          )}
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 12 }}>Phương thức thanh toán</h3>
          <label style={{ marginRight: 24 }}>
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
              style={{ marginRight: 8 }}
              disabled={!hasProducts}
            />
            Tiền mặt
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="bank"
              checked={payment === "bank"}
              onChange={() => setPayment("bank")}
              style={{ marginRight: 8 }}
              disabled={!hasProducts}
            />
            Chuyển khoản
          </label>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            style={{
              background: hasProducts ? "#1976d2" : "#aaa",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontWeight: 600,
              fontSize: 18,
              cursor: hasProducts ? "pointer" : "not-allowed",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { if (hasProducts) e.currentTarget.style.background = "#1256a3"; }}
            onMouseLeave={e => { if (hasProducts) e.currentTarget.style.background = "#1976d2"; }}
            disabled={!hasProducts}
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          style={{
            background: "#eee",
            color: "#333",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </button>
         </div>
    </div>
  );
}

export default Checkout;