import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


const SafetyPage = () => {
    const navigate = useNavigate();
    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>Child Safety & CSAE Policy</h1>
                <p style={styles.headerSub}>
                    Last Updated: {new Date().toDateString()}
                </p>
            </div>

            {/* Content */}
            <div style={styles.container}>
                {/* Introduction */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Introduction</h2>
                    <p style={styles.text}>
                        Post24 is committed to protecting children and preventing child
                        sexual abuse and exploitation (CSAE). We maintain a strict
                        zero-tolerance policy toward any content or behavior that harms,
                        exploits, or endangers minors.
                    </p>
                </section>

                {/* Prohibited Content */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Prohibited Content</h2>
                    <ul style={styles.list}>
                        <li>Child sexual abuse material (CSAM)</li>
                        <li>Sexual or exploitative content involving minors</li>
                        <li>Child grooming, harassment, or abuse</li>
                    </ul>
                </section>

                {/* Safety Measures */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Safety Measures</h2>
                    <ul style={styles.list}>
                        <li>In-app reporting system for harmful or abusive content</li>
                        <li>Immediate review and removal of reported violations</li>
                        <li>Suspension or termination of offending accounts</li>
                        <li>Cooperation with law enforcement agencies when required</li>
                    </ul>
                </section>

                {/* Reporting Button */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Report Unsafe Content</h2>
                    <p style={styles.text}>
                        Users can report content that violates child safety directly in the
                        app. Click the button below to open the report form.
                    </p>
                    <button
                        style={styles.reportButton}
                        onClick={() => navigate("/contact")}
                    >
                        Report Unsafe Content
                    </button>
                </section>

                {/* Reporting Contact */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Contact</h2>
                    <p style={styles.text}>
                        For any child safety concerns, you can contact us directly at:
                        <br />
                       
                    </p>
                </section>

                {/* Legal Compliance */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Legal Compliance</h2>
                    <p style={styles.text}>
                        Post24 complies with all applicable child safety laws and reports
                        confirmed child sexual abuse material (CSAM) to relevant regional
                        and national authorities as required by law.
                    </p>
                </section>
                <section style={styles.section}>
                    <h2 style={styles.heading}>Contact for Child Safety</h2>
                    <p style={styles.text}>
                        The designated point of contact must be ready and able to speak about your app's child sexual abuse material (CSAM) prevention practices and compliance.
                    </p>
                    <p style={styles.text}>
                        <strong>Email:</strong> someshk526@gmail.com
                    </p>
                    <p style={styles.text}>
                        POST24 allows users to report child safety concerns in-app. To learn more about reporting requirements, visit the Help Center.
                    </p>
                    <p style={styles.text}>
                        My app complies with all relevant child safety laws, and reports to regional and national authorities.
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
        fontFamily: "Arial, sans-serif",
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
        lineHeight: "1.7",
    },
    section: {
        marginBottom: "30px",
    },
    heading: {
        color: "#007bff",
        marginBottom: "10px",
        textAlign: "center",
    },
    text: {
        color: "#666",
        marginBottom: "10px",
    },
    list: {
        paddingLeft: "20px",
        color: "#666",
        lineHeight: "1.6",
    },
    reportButton: {
        backgroundColor: "#ff4d4f",
        color: "#fff",
        padding: "12px 25px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px",
    },
};

export default SafetyPage;
