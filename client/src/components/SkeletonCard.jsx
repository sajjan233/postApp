import React from 'react';
import '../styles.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-media"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-line skeleton-description short"></div>
        <div className="skeleton-meta">
          <div className="skeleton-line skeleton-date"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;


