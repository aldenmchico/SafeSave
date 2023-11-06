import React from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

function SavedLoginRow({loginItem, editLoginItem, deleteLoginItem}) {
    return (
        <tr>
        <td>{loginItem.userLoginItemWebsite}</td>
        <td>{loginItem.userLoginItemUsername}</td>
        <td>{loginItem.userLoginItemPassword}</td>
        <td>{loginItem.userLoginItemDateCreated.substring(0,10)}</td>
        <td>{loginItem.userLoginItemDateUpdated.substring(0,10)}</td>
        <td>{loginItem.userLoginItemDateAccessed.substring(0,10)}</td>
        <td><AiFillEdit onClick={() => editLoginItem(loginItem)}/></td>
        <td><AiFillDelete onClick={() => deleteLoginItem(loginItem.userLoginItemID)}/></td>
        </tr>
    );
}

export default SavedLoginRow;