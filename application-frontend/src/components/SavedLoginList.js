import React from 'react';
import SavedLoginRow from './SavedLoginRow';

function SavedLoginList({loginItems, editLoginItem, deleteLoginItem, favoriteLoginItem}) {
    return (
        <div className="wrapper">
        <table>
            <thead>
                <tr>
                    <th>Website</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Date Created</th>
                    <th>Date Updated</th>
                    <th>Date Accessed</th>
                </tr>
            </thead>
            <tbody>
                {loginItems.map((loginItem, i) =>
                <SavedLoginRow
                    loginItem={loginItem}
                    key={i}
                    editLoginItem={editLoginItem}
                    deleteLoginItem={deleteLoginItem}
                    favoriteLoginItem={favoriteLoginItem}
                />)}
            </tbody>
        </table>
        </div>
    );
}

export default SavedLoginList;