import React, { useEffect, useState } from "react";
import { categoryAPI } from "../api";
import "./CategorySlider.css";


const CategorySlider = ({ categories = [], onCategoryClick, activeCategory }) => {
  if (!categories.length) return <p className="loading">No categories found</p>;

  return (
    <div className="category-slider">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className={`category-box ${activeCategory === cat._id ? "active" : ""}`}
          onClick={() => onCategoryClick(cat)}
        >
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="category-img" />
          ) : (
            <span className="icon"></span>
          )}
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategorySlider;


// export default CategorySlider;
