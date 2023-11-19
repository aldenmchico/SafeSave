import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SavedLoginList from '../components/SavedLoginList';
import SavedNoteList from '../components/SavedNoteList';

function FavoritesPage({ setLoginItem, setNote }) {
    // Use state variable exercises to bring in the data
    const [favoriteLogins, setFavoriteLogins] = useState([]);
    const [favoriteNotes, setFavoriteNotes] = useState([]);

    // Load favorite logins from the backend
    const loadFavoriteLogins = async () => {
        const response = await fetch('/login_items/users/id/favorites');
        const logins = await response.json();
        setFavoriteLogins(logins);
    }

    // Load favorite notes from the backend
    const loadFavoriteNotes = async () => {
        const response = await fetch(`/notes/users/id/favorites`);
        const notesData = await response.json();
        setFavoriteNotes(notesData);
    }

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
