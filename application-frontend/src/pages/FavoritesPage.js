import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FavoritesPage() {
    const [favoriteLogins, setFavoriteLogins] = useState([]);
    const [favoriteNotes, setFavoriteNotes] = useState([]);
    const [favoritePayments, setFavoritePayments] = useState([]);
    const [favoriteIDs, setFavoriteIDs] = useState([]);

    // Load favorite logins from the backend
    const loadFavoriteLogins = async () => {
        const response = await fetch('http://localhost:8008/favorites/logins');
        const logins = await response.json();
        setFavoriteLogins(logins);
    }

    // Load favorite notes from the backend
    const loadFavoriteNotes = async () => {
        const response = await fetch('http://localhost:8008/favorites/notes');
        const notesData = await response.json();
        setFavoriteNotes(notesData);
    }

    // Load favorite payments from the backend
    const loadFavoritePayments = async () => {
        const response = await fetch('http://localhost:8008/favorites/payments');
        const paymentData = await response.json();
        setFavoritePayments(paymentData);
    }

    // Load favorite IDs from the backend
    const loadFavoriteIDs = async () => {
        const response = await fetch('http://localhost:8008/favorites/ids');
        const idsData = await response.json();
        setFavoriteIDs(idsData);
    }

    useEffect(() => {
        loadFavoriteLogins();
        loadFavoriteNotes();
        loadFavoritePayments();
        loadFavoriteIDs();
    }, []);

    return (
        <div>
            <h1>Your Favorites</h1>
            <p>Quickly access your most important or frequently used items.</p>

            <div>
                <h2>Favorite Logins</h2>
                <ul>
                    {favoriteLogins.map(login => (
                        <li key={login._id}>
                            {login.name}
                            <Link to={`/logins/${login._id}`}>View</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Favorite Notes</h2>
                <ul>
                    {favoriteNotes.map(note => (
                        <li key={note._id}>
                            {note.title}
                            <Link to={`/notes/${note._id}`}>View</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FavoritesPage;
