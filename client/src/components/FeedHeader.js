import React, { useState, useEffect } from "react";
import { categoryAPI } from "../api";
import CategorySlider from "../components/CategorySlider";
import "./FeedHeader.css";

const FeedHeader = ({ openMenu, onCategorySelect, activeCategory }) => {
  const [categories, setCategories] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll(); // GET /category
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  // Scroll up/down header logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowHeader(false);
      else setShowHeader(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`feed-header ${showHeader ? "show" : "hide"}`}>
      <CategorySlider
        categories={categories}
  onCategoryClick={onCategorySelect} // ← MUST match CategorySlider
  activeCategory={activeCategory}
      />
      <div className="menu-icon" onClick={openMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default FeedHeader;
