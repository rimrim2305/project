import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetch(`/api/user/wishlist?userId=${user._id}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const removeFromWishlist = async (productId) => {
    if (!user?._id) return;
    setLoading(true);
    await fetch("/api/user/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, productId }),
    });
    // Refetch wishlist
    fetch(`/api/user/wishlist?userId=${user._id}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  };

  // Thêm vào giỏ hàng
  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id) return alert("Bạn cần đăng nhập!");
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, products: [{ productId: product._id || product.id, name: product.name, price: product.price, quantity: 1 }] }),
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 80, fontSize: 20, color: "#1976d2" }}>Đang tải danh sách yêu thích...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ fontWeight: 800, fontSize: 32, color: "#1976d2", textAlign: "center", marginBottom: 32 }}>Sản phẩm yêu thích</h2>
      {products.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18, textAlign: "center", marginTop: 40 }}>Bạn chưa có sản phẩm yêu thích nào.</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
          justifyItems: "center",
          alignItems: "stretch",
          width: "100%",
          margin: "0 auto"
        }}>
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
              {/* Icon xóa khỏi wishlist */}
              <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2 }}>
                <span
                  onClick={e => { e.stopPropagation(); removeFromWishlist(p._id || p.id); }}
                  style={{
                    cursor: "pointer",
                    fontSize: 22,
                    color: "#e53935",
                    transition: "color 0.2s"
                  }}
                  title="Bỏ khỏi yêu thích"
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
                Xem chi tiết
              </button>
              <button
                style={{
                  marginTop: 8,
                  background: "#4f46e5",
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
                  addToCart(p);
                }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist; 