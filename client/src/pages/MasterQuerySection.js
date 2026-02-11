import React, { useEffect, useState } from "react";
import { queryAPI } from "../api";
import "./MasterQuerySection.css";

const MasterQuerySection = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState({}); // local state for status/reply edits

  const loadQueries = async () => {
    try {
      const res = await queryAPI.getAllQueries();
      setQueries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleChange = (id, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    try {
      const updateData = updates[id];
      if (!updateData) return;

      await queryAPI.updateQuery(id, updateData);
      loadQueries();
      setUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[id];
        return newUpdates;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="master-query-list">
      <h2>All User Queries</h2>
      {queries.length === 0 && <p>No queries available</p>}
      {queries.map((q) => {
        const localUpdate = updates[q._id] || {};
        return (
          <div key={q._id} className="master-query-card">
            <p><strong>User:</strong> {q.user?.name || "Guest"}</p>
            <p><strong>Query:</strong> {q.message}</p>

            <div className="status-update">
              <label>Status:</label>
              <select
                value={localUpdate.status ?? q.status}
                onChange={(e) => handleChange(q._id, "status", e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="admin-reply">
              <label>Admin Reply:</label>
              <textarea
                rows={2}
                value={localUpdate.adminReply ?? q.adminReply}
                onChange={(e) => handleChange(q._id, "adminReply", e.target.value)}
              />
            </div>

            <button onClick={() => handleSave(q._id)}>Save</button>
          </div>
        );
      })}
    </div>
  );
};

export default MasterQuerySection;
