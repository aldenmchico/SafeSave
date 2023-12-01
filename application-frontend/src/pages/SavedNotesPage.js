import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SavedNoteList from '../components/SavedNoteList';

function SavedNotesPage({ setNote }) {
    const [savedNotes, setSavedNotes] = useState([]);
    const navigate = useNavigate();

    const [invalidCookie, setInvalidCookie] = useState(false);

    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);

    // Load saved notes from the backend
    const loadSavedNotes = async () => {
        const url = `/notes/users/userID`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const notesData = await response.json();
                setSavedNotes(notesData);
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else if (response.status === 404) {
                console.log('Response code in loadSavedNotes is 404 - nothing to return. Dont worry about this 404 Error code.')
                setSavedNotes([]); 
                return;
            }
            else {
                throw new Error('Failed to fetch notes');
            }
        } catch (error) {
            alert(error.message);
            if(!invalidCookie){
                setInvalidCookie(true);
            }
        }
    };

    useEffect(() => {
        loadSavedNotes();
    }, []);

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
            <Link to="/createsavednote">Add New Note</Link>
        </div>
    );
}

export default SavedNotesPage;
