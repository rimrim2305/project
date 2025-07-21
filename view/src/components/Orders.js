import React, { useEffect, useState } from "react";

function Orders() {
  const [order, setOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("lastOrder"));
    setOrder(savedOrder);
  }, []);

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?")) {
      localStorage.removeItem("lastOrder");
      setOrder(null);
      alert("Đã huỷ đơn hàng!");
    }
  };

  if (!order) {
    return (
      <div style={{ textAlign: "center", marginTop: 80, color: "#d32f2f" }}>
        Không có đơn hàng nào.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(25,118,210,0.08)", padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: "center" }}>Lịch sử đơn hàng</h2>
      <div style={{ marginBottom: 18, fontSize: 18 }}>
        <b>Địa chỉ nhận hàng:</b> {order.address}, Phường: {order.ward}, Thành phố: {order.city}
      </div>
      <div style={{ marginBottom: 18, fontSize: 18 }}>
        <b>Phương thức thanh toán:</b> {order.payment === "cash" ? "Tiền mặt" : "Chuyển khoản"}
      </div>
      <div style={{ marginBottom: 18, fontSize: 18 }}>
        <b>Tổng tiền:</b> {order.total.toLocaleString()} đ
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32 }}>
        <button
          style={{
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={handleCancel}
        >
          Huỷ đơn hàng
        </button>
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={() => setShowDetail(true)}
        >
          Xem chi tiết đơn hàng
        </button>
      </div>
      {showDetail && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(25,118,210,0.18)",
            padding: 32,
            minWidth: 350,
            maxWidth: 400,
            position: "relative"
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, textAlign: "center" }}>Chi tiết đơn hàng</h3>
            <div style={{ marginBottom: 10 }}>
              <b>Địa chỉ:</b> {order.address}, Phường: {order.ward}, Thành phố: {order.city}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Phương thức thanh toán:</b> {order.payment === "cash" ? "Tiền mặt" : "Chuyển khoản"}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Tổng tiền:</b> {order.total.toLocaleString()} đ
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Sản phẩm:</b>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {order.products.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    {item.name} ({item.quantity} x {item.price.toLocaleString()} đ)
                  </li>
                ))}
              </ul>
            </div>
            <button
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "4px 12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => setShowDetail(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;