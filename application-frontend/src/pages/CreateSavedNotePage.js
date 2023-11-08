import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateSavedNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleNoteCreation = async (e) => {
        e.preventDefault();

        const newNote = {
            title,
            content
        };

        try {
            const response = await fetch('/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                alert('Note saved successfully!');
                setTitle(''); // Reset the title field
                setContent(''); // Reset the content field
                navigate('/savednotes'); // Redirect to the saved notes page after creation
            } else {
                // Extract error message if any from the response
                const errorMessage = await response.text();
                alert(`Failed to save note. Please try again. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred while saving the note: ${error}`);
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
                        type="txt" 
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
            </form>
            <button type="submit">Save Note</button>
        </div>
    );
}

export default CreateSavedNotePage;
