import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';

function SavedLoginsPage( setLogin) {
    const [savedLogins, setSavedLogins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const history = useNavigate(); 
    const { userID, password } = location.state || {};

    // Load saved logins from the backend
    const loadSavedLogins = async (searchParam = '') => {
        if (userID) {
            const url = `http://localhost:8008/login_items/users/${userID}` + (searchParam ? `?search=${searchParam}` : '');
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

    const handleSearch = () => {
        loadSavedLogins(searchTerm);
    };

    const deleteLoginRow = async loginID => {
        try {
            const response = await fetch(`http://localhost:8008/login_items/${loginID}`, { method: 'DELETE' });
            if (response.status === 204) {
                loadSavedLogins();
                alert('Deleted Login Entry');
            } else {
                throw new Error('Failed to delete login entry');
            }
        } catch (error) {
            alert(error.message);
        }
    };
    
    // UPDATE a row
    const editLoginRow = async login => {
        setLogin(login);
        history.push("/edit-login");
    }

    return (
        <div>
            <h1>Your Saved Logins</h1>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logins..."
            />
            <button onClick={handleSearch}>Search</button>
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
