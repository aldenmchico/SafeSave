import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditSavedLoginPage({loginItem}) {
    console.log("Login item is on EditSavedLoginPage.js", loginItem)
    const [website, setWebsite] = useState(loginItem.userLoginItemWebsite);
    const [username, setUsername] = useState(loginItem.userLoginItemUsername);
    const [password, setPassword] = useState(loginItem.userLoginItemPassword);
    const navigate = useNavigate();
    const [invalidCookie, setInvalidCookie] = useState(false);


    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);

    const handleSaveLogin = async (e) => {
        e.preventDefault();

        const currentDate = new Date();
        const loginDetails = {
            userLoginItemID: loginItem.userLoginItemID,
            website: website,
            username: username,
            password: password,
            dateUpdated: currentDate,
            dateAccessed: currentDate
        };

        try {
            const response = await fetch('/login_items', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                alert('Login details saved successfully!');
                setWebsite(''); // Reset the website field
                setUsername(''); // Reset the username field
                setPassword(''); // Reset the password field
                navigate('/savedlogins'); // Redirect to the saved logins page after saving
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else {
                // Extract error message if any from the response
                const errorMessage = await response.text();
                alert(`Failed to save login details. Please try again. Error: ${errorMessage}`);
            }
        } catch (error) {
            console.log(error)
            if(!invalidCookie){
                setInvalidCookie(true);
            }

        }
    }

    return (
        <div>
            <h1>Edit Login Details</h1>
            <p>Enter the login credentials of a website or service you'd like to save.</p>
            <form onSubmit={handleSaveLogin}>
                <label>
                    Website/Service:


                    <input
                        type="txt"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}

                        placeholder="Website or Service name"
                        required
                    />
                </label>
                <br/>
                <label>
                    Username:

                    <input
                        type="txt"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                    />
                </label>
                <br/>
                <label>
                    Password:

                    <input
                        type="pwd"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </label>
                <br/>
                <button type="submit">Save Login</button>
            </form>
        </div>
    );
}


export default EditSavedLoginPage;

