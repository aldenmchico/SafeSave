import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import React components
import SavedLoginList from '../components/SavedLoginList';

function HomePage({ userID, password, username, setLogin }) {
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const userHash = 'pass1'; // Hardcoded 

    // Load saved logins from the backend
    const loadSavedLogins = async () => {
        try {
            const response = await fetch(`http://localhost:8008/login_items/users/${userID}`);
            const logins = await response.json();
            setSavedLogins(logins);
        } catch (error) {
            console.error('Failed to load logins:', error);
        }
    };

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        try {
            const response = await fetch(`http://localhost:8008//notes/users/${userID}`);
            const notesData = await response.json();
            setSavedNotes(notesData);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    useEffect(() => {
        loadSavedLogins();
        loadSavedNotes();
    }, [userID]);

    const deleteLoginRow = async _id => {
        const response = await fetch(`http://localhost:8008/logins/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    }

    const history = useNavigate();
    const editLoginRow = async login => {
        setLogin(login);
        history.push("/edit-login");
    }

    return (
        <div>
            <h1>Welcome to SafeSave, {username}!</h1> {/* Dynamic welcome message using username */}
            <p>Your secure vault for online credentials and notes.</p>
            <div className="content-section">
                <h2>Your Saved Logins</h2>
                <div className="login-item-list">
                    <SavedLoginList
                        loginItems={savedLogins}
                        editLoginItem={editLoginRow}
                        deleteLoginItem={deleteLoginRow}
                    />
                </div>
                <Link to="/createsavedlogin">Add New Login</Link>
            </div>

            <div className="content-section">
                <h2>Quick Summary</h2>
                <p>You have {savedLogins.length} saved logins and {savedNotes.length} saved notes.</p>
            </div>

            <section className="content-section">
                <h2>Why Use SafeSave?</h2>
                <p>With SafeSave, you can securely store your passwords and ensure they're always at your fingertips. Never forget a password again!</p>
            </section>
        </div>
    );
}

export default HomePage;
