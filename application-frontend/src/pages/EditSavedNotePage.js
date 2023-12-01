import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditSavedNotePage({note}) {
    const [title, setTitle] = useState(note.userNoteTitle);
    const [content, setContent] = useState(note.userNoteText);
    const navigate = useNavigate();

    const [invalidCookie, setInvalidCookie] = useState(false);


    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);

    const handleNoteCreation = async (e) => {
        e.preventDefault();

        const currentDate = new Date();
        const newNote = {
            noteID: note.userNoteID,
            title: title,
            text: content,
            dateUpdated: currentDate,
            dateAccessed: currentDate
        };

        try {
            const response = await fetch('/notes', {
                method: 'PATCH',
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
            }

            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }

            else {
                // Extract error message if any from the response
                const errorMessage = await response.text();
                alert(`Failed to save note. Please try again. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred while saving the note: ${error}`);
            if(!invalidCookie){
                setInvalidCookie(true);
            }
        }
    }

    return (
        <div>
            <h1>Edit This Note</h1>
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
                <button type="submit">Save Note</button>
            </form>
        </div>
    );
}


export default EditSavedNotePage;