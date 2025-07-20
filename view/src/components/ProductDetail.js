import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(0);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const fallbackImg = "https://dummyimage.com/400x300/cccccc/000000&text=No+Image";

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  const specs = product.specs || [];
  const spec = specs[selectedSpec] || {};
  const imgList = spec.imgList || [];
  const mainImg =
    product.image ||
    product.imageUrl ||
    (imgList.length > 0 ? imgList[selectedImg] : null) ||
    fallbackImg;
  const sizes = spec.sizes || [];
  const maxQty = spec.quantity || 0;

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng chọn size!");
      return;
    }
    const cartItem = {
      userId: user._id,
      products: [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        color: spec.title || '',
        size: selectedSize
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
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 40, alignItems: "flex-start" }}>
      {/* Ảnh lớn + thumbnails */}
      <div>
        <img
          src={mainImg}
          alt={product.name}
          style={{ width: 400, height: 400, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {imgList.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={"thumb"}
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: selectedImg === idx ? "2px solid #1976d2" : "1px solid #ccc", cursor: "pointer" }}
              onClick={() => setSelectedImg(idx)}
            />
          ))}
        </div>
      </div>
      {/* Thông tin chi tiết */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 32, marginBottom: 8 }}>{product.name}</h2>
        <div style={{ color: "#1976d2", fontWeight: 700, fontSize: 24, marginBottom: 12 }}>{product.price?.toLocaleString()} đ</div>
        <div style={{ marginBottom: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < Math.round(product.rating || 0) ? "#fbc02d" : "#ccc", fontSize: 20 }}>★</span>
          ))}
          <span style={{ marginLeft: 8, color: "#888" }}>{product.rating || 0}</span>
        </div>
        <div style={{ marginBottom: 16, color: "#444" }}>{product.description}</div>
        {/* Tags */}
        <div style={{ marginBottom: 16 }}>
          {product.tags && product.tags.map((tag, i) => <span key={i} style={{ background: "#eee", borderRadius: 4, padding: "2px 8px", marginRight: 6, fontSize: 13 }}>{tag}</span>)}
        </div>
        {/* Hiển thị tên màu sắc */}
        {specs.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <b>Màu sắc:</b>
            {specs.map((s, idx) => (
              <button
                key={s.colorId || idx}
                style={{
                  marginLeft: 8,
                  padding: "6px 16px",
                  borderRadius: 4,
                  border: selectedSpec === idx ? "2px solid #1976d2" : "1px solid #ccc",
                  background: selectedSpec === idx ? "#e3f0ff" : "#fff",
                  cursor: "pointer",
                  fontWeight: 600
                }}
                onClick={() => { setSelectedSpec(idx); setSelectedImg(0); setSelectedSize(""); }}
              >
                {s.title || s.colorId}
              </button>
            ))}
          </div>
        )}
        {/* Chọn size */}
        {sizes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <b>Select Size</b>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {sizes.map((sz, i) => (
                <button
                  key={i}
                  style={{ padding: "8px 20px", borderRadius: 6, border: selectedSize === sz ? "2px solid #1976d2" : "1px solid #ccc", background: selectedSize === sz ? "#e3f0ff" : "#fff", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Số lượng */}
        <div style={{ marginBottom: 16 }}>
          <b>Quantity:</b>
          <input
            type="number"
            min={1}
            max={maxQty}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value))))}
            style={{ width: 60, marginLeft: 8, padding: 4, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <span style={{ marginLeft: 8, color: "#888" }}>(Còn lại: {maxQty})</span>
        </div>
        {/* Nút Add to cart */}
        <button
          style={{ background: "#4f46e5", color: "#fff", fontWeight: 600, fontSize: 18, border: "none", borderRadius: 8, padding: "12px 0", width: 240, cursor: "pointer" }}
          disabled={maxQty === 0 || !selectedSize}
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail; 