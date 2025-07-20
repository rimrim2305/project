import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <form onSubmit={e => { e.preventDefault(); onSearch && onSearch(q); }} style={{ margin: "16px 0" }}>
      <input
        type="text"
        placeholder="Search..."
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ padding: 8, width: 220, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button type="submit" style={{ marginLeft: 8, padding: "8px 16px", borderRadius: 4, border: "none", background: "#1976d2", color: "#fff" }}>Tìm kiếm</button>
    </form>
  );
}

export default SearchBar; 