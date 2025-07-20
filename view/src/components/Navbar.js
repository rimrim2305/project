import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onSignOut }) {
  return (
    <div style={{ width: "100%", background: "#222", padding: "0" }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: 56,
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontWeight: 900, fontSize: 26, color: "#fff", letterSpacing: 1 }}>Nike</span>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: 17, fontWeight: 500 }}>Marketplace</Link>
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none", fontSize: 17, fontWeight: 500 }}>Profile</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {user ? (
            <>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Welcome, {user.name}</span>
              <span style={{ color: "#fff", fontSize: 22, marginRight: 4 }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </span>
              <button
                onClick={onSignOut}
                style={{
                  background: "#fff",
                  color: "#222",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 16px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  marginLeft: 8
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16, marginRight: 16 }}>Đăng nhập</Link>
              <Link to="/register" style={{ color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 16 }}>Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar; 