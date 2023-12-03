import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function HomePage({ setLoginItem }) {
    const [savedLogins, setSavedLogins] = useState([]);
    const [savedNotes, setSavedNotes] = useState([]);

    const navigate = useNavigate();
    const [invalidCookie, setInvalidCookie] = useState(false);

    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);

    useEffect(() => {
        loadSavedLogins();
        loadSavedNotes();
    }, []);


    const loadSavedLogins = async () => {
        try {
            const response = await fetch('/login_items/users/userID');

        if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else if (!response.ok) {
                setSavedLogins([])
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
            const response = await fetch('/notes/users/userID');
            if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else if (!response.ok) {
                setSavedNotes([])
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

    const editLoginRow = async login => {
        setLoginItem(login);
        navigate("/edit-login");
    }

    return (
        <div>
            <h1>Welcome to SafeSave!!!</h1>
            <p>Your secure vault for online credentials and notes.</p>

            <div className="content-section">
                <h2>Your Saved Logins</h2>
                <div className="login-item-list">
                    <SavedLoginList
                        loginItems= {savedLogins}
                        editLoginItem={editLoginRow}
                        deleteLoginItem={deleteLoginRow}
                    />
                </div>
                <Link to="/createsavedlogin">Add New Login</Link>
            </div>

            <div className="content-section">
                <h2>Quick Summary</h2>
                <p>
                    You have {savedLogins.length === 1 ? '1 saved login' : `${savedLogins.length} saved logins`} and {savedNotes.length === 1 ? '1 saved note' : `${savedNotes.length} saved notes`}.
                </p>
            </div>

            <section className="content-section">
                <h2>Why Use SafeSave?</h2>
                <p>With SafeSave, you can securely store your passwords and ensure they're always at your fingertips. Never forget a password again!</p>
            </section>
        </div>
    );
}

export default HomePage;
