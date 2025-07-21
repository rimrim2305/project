import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đã gửi email đặt lại mật khẩu (giả lập). Vui lòng kiểm tra email!");
      } else {
        setMessage(data.message || "Không tìm thấy email này!");
      }
    } catch (err) {
      setMessage("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 32px rgba(25,118,210,0.10)",
          padding: "40px 32px 32px 32px",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 22
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1976d2" }}>Quên mật khẩu</h2>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#b0bec5" : "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 17,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8,
            boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
        {message && (
          <div style={{ marginTop: 8, color: message.includes("Đã gửi") ? "#388e3c" : "#d32f2f", textAlign: "center", fontWeight: 500 }}>{message}</div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword; 