import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

// Import React components
import SavedLoginList from '../components/SavedLoginList';

function HomePage({ setLogin }) {
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true); // State to manage data loading

    const location = useLocation();
    const { userID, password, username } = location.state || {};
    const history = useNavigate();

    // Redirect to login if userID or password is not available
    useEffect(() => {

        
        
        if (!userID || !password) {
            // history('/login');
            console.log("Placeholder");
        } else {
            loadSavedLogins();
            loadSavedNotes();
        }
    }, [userID, password, history]);

    const loadSavedLogins = async () => {
        setIsDataLoading(true); // Set loading state
        try {
            const response = await fetch(`http://localhost:8008/login_items/users/${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch logins');
            }
            const logins = await response.json();
            setSavedLogins(logins);
        } catch (error) {
            console.error('Failed to load logins:', error);
        } finally {
            setIsDataLoading(false); // Reset loading state
        }
    };

    const loadSavedNotes = async () => {
        try {
            const response = await fetch(`http://localhost:8008/notes/users/${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const notesData = await response.json();
            setSavedNotes(notesData);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    const deleteLoginRow = async _id => {
        const response = await fetch(`http://localhost:8008/logins/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    };

    const editLoginRow = async login => {
        setLogin(login);
        history.push("/edit-login");
    };

    if (isDataLoading) {
        return <div>Loading your data...</div>;
    }

    return (
        <div>
            <h1>Welcome to SafeSave, {username}!</h1>
            <p>Your secure vault for online credentials and notes.</p>

            {/* Links to other pages, passing userID and password as state */}
            <div>
                <Link to={{ pathname: "/saved-logins", state: { userID, password } }}>Saved Logins</Link>
                <Link to={{ pathname: "/saved-notes", state: { userID, password } }}>Saved Notes</Link>
                <Link to={{ pathname: "/create-saved-login", state: { userID, password } }}>Create Saved Login</Link>
                <Link to={{ pathname: "/create-saved-note", state: { userID, password } }}>Create Saved Note</Link>
                <Link to={{ pathname: "/favorites", state: { userID, password } }}>Favorites</Link>
            </div>

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
