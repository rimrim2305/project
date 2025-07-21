import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", marginTop: 80, fontSize: 20, color: "#1976d2" }}>Đang tải bài viết...</div>;
  if (!post) return <div style={{ textAlign: "center", marginTop: 80, fontSize: 18, color: "#d32f2f" }}>Không tìm thấy bài viết.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 18, background: "#eee", color: "#1976d2", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>← Quay lại</button>
      <h2 style={{ fontWeight: 800, fontSize: 32, color: "#1976d2", marginBottom: 18 }}>{post.title || post.content?.slice(0, 40) || "Bài viết"}</h2>
      <div style={{ color: "#888", fontSize: 15, marginBottom: 18 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
      <img src={post.imgSrc || "https://dummyimage.com/600x300/cccccc/000000&text=No+Image"} alt={post.title} style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: 12, marginBottom: 24, boxShadow: "0 1px 8px rgba(25,118,210,0.06)" }} />
      <div style={{ color: "#222", fontSize: 18, lineHeight: 1.7, background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(25,118,210,0.07)" }}>
        {post.content}
      </div>
    </div>
  );
}

export default BlogDetail; 