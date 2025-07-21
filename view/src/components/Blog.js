import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: 80, fontSize: 20, color: "#1976d2" }}>Đang tải bài viết...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ fontWeight: 800, fontSize: 32, color: "#1976d2", textAlign: "center", marginBottom: 32 }}>Blog & Tin tức</h2>
      {posts.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18, textAlign: "center", marginTop: 40 }}>Chưa có bài viết nào.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {posts.map(post => (
            <div key={post._id || post.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(25,118,210,0.07)", padding: 24, display: "flex", gap: 24, alignItems: "flex-start" }}>
              <img src={post.imgSrc || "https://dummyimage.com/180x120/cccccc/000000&text=No+Image"} alt={post.title} style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 10, boxShadow: "0 1px 6px rgba(25,118,210,0.04)" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: 22, margin: 0 }}>{post.title || post.content?.slice(0, 40) || "Bài viết"}</h3>
                <div style={{ color: "#888", fontSize: 14, margin: "8px 0 12px 0" }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                <div style={{ color: "#444", fontSize: 16, marginBottom: 14 }}>{post.content?.slice(0, 120) || "..."}...</div>
                <button
                  style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "8px 22px", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: "0 1px 4px rgba(25,118,210,0.08)", transition: "background 0.2s, box-shadow 0.2s" }}
                  onClick={() => navigate(`/blog/${post._id || post.id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog; 