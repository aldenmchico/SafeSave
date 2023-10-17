// Import React ES Modules
import React from 'react';
import {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom'

// Import React components

function HomePage({}) {

    // Use state variable exercises to bring in the data
    const [savedLogins, setSavedLogins] = useState([]);

    // RETRIEVE the data using endpoint
    const loadSavedLogins = async () => {
        const response = await fetch('/logins');
        const savedLogins = await response.json();
        setSavedLogins(savedLogins);
    }
    // Use the useEffect hook to call the loadExercises function when the page first loads
    useEffect(() => {
        loadSavedLogins();
    }, []);

    // DELETE a row
    const deleteLoginRow = async _id => {
        const response = await fetch(`/logins/${_id}`, {method: 'DELETE'});
        if (response.status === 204) {
            const getResponse = await fetch('/logins');
            const exercises = await getResponse.json();
            setSavedLogins(savedLogins);
            alert('Deleted Login Entry');
        } else {
            alert('Failed to Delete Exercise');
        }
    }

    // UPDATE a row
    const history = useHistory();

    return(
        <>  
            <article>
                <div className="Login List">
                <LoginList
                />
                </div>
            </article>
             
        </>
    );
}

export default HomePage;
