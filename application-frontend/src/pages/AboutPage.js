import React from 'react';

const styles = {
    container: { padding: '0 15px' },
    section: { marginBottom: '20px' },
    list: { listStyleType: 'none', paddingLeft: 0 },
    listItem: { marginBottom: '5px' }
};

function AboutPage() {
    return (
        <div style={styles.container}>
            <h1>About SafeSave</h1>
            <p>SafeSave is a state-of-the-art password manager dedicated to safeguarding your digital life. Our mission is to make online security accessible, straightforward, and efficient for everyone.</p>
            <section style={styles.section}>
                <h2>Features</h2>
                <ul style={styles.list}>
                    <li style={styles.listItem}>End-to-end encryption.</li>
                    <li style={styles.listItem}>Two-factor authentication.</li>
                    <li style={styles.listItem}>User-friendly interface.</li>
                </ul>
            </section>
            <section style={styles.section}>
                <h2>Our Team</h2>
                <p>The SafeSave team consists of dedicated professionals passionate about online security and user experience. We're committed to providing you with the best password manager available.</p>
            </section>
            <section style={styles.section}>
                <h2>Contact Us</h2>
                <p>If you have any questions, feedback, or concerns, please <a href="mailto:support@safesave.com">contact us</a>.</p>
            </section>
        </div>
    );
}

export default AboutPage;
