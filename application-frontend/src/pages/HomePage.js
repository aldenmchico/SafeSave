import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function HomePage({ setLoginItem }) {
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);

    // Hardcoded default credentials
    const [userID, setUserID] = useState(1);
    const [userHash, setUserHash] = useState('pass1');
    const [username, setUsername] = useState('Guest');

    const location = useLocation();
    const history = useNavigate();

    console.log(location.state)

    // change later 
    useEffect(() => {
        if (!location.state) {
            loadSavedLogins();
            loadSavedNotes();
            setUsername('John Doe'); // Placeholder
        } else {
            if (location.state.userID) setUserID(location.state.userID);
            if (location.state.password) setUserHash(location.state.password);
            if (location.state.username) setUsername(location.state.username);
            loadSavedLogins();
            loadSavedNotes();
        }
    }, [location.state]);


    const loadSavedLogins = async () => {
        try {
            const response = await fetch(`/login_items/users/${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch logins');
            }
            const logins = await response.json();
            setSavedLogins(logins);
        } catch (error) {
            console.error('Failed to load logins:', error);
        }
    };

    const loadSavedNotes = async () => {
        try {
            const response = await fetch(`/notes/users/${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const notes = await response.json();
            setSavedNotes(notes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    const deleteLoginRow = async _id => {
        const response = await fetch(`/login_items/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
        } else {
            alert('Failed to Delete Login Entry');
        }
    };

    const editLoginRow = login => {
        setLoginItem(login);
        history.push("/edit-login");
    }

    return (
        <div>
            <h1>Welcome to SafeSave, {username}!</h1>
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
