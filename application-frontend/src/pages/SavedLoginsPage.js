// SavedLoginsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SavedLoginsPage() {
    const [savedLogins, setSavedLogins] = useState([]);

    // Placeholder 
    const loadSavedLogins = async () => {
        const loginsData = [
            { _id: '1', name: 'Email', username: 'user1@example.com' },
            { _id: '2', name: 'Facebook', username: 'user1' },
            { _id: '3', name: 'Twitter', username: 'user1' },
            { _id: '4', name: 'Instagram', username: 'user1' },
            { _id: '5', name: 'Reddit', username: 'user1' },
        ];
        setSavedLogins(loginsData);
    };

    const deleteLogin = (id) => {
        // Placeholder
        const updatedLogins = savedLogins.filter(login => login._id !== id);
        setSavedLogins(updatedLogins);
    };

    useEffect(() => {
        loadSavedLogins();
    }, []);

    return (
        <div>
            <h1>Your Saved Logins</h1>
            <ul>
                {savedLogins.map(login => (
                    <li key={login._id}>
                        {login.name} - {login.username}
                        <button onClick={() => deleteLogin(login._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Link to="/createsavedlogin">Add New Login</Link>
        </div>
    );
}

export default SavedLoginsPage;
