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
          if (data.user.role === "admin") {
            setTimeout(() => navigate("/admin"), 500);
          } else {
            setTimeout(() => navigate("/"), 500);
          }
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
          boxShadow: "0 4px 32px rgba(25,118,210,0.13)",
          padding: "40px 36px 32px 36px",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 22
        }}
      >
        {/* Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: "#1976d2", marginBottom: 2 }}>Đăng nhập</div>
          <div style={{ color: "#888", fontSize: 15, marginTop: 2 }}>Chào mừng bạn trở lại với Fashionista!</div>
        </div>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: emailError ? "1.5px solid #d32f2f" : "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = emailError ? "1.5px solid #d32f2f" : "1.5px solid #bdbdbd"}
          />
          {emailError && <div style={{ color: "#d32f2f", fontSize: 13, marginTop: 2, marginLeft: 2 }}>{emailError}</div>}
        </div>
        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px 44px 10px 16px",
              borderRadius: 8,
              border: passwordError ? "1.5px solid #d32f2f" : "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = passwordError ? "1.5px solid #d32f2f" : "1.5px solid #bdbdbd"}
          />
          <span
            style={{ position: "absolute", right: 16, top: 38, color: "#1976d2", fontSize: 18, cursor: "pointer" }}
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.61"/><path d="M9.53 9.53A3 3 0 0 1 12 15a3 3 0 0 1-2.47-5.47"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
            )}
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
            borderRadius: 24,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 18,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8,
            boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = "#1256a3";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(25,118,210,0.18)";
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.background = "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,118,210,0.10)";
            }
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {message && (
          <div style={{
            marginTop: 8,
            color: message.includes("thành công") ? "#388e3c" : "#d32f2f",
            background: message.includes("thành công") ? "#e8f5e9" : "#ffebee",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 600,
            textAlign: "center",
            fontSize: 15
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