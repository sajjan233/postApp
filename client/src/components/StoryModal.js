import React, { useState, useEffect, useRef } from "react";
import "./StoryModal.css";
const API_URL = process.env.REACT_APP_API_URL
const StoryModal = ({ stories = [], initialIndex = 0, onClose }) => {
  console.log("storiesstories",stories);
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const timeoutRef = useRef(null);

  const currentStory = stories[currentIndex];

  // Auto-play logic
  useEffect(() => {
    if (!currentStory) return;

    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 150000); // 5 seconds per story

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
    else onClose(); // last story closes modal
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!currentStory) return null;

  return (
    <div className="story-modal-overlay" onClick={onClose}>
      <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Top Bar: User info + Progress */}
        <div className="story-top-bar">
          <div className="story-user">
            <img
              src={currentStory.adminId.avatar || "/default-avatar.png"}
              alt={currentStory.adminId.name}
              className="story-avatar"
            />
            <span>{currentStory.adminId.name}</span>
          </div>

          <div className="story-progress">
            {stories.map((_, idx) => (
              <div
                key={idx}
                className={`story-progress-bar ${idx <= currentIndex ? "filled" : ""}`}
              ></div>
            ))}
          </div>

          <button className="story-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Story Content */}
        <div className="story-content">
          <img src={`${API_URL}${currentStory.images[0]}`} alt={currentStory.title} />
          <div className="story-title">{currentStory.title}</div>
          <div className="story-description">{currentStory.description}</div>
        </div>

        {/* Navigation Areas */}
        <div className="story-nav left" onClick={handlePrev}></div>
        <div className="story-nav right" onClick={handleNext}></div>
      </div>
    </div>
  );
};

export default StoryModal;
