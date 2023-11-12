import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedNoteList from '../components/SavedNoteList';

function SavedNotesPage({ setNote }) {
    const [savedNotes, setSavedNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { userID, password } = location.state || {};

    // Load saved notes from the backend
    const loadSavedNotes = async (searchParam = '') => {
        if (userID) {
            const url = `http://localhost:8008/notes/users/${userID}` + (searchParam ? `?title=${searchParam}` : '');
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const notesData = await response.json();
                    setSavedNotes(notesData);
                } else {
                    throw new Error('Failed to fetch notes');
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        loadSavedNotes();
    }, [userID]);

    const handleSearch = () => {
        loadSavedNotes(searchTerm);
    };

    const deleteNoteRow = async noteID => {
        try {
            const response = await fetch(`http://localhost:8008/notes/${noteID}`, { method: 'DELETE' });
            if (response.status === 204) {
                loadSavedNotes();
                alert('Deleted Note Entry');
            } else {
                throw new Error('Failed to delete note entry');
            }
        } catch (error) {
            alert(error.message);
        }
    };

const history = useNavigate();
const editNoteRow = note => {
    setNote(note);
    history.push("/edit-note");
};

    return (
        <div>
            <h1>Your Saved Notes</h1>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
            />
            <button onClick={handleSearch}>Search</button>
            <div className="note-list">
                <SavedNoteList
                    notes={savedNotes}
                    editNote={editNoteRow}
                    deleteNote={deleteNoteRow}
                />
            </div>
            <Link to="/createsavednote" state={{ userID, password }}>Add New Note</Link>
        </div>
    );
}

export default SavedNotesPage;
