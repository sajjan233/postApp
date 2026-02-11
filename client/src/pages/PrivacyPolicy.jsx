import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Privacy Policy</h1>
        <p style={styles.headerSub}>
          Last Updated: {new Date().toDateString()}
        </p>
      </div>

      {/* Content */}
      <div style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.heading}>Introduction</h2>
          <p style={styles.text}>
            Post24 is operated by <strong>Sajjan Kumar</strong>. We respect your
            privacy and are committed to protecting your personal information.
          </p>
          <p style={styles.text}>
            By using the Post24 app or website, you agree to this Privacy Policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Information We Collect</h2>
          <p style={styles.text}>
            We collect basic information such as name, mobile number, email
            address, and login details to manage user accounts securely.
          </p>
          <p style={styles.text}>
            Limited technical data may be collected to improve app performance
            and security.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Camera & QR Code Usage</h2>
          <p style={styles.text}>
            Camera access is used only to scan Admin QR codes that contain a
            unique Admin ID for secure connection.
          </p>
          <p style={styles.text}>
            No photos or videos are stored or shared from your device.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Data Sharing</h2>
          <p style={styles.text}>
            Post24 does not share user data with any third-party services.
          </p>
          <p style={styles.text}>
            Data is shared only when required by law or legal authorities.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Data Security</h2>
          <p style={styles.text}>
            We use JWT-based authentication and secure APIs to protect user data.
          </p>
          <p style={styles.text}>
            Access to sensitive data is strictly limited.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Children’s Privacy</h2>
          <p style={styles.text}>
            Post24 is not intended for users under the age of 13.
          </p>
        </section>

        {/* 🔒 CHILD SAFETY & CSAE SECTION (IMPORTANT) */}
        <section style={styles.section} id="child-safety">
          <h2 style={styles.heading}>Child Safety & CSAE Policy</h2>

          <p style={styles.text}>
            Post24 is committed to protecting children and preventing child
            sexual abuse and exploitation (CSAE). We maintain a strict
            zero-tolerance policy toward any content or behavior that harms,
            exploits, or endangers minors.
          </p>

          <h3 style={styles.subHeading}>Prohibited Content</h3>
          <ul style={styles.list}>
            <li>Child sexual abuse material (CSAM)</li>
            <li>Sexual or exploitative content involving minors</li>
            <li>Child grooming, harassment, or abuse</li>
          </ul>

          <h3 style={styles.subHeading}>Safety Measures</h3>
          <ul style={styles.list}>
            <li>In-app reporting system for harmful or abusive content</li>
            <li>Immediate review and removal of reported violations</li>
            <li>Suspension or termination of offending accounts</li>
            <li>Cooperation with law enforcement agencies when required</li>
          </ul>

          <h3 style={styles.subHeading}>Reporting Child Safety Concerns</h3>
          <p style={styles.text}>
            Users can report child safety concerns directly within the Post24 app
            using the report feature or by contacting us at:
            <br />
            <strong>Email:</strong> someshk526@gmail.com
          </p>

          <h3 style={styles.subHeading}>Legal Compliance</h3>
          <p style={styles.text}>
            Post24 complies with all applicable child safety laws and reports
            confirmed child sexual abuse material (CSAM) to relevant regional and
            national authorities as required by law.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Contact</h2>
          <p style={styles.text}>
            <strong>Name:</strong> Sajjan Kumar <br />
            <strong>Email:</strong> sajjankumarhsr23@gmail.com
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
  subHeading: {
    marginTop: "15px",
    color: "#444",
  },
  text: {
    color: "#666",
    lineHeight: "1.7",
    marginBottom: "10px",
  },
  list: {
    paddingLeft: "20px",
    color: "#666",
    lineHeight: "1.6",
  },
};

export default PrivacyPolicy;
