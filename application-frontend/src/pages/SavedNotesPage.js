import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SavedNotesPage() {
    const [savedNotes, setSavedNotes] = useState([]);

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        const response = await fetch('/notes');
        const notesData = await response.json();
        setSavedNotes(notesData);
    }

    useEffect(() => {
        loadSavedNotes();
    }, []);

    const deleteNoteRow = async _id => {
        const response = await fetch(`/notes/${_id}`, { method: 'DELETE' });
        if (response.status === 204) {
            loadSavedNotes();
            alert('Deleted Note Entry');
        } else {
            alert('Failed to Delete Note Entry');
        }
    }

    return (
        <div>
            <h1>Your Saved Notes</h1>
            <p>Below is the list of your saved notes. Click on any item to view or edit details.</p>
            
            <ul>
                {savedNotes.map(note => (
                    <li key={note._id}>
                        <Link to={`/notes/${note._id}`}>{note.title}</Link>
                        <button onClick={() => deleteNoteRow(note._id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </li>
                ))}
            </ul>
            
            <Link to="/createsavednote">Add New Note</Link>
        </div>
    );
}

export default SavedNotesPage;
