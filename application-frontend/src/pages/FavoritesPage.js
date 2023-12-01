import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';
import SavedNoteList from '../components/SavedNoteList';

function FavoritesPage({ setLoginItem, setNote }) {
    // Use state variable exercises to bring in the data
    const [favoriteLogins, setFavoriteLogins] = useState([]);
    const [favoriteNotes, setFavoriteNotes] = useState([]);
    const [invalidCookie, setInvalidCookie] = useState(false);

    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);

    // Load favorite logins from the backend
    const loadFavoriteLogins = async () => {
        try {
            const response = await fetch('/login_items/users/id/favorites');
            if (response.ok) {
                const logins = await response.json();
                setFavoriteLogins(logins);
            } else if (response.status === 404) {
                console.log('Response code in loadFavoritesLogin is 404 - nothing to return. Dont worry about this 404 Error code.');
                setFavoriteLogins([]);
                return;
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else {
                throw new Error('Failed to fetch favorite login items');
            }
        } catch (error) {
            console.log(error.message);
            if(!invalidCookie){
                setInvalidCookie(true)
            }
        }
    };

    // Load favorite notes from the backend
    const loadFavoriteNotes = async () => {
        try {
            const response = await fetch(`/notes/users/id/favorites`);
            if (response.ok) {
                const notesData = await response.json();
                setFavoriteNotes(notesData);
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else if (response.status === 404) {
                console.log('Response code in loadFavoriteNotes is 404 - nothing to return. Dont worry about this 404 Error code.');
                setFavoriteNotes([]);
                return;
            }
            else {
                throw new Error('Failed to fetch favorite note items');
            }
        } catch (error) {
            console.log(error.message);
            if(!invalidCookie){
                setInvalidCookie(true)
            }
        }
    };

    useEffect(() => {
        loadFavoriteLogins();
        loadFavoriteNotes();
    }, []);

    const deleteLoginRow = async _id => {
        const response = await fetch(`/login_items/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadFavoriteLogins();
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Login Entry');
        }
    }

    // DELETE a row
    const deleteNoteRow = async _id => {
        const response = await fetch(`/notes/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadFavoriteNotes();
            alert('Deleted Note Entry');
        } else {
            alert('Failed to Delete Note Entry');
        }
    }

    // UPDATE a row
    const navigate = useNavigate();
    const editLoginRow = async login => {
        setLoginItem(login);
        navigate("/edit-login");
    }

    const editNoteRow = async note => {
        setNote(note);
        navigate("/edit-note");
    }

    return (
        <div>
            <h1>Your Favorites</h1>
            <p>Quickly access your most important or frequently used items.</p>

            <div>
                <h2>Favorite Logins</h2>
                <div className="login-item-list">
                    <SavedLoginList
                        loginItems={favoriteLogins}
                        editLoginItem={editLoginRow}
                        deleteLoginItem={deleteLoginRow}
                    />
                </div>
                <Link to="/createsavedlogin">Add New Login</Link>
            </div>

            <div>
                <h2>Favorite Notes</h2>
                <div className="note-list">
                    <SavedNoteList
                        notes={favoriteNotes}
                        editNote={editNoteRow}
                        deleteNote={deleteNoteRow}
                    />
                </div>
                <Link to="/createsavednote" >Add New Note</Link>
            </div>
        </div>
    );
}

export default FavoritesPage;
