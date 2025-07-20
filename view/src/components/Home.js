import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductList from "./ProductList";

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
      img: "https://www.nike.com/vn/w/look-of-football-o9pf?_gl=1*anko8j*_up*MQ..*_gs*Nw..&gclid=CKD77Pr7xY4DFTpPwgUd3XIRNA&gclsrc=ds",
      title: "Thời trang nam nữ cao cấp",
      desc: "Đẳng cấp - Hiện đại - Phong cách riêng.",
      button: { text: "Khám phá ngay", link: "/" }
    }
  ];

  // Dummy categories
  const categories = [
    { name: "Nam", key: "Men", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
    { name: "Nữ", key: "Women", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" },
    { name: "Giày", key: "Shoes", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
    { name: "Túi xách", key: "Accessories", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" }
  ];

  // State cho category filter
  const [category, setCategory] = useState("");

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
            style={{ textAlign: "center", cursor: "pointer", opacity: category === cat.key || category === "" ? 1 : 0.5, transition: "opacity 0.2s" }}
            onClick={() => setCategory(category === cat.key ? "" : cat.key)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", boxShadow: category === cat.key ? "0 4px 24px #1976d2aa" : "0 2px 12px rgba(0,0,0,0.08)", border: category === cat.key ? "3px solid #1976d2" : "3px solid #fff", transition: "box-shadow 0.2s, border 0.2s" }}
            />
            <div style={{ marginTop: 14, fontWeight: 600, fontSize: 19, color: category === cat.key ? "#1976d2" : undefined }}>{cat.name}</div>
          </div>
        ))}
      </div>

      {/* Lưới sản phẩm mới */}
      <div style={{ width: "100%", padding: "0 4vw" }}>
        <h2 style={{ margin: "24px 0 16px 0", fontWeight: 700, fontSize: 28, textAlign: "center" }}>Sản phẩm mới</h2>
        <ProductList filter={category ? { [category.toLowerCase()]: true } : {}} />
      </div>

      {/* Footer */}
      <div style={{ marginTop: 64, padding: "32px 0", background: "#222", color: "#fff", textAlign: "center", borderRadius: 0, width: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Fashionista Marketplace</div>
        <div style={{ fontSize: 14, color: "#bbb" }}>© {new Date().getFullYear()} Fashionista. All rights reserved.</div>
        <div style={{ marginTop: 12 }}>
          {/* Social links có thể thêm lại ở đây nếu muốn */}
        </div>
      </div>
    </div>
  );
}

export default Home; 