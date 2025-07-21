import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductList from "./ProductList";
import FilterSidebar from "./FilterSidebar";

function Home() {
  // Banner data: mỗi banner có ảnh, tiêu đề, mô tả, nút
  const banners = [
    {
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
      title: "Bộ sưu tập Xuân Hè 2024",
      desc: "Khám phá phong cách mới, nổi bật và cá tính.",
      button: { text: "Mua ngay", link: "/" }
    },
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      title: "Ưu đãi lên đến 50%",
      desc: "Săn sale cực sốc cho các sản phẩm hot nhất.",
      button: { text: "Xem khuyến mãi", link: "/" }
    },
    {
      img: "https://tse3.mm.bing.net/th/id/OIP.oC461Bp2i9X7jScizrwp5gHaEr?pid=Api&P=0&w=300&h=300",
      title: "Thời trang nam nữ cao cấp",
      desc: "Đẳng cấp - Hiện đại - Phong cách riêng.",
      button: { text: "Khám phá ngay", link: "/" }
    }
  ];

  // Dummy categories
  const categories = [
    { name: "Quần áo", key: "Clothing", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
    { name: "Giày", key: "Shoes", img: "https://sneakerdaily.vn/wp-content/uploads/2022/08/Giay-Nike-Dunk-Low-White-Pink-GS-DH9765-100-8.jpg" },
    { name: "Túi xách", key: "Accessories", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" }
  ];

  // State cho filter nâng cao
  const [filter, setFilter] = useState({});

  // Khi chọn danh mục nổi bật
  const handleCategory = (catKey) => {
    setFilter(f => ({ ...f, category: filter.category === catKey ? undefined : catKey }));
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true
  };

  return (
    <div style={{ width: "100%", padding: "32px 0 0 0" }}>
      {/* Banner/Slider động đẹp, overlay text */}
      <div style={{ width: "100%", margin: "0 auto 40px auto", borderRadius: 0, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
        <Slider {...sliderSettings}>
          {banners.map((banner, idx) => (
            <div key={idx} style={{ position: "relative", width: "100vw", height: "40vw", minHeight: 260, maxHeight: 420 }}>
              <img
                src={banner.img}
                alt={banner.title}
                style={{ width: "100vw", height: "40vw", minHeight: 260, maxHeight: 420, objectFit: "cover", display: "block", borderRadius: 0 }}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg,rgba(0,0,0,0.18) 30%,rgba(0,0,0,0.05) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: "8vw",
                color: "#fff"
              }}>
                <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 12, textShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>{banner.title}</h2>
                <div style={{ fontSize: 22, fontWeight: 400, marginBottom: 24, textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>{banner.desc}</div>
                <a
                  href={banner.button.link}
                  style={{
                    background: "#fff",
                    color: "#1976d2",
                    fontWeight: 700,
                    fontSize: 18,
                    padding: "12px 32px",
                    borderRadius: 32,
                    textDecoration: "none",
                    boxShadow: "0 2px 12px rgba(25,118,210,0.10)",
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#1976d2";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#1976d2";
                  }}
                >
                  {banner.button.text}
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Danh mục nổi bật */}
      <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 56, flexWrap: "wrap", padding: "0 4vw" }}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{ textAlign: "center", cursor: "pointer", opacity: filter.category === cat.key || !filter.category ? 1 : 0.5, transition: "opacity 0.2s" }}
            onClick={() => handleCategory(cat.key)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", boxShadow: filter.category === cat.key ? "0 4px 24px #1976d2aa" : "0 2px 12px rgba(0,0,0,0.08)", border: filter.category === cat.key ? "3px solid #1976d2" : "3px solid #fff", transition: "box-shadow 0.2s, border 0.2s" }}
            />
            <div style={{ marginTop: 14, fontWeight: 600, fontSize: 19, color: filter.category === cat.key ? "#1976d2" : undefined }}>{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Lưới sản phẩm mới với sidebar filter */}
      <div style={{ width: "100%", padding: "0 4vw", display: "flex", alignItems: "flex-start" }}>
        <FilterSidebar filter={filter} onChange={setFilter} />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "24px 0 16px 0", fontWeight: 700, fontSize: 28, textAlign: "center" }}>Sản phẩm mới</h2>
          <ProductList filter={filter} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 64,
        padding: "40px 0 24px 0",
        background: "#222",
        color: "#fff",
        borderRadius: "0 0 16px 16px",
        width: "100%",
        boxShadow: "0 -2px 16px rgba(25,118,210,0.07)"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 32,
          padding: "0 32px"
        }}>
          {/* Cột 1: Logo + giới thiệu */}
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>Fashionista</div>
            <div style={{ color: "#bbb", fontSize: 15, marginBottom: 12 }}>
              Nền tảng mua sắm thời trang hiện đại, uy tín và chất lượng.
            </div>
          </div>
          {/* Cột 2: Liên hệ */}
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Liên hệ</div>
            <div style={{ color: "#bbb", fontSize: 15 }}>Email: support@fashionista.vn</div>
            <div style={{ color: "#bbb", fontSize: 15 }}>Hotline: 0123 456 789</div>
          </div>
          {/* Cột 3: Mạng xã hội */}
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Kết nối với chúng tôi</div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>
                <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>
                <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.06-2.687.334-3.678 1.325-.991.991-1.265 2.402-1.325 3.678-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.276.334 2.687 1.325 3.678.991.991 2.402 1.265 3.678 1.325 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.06 2.687-.334 3.678-1.325.991-.991 1.265-2.402 1.325-3.678.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.265-3.678-1.325-1.28-.06-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "#bbb", fontSize: 14, marginTop: 32 }}>
          © {new Date().getFullYear()} Fashionista. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Home; 