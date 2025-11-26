import React, { useEffect, useState } from "react";
import { categoryAPI } from "../api";
import "./CategorySlider.css";

const CategorySlider = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll(); // GET /category
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="loading">Loading categories...</p>;
  if (!categories.length) return <p className="loading">No categories found</p>;

  return (
    <div className="category-slider">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="category-box"
          onClick={() => onCategoryClick(cat._id)} // ← category click
        >
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="category-img" />
          ) : (
            <span className="icon">📁</span>
          )}
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategorySlider;
