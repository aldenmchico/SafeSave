import React from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

function SavedNoteRow({note, editNote, deleteNote}) {
    return (
        <tr>
        <td>{note.userNoteTitle}</td>
        <td>{note.userNoteText}</td>
        <td>{note.userNoteCreated.substring(0,10)}</td>
        <td>{note.userNoteUpdated.substring(0,10)}</td>
        <td>{note.userNoteAccessed.substring(0,10)}</td>
        <td><AiFillEdit onClick={() => editNote(note)}/></td>
        <td><AiFillDelete onClick={() => deleteNote(note.userNoteID)}/></td>
        </tr>
    );
}

export default SavedNoteRow;