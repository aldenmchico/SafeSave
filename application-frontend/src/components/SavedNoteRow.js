import React, { useState } from 'react';
import { AiFillEdit, AiFillDelete, AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

function SavedNoteRow({note, editNote, deleteNote}) {
    const [isFavorite, setIsFavorite] = useState(note.favorited);
    const toggleFavorite = async () => {
        let postIsFavorite = isFavorite;
        if (isFavorite === 0) {
            setIsFavorite(1);
            postIsFavorite = 1;
        }
        else if (isFavorite === 1)  {
            setIsFavorite(0)
            postIsFavorite = 0;
        }
        const postData = {
            noteID: note.userNoteID,
            favorite: postIsFavorite
        };
        await fetch(`/notes/favorite`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
    }
    return (
        <tr>
        <td>{note.userNoteTitle}</td>
        <td>{note.userNoteText}</td>
        <td>{note.userNoteCreated.substring(0,10)}</td>
        <td>{note.userNoteUpdated.substring(0,10)}</td>
        <td>{note.userNoteAccessed.substring(0,10)}</td>
        <td><AiFillEdit onClick={() => editNote(note)}/></td>
        <td><AiFillDelete onClick={() => deleteNote(note.userNoteID)}/></td>

            <td>
                {isFavorite ? <AiFillHeart onClick={toggleFavorite}/> : <AiOutlineHeart onClick={toggleFavorite}/>}
            </td>
        </tr>
    );
}

export default SavedNoteRow;