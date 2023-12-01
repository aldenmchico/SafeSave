import React from 'react';

const styles = {
    container: { padding: '0 30px' },
    section: { marginBottom: '40px' },
    list: { listStyleType: 'none', paddingLeft: 0 },
    listItem: { marginBottom: '10px' },
    teamMemberSection: { marginBottom: '10px'},
    teamMemberTitle: { color: 'black' },
    teamMemberDescription: { fontStyle: 'italic' }
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
                <div style={styles.teamMemberSection}>
                    <h3 style={styles.teamMemberTitle}>Alden Chico - Database Engineer</h3>
                    <p style={styles.teamMemberDescription}>Alden innovative approach to data modeling and efficiency played a pivotal role in ensuring high performance and security.</p>
                </div>
                <div style={styles.teamMemberSection}>
                    <h3 style={styles.teamMemberTitle}>Austin Mangel - Backend Engineer</h3>
                    <p style={styles.teamMemberDescription}>Austin implemented sophisticated encryption algorithms that form the backbone of SafeSave's security.</p>
                </div>
                <div style={styles.teamMemberSection}>
                    <h3 style={styles.teamMemberTitle}>Sean Madden - Frontend Developer</h3>
                    <p style={styles.teamMemberDescription}>Sean helped with creating the user interface and graphical foundation that is the project's website.</p>
                </div>
                <div style={styles.teamMemberSection}>
                    <h3 style={styles.teamMemberTitle}>Eugene Song - Integration Specialist</h3>
                    <p style={styles.teamMemberDescription}>Eugene seamlessly integrated various components together and kept the everything working in harmony.</p>
                </div>
            </section>
            <section style={styles.section}>
                <h2>Contact Us</h2>
                <p>If you have any questions, feedback, or concerns, please <a href="mailto:safesavehelp@gmail.com">contact us</a>.</p>
            </section>
        </div>
    );
}

export default AboutPage;
