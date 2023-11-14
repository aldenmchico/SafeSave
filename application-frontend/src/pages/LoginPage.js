import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [userID, setUserID] = useState(null); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (credentials.username.trim() === '' || credentials.password.trim() === '') {
            setError('Please enter your credentials!');
            return;
        }

        try {
            //  login authentication, JWT generation and stored in client cookie 
            const response = await fetch('http://localhost:8008/login/validation', {
                method: 'POST',
                credentials: 'include', // Include credentials in the request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                alert('Logged in successfully!');
                // navigate('/');

                const { userID: fetchedUserID } = await response.json(); // Get userID
                setUserID(fetchedUserID); // Set the userID in state
                setPassword(credentials.password); // Set the unencrypted password in state

                // Navigate to HomePage with userID and password state
                navigate('/home', { state: { userID: fetchedUserID, password: credentials.password } });
            } else {
                if (response.status === 401) {
                    setError('Invalid username or password. Please try again.');
                } else {
                    const responseData = await response.json();
                    setError(responseData.message || 'An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
            setError('Login failed. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
        <div className="login-container">
            <h1>Login to SafeSave</h1>
            <p>Enter your credentials to access your vault.</p>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                    />
                    <button className="action-button" type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                </div>
                <div className="submit-button">
                    <button className="login-button" type="submit">Login</button>
                </div>
            </form>
            <p className="register-text">Don't have an account? <Link to="/createaccount">Create one now</Link></p>
        </div>
    );
}

export default LoginPage;
