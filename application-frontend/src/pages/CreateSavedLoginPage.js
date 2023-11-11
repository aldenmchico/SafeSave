import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getCurrentUserID = () => {
    // Placeholder
    return 1;
};

function CreateSavedLoginPage() {
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSaveLogin = async (e) => {
        e.preventDefault();

        const loginItemData = {
            userLoginItemWebsite: website,
            userLoginItemUsername: username,
            userLoginItemPassword: password,
            userLoginItemDateCreated: new Date().toISOString(),
            userLoginItemDateUpdated: new Date().toISOString(),
            userLoginItemDateAccessed: new Date().toISOString(),
            userID: getCurrentUserID()
        };

        try {
            const response = await fetch('http://localhost:8008/login_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginItemData)
            });

            if (response.ok) {
                alert('Login details saved successfully!');
                // Resetting the form fields after successful submission
                setWebsite('');
                setUsername('');
                setPassword('');
                navigate('/savedlogins'); // Redirect to the saved logins page
            } else {
                // Error handling for non-200 responses
                const errorMessage = await response.text();
                alert(`Failed to save login details. Error: ${errorMessage}`);
            }
        } catch (error) {
            alert(`An error occurred while saving the login details: ${error}`);
        }
    };

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
                <br />
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
                <br />
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
                <br />
                <button type="submit">Save Login</button>
            </form>
        </div>
    );
}

export default CreateSavedLoginPage;
