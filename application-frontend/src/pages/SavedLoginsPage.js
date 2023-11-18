import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function SavedLoginsPage({ setLoginItem }) {
    const [savedLogins, setSavedLogins] = useState([]);
    const navigate = useNavigate();

    // Load saved logins from the backend
    const loadSavedLogins = async () => {

        try {
            const response = await fetch('/login_items/users/userID');
            if (response.ok) {
                const logins = await response.json();
                setSavedLogins(logins);
            } else if (response.status === 404) {
                console.log('Response code in loadSavedLogins is 404 - nothing to return. Dont worry about this 404 Error code.');
                setSavedLogins([]); 
                return;
            }   
            else {
                throw new Error('Failed to fetch login items');
            }
        } catch (error) {
            alert(error.message);
        }
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

    const editLoginRow = login => {
        setLoginItem(login);
        navigate("/edit-login");
    }

    return (
        <div>
            <h1>Your Saved Logins</h1>
            <div className="login-item-list">
                <SavedLoginList
                    loginItems={savedLogins}
                    editLoginItem={editLoginRow}
                    deleteLoginItem={deleteLoginRow}
                />
            </div>
            <Link to="/createsavedlogin">Add New Login</Link>
        </div>
    );
}

export default SavedLoginsPage;
