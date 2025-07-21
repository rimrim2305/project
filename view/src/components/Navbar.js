import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onSignOut }) {
  return (
    <header style={{
      width: "100%",
      background: "#222",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: 64,
        justifyContent: "space-between"
      }}>
        {/* Logo + menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <span style={{ fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: 1 }}>Fashionista</span>
          </Link>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: 17, fontWeight: 500 }}>Trang chủ</Link>
          <Link to="/blog" style={{ color: "#fff", textDecoration: "none", fontSize: 17, fontWeight: 500 }}>Blog</Link>
        </div>
        {/* User + cart + wishlist + profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link to="/cart" style={{ color: "#fff", textDecoration: "none", fontSize: 22, position: "relative" }} title="Giỏ hàng">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </Link>
          <Link to="/wishlist" style={{ color: "#fff", textDecoration: "none", fontSize: 22, position: "relative" }} title="Yêu thích">
            <span style={{ fontSize: 22, marginRight: 2, verticalAlign: "middle" }}>♥</span>
          </Link>
          {user ? (
            <>
              <span
                onClick={() => window.location.href = "/profile"}
                style={{ color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                title="Xem hồ sơ cá nhân"
              >
                <span style={{ fontSize: 20, color: "#6c63ff" }}>👤</span> {user.name}
              </span>
              <button
                onClick={onSignOut}
                style={{
                  background: "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "7px 22px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
                  marginLeft: 4
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16, marginRight: 16 }}>Đăng nhập</Link>
              <Link to="/register" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16 }}>Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar; 