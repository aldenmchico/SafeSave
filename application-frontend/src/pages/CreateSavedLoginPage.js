import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateSavedLoginPage() {
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSaveLogin = async (e) => {
        e.preventDefault();

        const loginDetails = {
            website,
            username,
            password
        };

        const response = await fetch('/savelogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginDetails),
        });

        if (response.ok) {
            alert('Login details saved successfully!');
            history.push('/savedlogins'); // Redirect to the saved logins page after saving
        } else {
            alert('Failed to save login details. Please try again.');
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
                        type="text" 
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
                        type="text" 
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
                        type="password" 
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
