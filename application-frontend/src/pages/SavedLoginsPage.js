import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function SavedLoginsPage({ setLoginItem }) {
    const [userID, setUserID] = useState(1);
    const [savedLogins, setSavedLogins] = useState([]);

    const loadSavedLogins = async () => {
        const response = await fetch(`/login_items/users/${userID}`);
        const logins = await response.json();
        setSavedLogins(logins);
    };

    useEffect(() => {
        loadSavedLogins();
    }, []);

    const deleteLoginRow = async _id => {
        const response = await fetch(`/login_items/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    };

    const navigate = useNavigate();

    const editLoginRow = async login => {
        setLoginItem(login);
        navigate("/edit-login");
    };

    return (
        <div>
            <h1>Your Saved Logins</h1>
            <div className="login-item-list">
                {savedLogins !== null && savedLogins.length > 0 ? (
                    <SavedLoginList
                        loginItems={savedLogins}
                        editLoginItem={editLoginRow}
                        deleteLoginItem={deleteLoginRow}
                    />
                ) : (
                    <p> </p>
                )}
            </div>
            <Link to="/createsavedlogin">Add New Login</Link>
        </div>
    );
}

export default SavedLoginsPage;
