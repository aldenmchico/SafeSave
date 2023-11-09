import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (credentials.username.trim() === '' || credentials.password.trim() === '') {
            alert('Please enter your credentials!');
            return;
        }

        const userCredentials = { username: credentials.username, password: credentials.password };

        try {
            const response = await fetch('http://localhost:8008/login/validation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userCredentials),
            });

            if (response.ok) {
                alert('Logged in successfully!');
                navigate('/');
            } else {
                if (response.status === 401) {
                    alert('Invalid username or password. Please try again.');
                } else {
                    const responseData = await response.json();
                    alert(responseData.message || 'An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
        <div className="login-container">
            <h1>Login to SafeSave</h1>
            <p>Enter your credentials to access your vault.</p>
            
            {/* Form for username and password input */}
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label>Username</label>
                    <input 
                        type="txt" 
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
                        type={showPassword ? "txt" : "pwd"} 
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
            </form>
            
            {/* Separate login button */}
            <div className="submit-button">
                <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
            <p className="register-text">Don't have an account? <Link to="/createaccount">Create one now</Link></p>
        </div>
    );
}

export default LoginPage;
