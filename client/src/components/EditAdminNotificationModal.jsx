import React, { useState, useEffect } from "react";
import { adminAPI } from "../api";
import "./EditAdminNotificationModal.css";

const EditAdminNotificationModal = ({ admin, onClose, onUpdated }) => {
  const [isActive, setIsActive] = useState(false);
  const [maxPerPost, setMaxPerPost] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sub = admin.notificationSubscription || {};
    setIsActive(!!sub.isActive);
    setMaxPerPost(sub.maxNotificationPerPostPerDay || 0);
    setStartDate(sub.startDate ? sub.startDate.slice(0, 10) : "");
    setEndDate(sub.endDate ? sub.endDate.slice(0, 10) : "");
  }, [admin]);

  const handleSave = async () => {
    if (isActive) {
      if (!startDate || !endDate) {
        alert("Start date and End date required");
        return;
      }
      if (endDate < startDate) {
        alert("End date cannot be before start date");
        return;
      }
    }

    try {
      setLoading(true);

      await adminAPI.updateNotificationSubscription(admin._id, {
        isActive,
        maxNotificationPerPostPerDay: Number(maxPerPost),
        startDate: isActive ? startDate : null,
        endDate: isActive ? endDate : null
      });

      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Notification Subscription</h3>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Notification Active
        </label>

        <label>
          Max notifications per post (24h)
          <input
            type="number"
            min="0"
            disabled={!isActive}
            value={maxPerPost}
            onChange={(e) => setMaxPerPost(e.target.value)}
          />
        </label>

        <label>
          Start Date
          <input
            type="date"
            disabled={!isActive}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            disabled={!isActive}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdminNotificationModal;
