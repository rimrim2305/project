import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ search, filter }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (filter) {
      if (filter.shoes) params.append("category", "Shoes");
      if (filter.clothings) params.append("category", "Clothing");
      if (filter.accessories) params.append("category", "Accessories");
    }
    const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, [search, filter]);

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    const cartItem = {
      userId: user._id,
      products: [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: product.specs && product.specs[0] ? product.specs[0].title : '',
        size: product.specs && product.specs[0] && product.specs[0].sizes && product.specs[0].sizes[0] ? product.specs[0].sizes[0] : ''
      }]
    };
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert(data.message || "Thêm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div>
      <h2 style={{ margin: "24px 0 16px 0", fontWeight: 700, fontSize: 24 }}>New Arrivals</h2>
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