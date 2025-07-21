import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!email) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    }
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đăng nhập thành công!");
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess(data.user);
          setTimeout(() => navigate("/"), 500); // Chuyển về trang chủ sau khi đăng nhập
        }
      } else {
        setMessage(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setMessage("Lỗi kết nối server");
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
        {/* Logo và tiêu đề phụ */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <img src="https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo-1971-now.png" alt="logo" style={{ width: 54, marginBottom: 8 }} />
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1976d2" }}>Chào mừng bạn trở lại!</div>
          <div style={{ color: "#888", fontSize: 15, marginTop: 2 }}>Đăng nhập để tiếp tục mua sắm cùng Nike Marketplace</div>
        </div>
        {/* Email */}
        <div style={{ position: "relative" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 44px 12px 16px",
              borderRadius: 8,
              border: emailError ? "1.5px solid #d32f2f" : "1px solid #bdbdbd",
              fontSize: 16,
              outline: "none"
            }}
          />
          <span style={{ position: "absolute", right: 16, top: 12, color: "#1976d2", fontSize: 18 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/></svg>
          </span>
          {emailError && <div style={{ color: "#d32f2f", fontSize: 13, marginTop: 2, marginLeft: 2 }}>{emailError}</div>}
        </div>
        {/* Password */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 44px 12px 16px",
              borderRadius: 8,
              border: passwordError ? "1.5px solid #d32f2f" : "1px solid #bdbdbd",
              fontSize: 16,
              outline: "none"
            }}
          />
          <span
            style={{ position: "absolute", right: 38, top: 12, color: "#1976d2", fontSize: 18, cursor: "pointer" }}
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.61"/><path d="M9.53 9.53A3 3 0 0 1 12 15a3 3 0 0 1-2.47-5.47"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </span>
          <span style={{ position: "absolute", right: 16, top: 12, color: "#1976d2", fontSize: 18 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </span>
          {passwordError && <div style={{ color: "#d32f2f", fontSize: 13, marginTop: 2, marginLeft: 2 }}>{passwordError}</div>}
        </div>
        {/* Quên mật khẩu */}
        <div style={{ textAlign: "right", marginTop: -10, marginBottom: 2 }}>
          <Link to="/forgot-password" style={{ color: "#1976d2", fontSize: 14, textDecoration: "underline", fontWeight: 500, background: "none", border: "none", padding: 0, cursor: "pointer" }}>Quên mật khẩu?</Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#b0bec5" : "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)",
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
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {message && (
          <div style={{
            marginTop: 8,
            color: message.includes("thành công") ? "#388e3c" : "#d32f2f",
            textAlign: "center",
            fontWeight: 500
          }}>{message}</div>
        )}
        {/* Đăng nhập Google (UI) */}
        <div style={{ textAlign: "center", margin: "18px 0 0 0" }}>
          <button
            type="button"
            style={{
              background: "#fff",
              color: "#222",
              border: "1.5px solid #bdbdbd",
              borderRadius: 8,
              padding: "10px 0",
              fontWeight: 600,
              fontSize: 16,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              marginBottom: 2,
              transition: "border 0.2s"
            }}
            onClick={() => alert("Chức năng đăng nhập Google sẽ phát triển sau!")}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="google" style={{ width: 22, height: 22, borderRadius: 3 }} />
            Đăng nhập bằng Google
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 15 }}>
          Chưa có tài khoản? <a href="/register" style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 600 }}>Đăng ký ngay</a>
        </div>
      </form>
    </div>
  );
}

export default Login; 