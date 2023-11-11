import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateSavedLoginPage() {
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSaveLogin = async (e) => {
        e.preventDefault();

        const loginDetails = {
            website,
            username,
            password
        };

        try {
            const response = await fetch('/login_items', {
                method: 'POST',
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
            } else {
                // Extract error message if any from the response
                const errorMessage = await response.text();
                alert(`Failed to save login details. Please try again. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred while saving the login details: ${error}`);
        }
    }

    return (
        <div>
            <h1>Save Login Details</h1>
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

export default CreateSavedLoginPage;
