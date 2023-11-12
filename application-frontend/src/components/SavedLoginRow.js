import React, { useState } from 'react';
import { AiFillEdit, AiFillDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

function SavedLoginRow({loginItem, editLoginItem, deleteLoginItem}) {
    const [isFavorite, setIsFavorite] = useState(loginItem.favorited);

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
            loginItemID: loginItem.userLoginItemID,
            favorite: postIsFavorite
        };
        await fetch(`/login_items/favorite`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
    }

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
        <td>
            {isFavorite ? <AiFillHeart onClick={toggleFavorite}/> : 
                            <AiOutlineHeart onClick={toggleFavorite}/>} 
        </td>
        </tr>
    );
}

export default SavedLoginRow;