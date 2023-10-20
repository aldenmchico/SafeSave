import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateSavedNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const history = useHistory();

    const handleNoteCreation = async (e) => {
        e.preventDefault();

        const newNote = {
            title,
            content
        };

        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
        });

        if (response.ok) {
            alert('Note saved successfully!');
            history.push('/savednotes'); // Redirect to the saved notes page after creation
        } else {
            alert('Failed to save note. Please try again.');
        }
    }

    return (
        <div>
            <h1>Create a New Note</h1>
            <p>Fill out the details below to save a new note.</p>
            <form onSubmit={handleNoteCreation}>
                <label>
                    Title:
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="Note title"
                        required
                    />
                </label>
                <br/>
                <label>
                    Content:
                    <textarea 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                        placeholder="Write your note here..."
                        required
                    />
                </label>
                <br/>
                <button type="submit">Save Note</button>
            </form>
        </div>
    );
}

export default CreateSavedNotePage;
