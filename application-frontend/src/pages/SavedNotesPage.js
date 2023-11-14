import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedNoteList from '../components/SavedNoteList';

function SavedNotesPage({ setNote }) {
    const [savedNotes, setSavedNotes] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Default values
    const defaultUserID = 1; 
    const defaultPassword = 'pass1'; 

    // Use location.state if available, otherwise fall back to default values
    const userID = location.state?.userID || defaultUserID;
    const password = location.state?.password || defaultPassword;

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        if (userID) {
            const url = `notes/users/${userID}`;
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

    const deleteNoteRow = async noteID => {
        try {
            const response = await fetch(`/notes/${noteID}`, { method: 'DELETE' });
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

    const editNoteRow = note => {
        setNote(note);
        navigate("/edit-note");
    };

    return (
        <div>
            <h1>Your Saved Notes</h1>
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
