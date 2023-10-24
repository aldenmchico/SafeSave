import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated from useHistory

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Updated from useHistory

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Front-end validation
        if (credentials.username.trim() === '' || credentials.password.trim() === '') {
            alert('Please enter your credentials!');
            return;
        }

        // Use credentials from state, not undefined variables
        const userCredentials = { username: credentials.username, password: credentials.password }; 

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userCredentials), // Updated variable name
            });

            if (response.ok) {
                alert('Logged in successfully!');
                navigate('/home'); // Redirect to the home page after successful login
            } else {
                const responseData = await response.json();
                alert(responseData.message || 'Failed to log in. Please check your credentials.');
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
        <div>
            <h1>Login to SafeSave</h1>
            <p>Enter your credentials to access your vault.</p>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input 
                        type="text" 
                        name="username"
                        value={credentials.username} 
                        onChange={handleInputChange} 
                        placeholder="Enter your username"
                        required
                    />
                </label>
                <br/>
                <label>
                    Password:
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        value={credentials.password} 
                        onChange={handleInputChange} 
                        placeholder="Enter your password"
                        required
                    />
                </label>
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Hide' : 'Show'} Password
                </button>
                <br/>
                <button type="submit">Login</button>
            </form>
            <br/>
            <p>Don't have an account? <a href="/createaccount">Create one now</a></p>
        </div>
    );
}

export default LoginPage;
