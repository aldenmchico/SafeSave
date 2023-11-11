import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getCurrentUserID = () => {
    return 1; // Temporary userID of 1
};

function CreateSavedNotePage() {
    const currentUserID = getCurrentUserID(); 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleNoteCreation = async (e) => {
        e.preventDefault();

        const newNote = {
            title,
            content,
            userNoteDateCreated: new Date().toISOString(),
            userNoteDateUpdated: new Date().toISOString(),
            userID: currentUserID 
        };

        try {
            const response = await fetch('http://localhost:8008/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                alert('Note saved successfully!');
                setTitle('');
                setContent('');
                navigate('/savednotes');
            } else {
                const errorMessage = await response.text();
                alert(`Failed to save note. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error}`);
        }
    };

    return (
        <div>
            <h1>Create a New Note</h1>
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
                <button type="submit">Save Note</button>
            </form>
        </div>
    );
}

export default CreateSavedNotePage;
