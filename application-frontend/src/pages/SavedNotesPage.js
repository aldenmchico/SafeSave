import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SavedNoteList from '../components/SavedNoteList';

function SavedNotesPage({ setNote }) {
    // Use state variable savedNotes to store the fetched notes data
    const [savedNotes, setSavedNotes] = useState([]);

    // When the homepage is loaded, the userID and userHash to be used for encryption/decryption are defined
    const [userID, setUserID] = useState(1);
    const [userHash, setUserHash] = useState('pass1');
    const [username, setUsername] = useState('Guest');

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        const response = await fetch(`/notes/users/${userID}`);
        const notesData = await response.json();
        setSavedNotes(notesData);
    }

    useEffect(() => {
        loadSavedNotes();
    }, []);

    // DELETE a row (Working functionality to be updated later)
    const deleteNoteRow = async _id => {
        const response = await fetch(`/notes/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedNotes();
            alert('Deleted Note Entry');
        } else {
            alert('Failed to Delete Note Entry');
        }
    }

    // UPDATE a row (Working functionality to be updated later)
    const navigate = useNavigate();
    const editNoteRow = async note => {
        setNote(note);
        navigate("/edit-note");
    }

    return (
        <div>
            <h1>Your Saved Notes</h1>
            <p>Below is the list of your saved notes. Click on any item to view or edit details.</p>

            <div className="note-list">
                {/* Check if savedNotes is not null or empty before rendering the list */}
                {savedNotes && savedNotes.length > 0 ? (
                    <SavedNoteList
                        notes={savedNotes}
                        editNote={editNoteRow}
                        deleteNote={deleteNoteRow}
                    />
                ) : (
                    <p> </p>
                    )}
            </div>

            <Link to="/createsavednote">Add New Note</Link>
        </div>
    );
}

export default SavedNotesPage;
