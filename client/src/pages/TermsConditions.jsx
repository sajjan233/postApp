import React from "react";

const TermsConditions = () => {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Terms & Conditions</h1>
        <p style={styles.headerSub}>
          Last Updated: {new Date().toDateString()}
        </p>
      </div>

      <div style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.heading}>Acceptance of Terms</h2>
          <p style={styles.text}>
            By accessing or using Post24, you agree to follow these Terms &
            Conditions.
          </p>
          <p style={styles.text}>
            If you do not agree, please discontinue use of the service.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Eligibility</h2>
          <p style={styles.text}>
            Users must be at least 13 years old to use Post24.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>User Accounts</h2>
          <p style={styles.text}>
            Users are responsible for maintaining the confidentiality of their
            login details.
          </p>
          <p style={styles.text}>
            Misuse may result in suspension or termination.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Admin & QR Code System</h2>
          <p style={styles.text}>
            Admins share only official or work-related posts through the app.
          </p>
          <p style={styles.text}>
            Admin connections are created only by scanning valid Admin QR codes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Limitation of Liability</h2>
          <p style={styles.text}>
            Post24 is not liable for any indirect or consequential damages.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Governing Law</h2>
          <p style={styles.text}>
            These terms are governed by the laws of India.
          </p>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#ffffff",
    color: "#333",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px 20px",
    textAlign: "center",
    color: "#fff",
  },
  headerTitle: {
    margin: 0,
    fontSize: "36px",
  },
  headerSub: {
    marginTop: "8px",
    color: "#e0e0e0",
  },
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px 40px",
  },
  section: {
    marginBottom: "30px",
  },
  heading: {
    color: "#007bff",
    marginBottom: "10px",
  },
  text: {
    color: "#666",
    lineHeight: "1.7",
  },
};

export default TermsConditions;
