import React, { useEffect, useState } from "react";
import { queryAPI } from "../api";
import "./MyQueries.css";

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQueries = async () => {
    try {
      const res = await queryAPI.getMyQueries();
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="query-list">
      <h3>My Queries</h3>

      {queries.length === 0 && <p>No queries yet</p>}

      {queries.map((q) => (
        <div key={q._id} className="query-card">
          <p><strong>Query:</strong> {q.message}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${q.status}`}>
              {q.status.toUpperCase()}
            </span>
          </p>

          {q.adminReply && (
            <div className="reply-box">
              <strong>Admin Reply:</strong>
              <p>{q.adminReply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyQueries;
