import React from 'react';
import SavedNoteRow from './SavedNoteRow';

function SavedNoteList({ notes, editNote, deleteNote }) {

    if (notes.length !== 0) {

        return (

            <div className="wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Note</th>
                        <th>Date Created</th>
                        <th>Date Updated</th>
                        <th>Date Accessed</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notes.map((note, i) =>
                        <SavedNoteRow
                            note={note}
                            key={i}
                            editNote={editNote}
                            deleteNote={deleteNote}
                        />)}
                    </tbody>
                </table>
            </div>
        );

    } else {
        return (<p></p>)
    }
}



export default SavedNoteList;