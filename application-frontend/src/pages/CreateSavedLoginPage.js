import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateSavedLoginPage() {
    const [loginDetails, setLoginDetails] = useState({
        website: '',
        username: '',
        password: '',
        userID: null, // Initialized as null
        userPassword: ''
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Update state with userID and unencrypted password
    React.useEffect(() => {
        if (location.state) {
            setLoginDetails(prevState => ({
                ...prevState,
                userID: location.state.userID,
                userPassword: location.state.password
            }));
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveLogin = async (e) => {
        e.preventDefault();

        const { website, username, password, userID } = loginDetails;

        const loginItemData = {
            userLoginItemWebsite: website,
            userLoginItemUsername: username,
            userLoginItemPassword: password,
            userLoginItemDateCreated: new Date().toISOString(),
            userLoginItemDateUpdated: new Date().toISOString(),
            userLoginItemDateAccessed: new Date().toISOString(),
            userID: userID // Using the userID from state
        };

        try {
            const response = await fetch('http://localhost:8008/login_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginItemData)
            });

            if (response.ok) {
                alert('Login details saved successfully!');
                navigate('/savedlogins', { state: { userID: userID, password: loginDetails.userPassword } });
            } else {
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
                        type="text"
                        name="website"
                        value={loginDetails.website}
                        onChange={handleInputChange}
                        placeholder="Website or Service name"
                        required
                    />
                </label>
                <br />
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={loginDetails.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={loginDetails.password}
                        onChange={handleInputChange}
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
