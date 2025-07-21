import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ filter }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(""); // Local search state
  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter) {
      if (filter.category) params.append("category", filter.category);
      if (filter.minPrice) params.append("minPrice", filter.minPrice);
      if (filter.maxPrice) params.append("maxPrice", filter.maxPrice);
      if (filter.color) params.append("color", filter.color);
      if (filter.size) params.append("size", filter.size);
      if (filter.brand) params.append("brand", filter.brand);
      if (filter.shoes) params.append("shoes", "true");
      if (filter.clothings) params.append("clothings", "true");
      if (filter.accessories) params.append("accessories", "true");
    }
    if (sort) params.append("sort", sort);
    const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, [search, filter, sort]);

  // Fetch wishlist khi load
  useEffect(() => {
    if (user?._id) {
      fetch(`/api/user/wishlist?userId=${user._id}`)
        .then(res => res.json())
        .then(data => setWishlist(data.map(p => p._id || p.id)));
    }
  }, [user?._id]);

  // Thêm/xóa sản phẩm khỏi wishlist
  const toggleWishlist = async (productId) => {
    if (!user?._id) return alert("Bạn cần đăng nhập!");
    const res = await fetch("/api/user/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, productId }),
    });
    const data = await res.json();
    setWishlist(data.map(p => p._id || p.id));
  };

  return (
    <div>
      <h2 style={{ margin: "24px 0 16px 0", fontWeight: 700, fontSize: 24 }}> </h2>
      {/* Search bar */}
      <form
        onSubmit={e => { e.preventDefault(); }}
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
          border: "1.5px solid #1976d2",
          padding: "4px 16px 4px 12px",
          width: 340,
          transition: "box-shadow 0.2s, border 0.2s"
        }}>
          <svg width="22" height="22" fill="none" stroke="#1976d2" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: 17,
              background: "transparent",
              flex: 1,
              padding: "8px 0"
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginLeft: 12,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1256a3";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(25,118,210,0.18)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#1976d2";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,118,210,0.10)";
          }}
        >
          Tìm kiếm
        </button>
      </form>
      {/* Sort By */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 18, gap: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Sắp xếp theo:</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #1976d2", fontWeight: 600, fontSize: 15 }}>
          <option value="">Nổi bật</option>
          <option value="newest">Mới nhất</option>
          <option value="price_desc">Giá: Cao-Thấp</option>
          <option value="price_asc">Giá: Thấp-Cao</option>
        </select>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          justifyItems: "center",
          alignItems: "stretch",
          width: "100%",
          margin: "0 auto"
        }}
      >
        {products.map((p) => (
          <div
            key={p._id || p.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              padding: 18,
              width: 220,
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              transition: "box-shadow 0.2s, transform 0.2s",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/product/${p._id || p.id}`)}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(25, 118, 210, 0.15)";
              e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
              e.currentTarget.style.transform = "none";
            }}
          >
            {/* Icon wishlist */}
            <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2 }}>
              <span
                onClick={e => { e.stopPropagation(); toggleWishlist(p._id || p.id); }}
                style={{
                  cursor: "pointer",
                  fontSize: 22,
                  color: wishlist.includes(p._id || p.id) ? "#e53935" : "#bbb",
                  transition: "color 0.2s"
                }}
                title={wishlist.includes(p._id || p.id) ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
              >
                ♥
              </span>
            </div>
            <img
              src={
                p.image || p.imageUrl ||
                (p.specs && p.specs[0] && p.specs[0].imgList && p.specs[0].imgList[0]) ||
                "https://dummyimage.com/220x160/cccccc/000000&text=No+Image"
              }
              alt={p.name}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 16,
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
              }}
            />
            <h4 style={{ margin: "8px 0 4px 0", fontWeight: 600, fontSize: 18, textAlign: "center", minHeight: 44 }}>{p.name}</h4>
            <div style={{ color: "#1976d2", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{p.price?.toLocaleString()} đ</div>
            {/* Nút thêm vào giỏ hàng */}
            <button
              style={{
                marginTop: "auto",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(25,118,210,0.08)",
                transition: "background 0.2s, box-shadow 0.2s"
              }}
              onClick={e => {
                e.stopPropagation();
                navigate(`/product/${p._id || p.id}`);
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1256a3";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,118,210,0.18)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#1976d2";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(25,118,210,0.08)";
              }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;