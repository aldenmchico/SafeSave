import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function SavedLoginsPage({ setLoginItem }) {
    const [localUserID, setLocalUserID] = useState(1); // Temporary 
    const [savedLogins, setSavedLogins] = useState([]);

    const location = useLocation();
    const navigate = useNavigate(); 
    const { userID: locationUserID, password } = location.state || {};

    // Use userID from location.state if available, otherwise use localUserID
    const userID = locationUserID || localUserID;

    // Load saved logins from the backend
    const loadSavedLogins = async () => {
        if (userID) {
            const url = `/login_items/users/${userID}`;
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const logins = await response.json();
                    setSavedLogins(logins);
                } else {
                    throw new Error('Failed to fetch login items');
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        loadSavedLogins();
    }, [userID]);

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
            <Link to="/createsavedlogin" state={{ userID, password }}>Add New Login</Link>
        </div>
    );
}

export default SavedLoginsPage;
