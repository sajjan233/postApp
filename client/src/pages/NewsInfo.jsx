import React, { useState } from "react";

const NewsContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const articles = [
    {
      title: "Post24 Launches New Feature",
      date: "Jan 2, 2026",
      author: "Sajjan Kumar",
    }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    // later: connect API / email service here
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Contact & News Info</h1>
      </header>

      {/* CONTACT SECTION */}
      <section style={styles.section}>
        <h2>Contact Us</h2>

        {/* Visible Contact Info (IMPORTANT) */}
 

        {/* CONTACT FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Send Message
          </button>
        </form>
      </section>

      {/* NEWS SECTION */}
      <section style={styles.section}>
        <h2>Recent News / Articles</h2>
        {articles.map((a, idx) => (
          <div key={idx} style={styles.article}>
            <h3>{a.title}</h3>
            <p>Date: {a.date}</p>
            <p>Author: {a.author}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "32px", color: "#007bff" },
  section: { marginBottom: "40px" },

  form: {
    marginTop: "20px",
    maxWidth: "500px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "100px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  article: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default NewsContactPage;
