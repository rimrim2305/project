import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    country: "",
    gender: "male"
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đăng ký thành công!");
        setSuccess(true);
      } else {
        setMessage(data.message || "Đăng ký thất bại");
        setSuccess(false);
      }
    } catch (err) {
      setMessage("Lỗi kết nối server");
      setSuccess(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f7fa"
    }}>
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
          gap: 18
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: 800, fontSize: 28, marginBottom: 8, color: "#1976d2" }}>Đăng ký tài khoản</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Họ tên</label>
          <input
            type="text"
            name="name"
            placeholder="Nhập họ tên"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Ngày sinh</label>
          <input
            type="date"
            name="dob"
            placeholder="Ngày sinh"
            value={form.dob}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Quốc gia</label>
          <input
            type="text"
            name="country"
            placeholder="Nhập quốc gia"
            value={form.country}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              boxShadow: "0 1px 6px rgba(25,118,210,0.04)"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Giới tính</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1.5px solid #bdbdbd",
              fontSize: 16,
              outline: "none",
              background: "#f8fafd",
              transition: "border 0.2s"
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #bdbdbd"}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            marginTop: 10,
            background: "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1256a3";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(25,118,210,0.18)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,118,210,0.10)";
          }}
        >
          Đăng ký
        </button>
        {message && (
          <div style={{
            marginTop: 10,
            color: success ? "#388e3c" : "#d32f2f",
            background: success ? "#e8f5e9" : "#ffebee",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 600,
            textAlign: "center",
            fontSize: 15
          }}>{message}</div>
        )}
      </form>
    </div>
  );
}

export default Register; 