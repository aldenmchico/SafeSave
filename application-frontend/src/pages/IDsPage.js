import React, { useState, useEffect } from 'react';

function IDsPage() {
    const [savedIDs, setSavedIDs] = useState([]);

    const loadSavedIDs = async () => {
        const response = await fetch('/ids');
        const idsData = await response.json();
        setSavedIDs(idsData);
    }

    useEffect(() => {
        loadSavedIDs();
    }, []);

    return (
        <div>
            <h1>Your Saved IDs</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID Type</th>
                        <th>ID Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {savedIDs.map(id => (
                        <tr key={id._id}>
                            <td>{id.idType}</td>
                            <td>{id.idNumber}</td>
                            <td>
                                <button onClick={() => {/* view details */}}>View</button>
                                <button onClick={() => {/* edit page */}}>Edit</button>
                                <button onClick={() => {/* Delete */}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IDsPage;
