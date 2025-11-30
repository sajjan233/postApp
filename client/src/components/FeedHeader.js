import React, { useState, useEffect } from "react";
import { categoryAPI } from "../api";
import CategorySlider from "./CategorySlider";
import "./FeedHeader.css";

const FeedHeader = ({ activeCategory, onCategorySelect, onCategoryStory, openMenu }) => {
  const [categories, setCategories] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll(); // GET /category
        setCategories(res.data.categories || res.data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  // Hide header on scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowHeader(false);
      else setShowHeader(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCategoryClick = (cat) => {
    if (onCategorySelect) onCategorySelect(cat._id);
    if (onCategoryStory) onCategoryStory(cat._id);
  };

  return (
    <div className={`feed-header ${showHeader ? "show" : "hide"}`}>
      <CategorySlider
        categories={categories}
        onCategoryClick={handleCategoryClick}
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
