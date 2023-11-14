import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Import React components
import SavedLoginList from '../components/SavedLoginList';


function HomePage({setLoginItem}) {

    // Use state variable exercises to bring in the data
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);

    // When the homepage is loaded, the userID and userHash to be used for encryption/decryption are defined
    const [userID, setUserID] = useState(1);
    const [userHash, setUserHash] = useState('pass1');
    const [username, setUsername] = useState('Guest');

    // Load saved logins from the backend
    const loadSavedLogins = async () => {
        const response = await fetch(`/login_items/users/${userID}`);
        const logins = await response.json();
        setSavedLogins(logins);
    }

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        const response = await fetch(`/notes/users/${userID}`);
        const notesData = await response.json();
        setSavedNotes(notesData);
    }

    useEffect(() => {
        if (savedLogins.length !==0) {loadSavedLogins()};
        if (savedNotes.length !== 0) {loadSavedNotes()};
        // Fetch username later
        setUsername('John Doe'); // Placeholder
    }, []);

    const deleteLoginRow = async _id => {
        const response = await fetch(`/login_items/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    }

    // UPDATE a row
    const navigate = useNavigate();
    const editLoginRow = async login => {
        setLoginItem(login);
        navigate("/edit-login");
    }

    const favoriteLoginRow = async login => {
    }

    return (
        <div>
            <h1>Welcome to SafeSave, {username}!</h1> {/* Dynamic welcome message */}
            <p>Your secure vault for online credentials and notes.</p>
            <div className="content-section">
                <h2>Your Saved Logins</h2>
                <div className="login-item-list">

                <SavedLoginList
                    loginItems={savedLogins}
                    editLoginItem={editLoginRow}
                    deleteLoginItem = {deleteLoginRow}
                    favoriteLoginItem = {favoriteLoginRow}
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