import React, { useState } from "react";
import { queryAPI } from "../api";
import './AddQuery.css'
const AddQuery = ({ onSuccess }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitQuery = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter your query");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await queryAPI.createQuery({ message });

      setMessage("");
      onSuccess && onSuccess();

    } catch (err) {
      setError("Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-box">
      <h3>Submit Your Query</h3>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submitQuery}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your query..."
          rows={4}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddQuery;
