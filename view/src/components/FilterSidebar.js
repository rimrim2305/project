import React from "react";

function FilterSidebar({ filter, onChange }) {
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    onChange({ ...filter, [name]: checked ? true : false });
  };
  return (
    <div style={{ minWidth: 180, marginRight: 24 }}>
      <h4>Bộ lọc</h4>
      <div>
        <label><input type="checkbox" name="shoes" checked={filter.shoes || false} onChange={handleCheckbox} /> Shoes</label><br />
        <label><input type="checkbox" name="clothings" checked={filter.clothings || false} onChange={handleCheckbox} /> Clothings</label><br />
        <label><input type="checkbox" name="accessories" checked={filter.accessories || false} onChange={handleCheckbox} /> Accessories</label>
      </div>
    </div>
  );
}

export default FilterSidebar; 