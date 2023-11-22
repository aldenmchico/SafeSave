import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [userID, setUserID] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [authenticatorTextbox, setAuthenticatorTextbox] = useState(false);

    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const locateUserAndCheck2FAEnabled = async () => {

        try {
            const response = await fetch('/api/check-2fa-enabled-and-real-secret-established') // PORT 8006 
            if (!response.ok) {
                throw new Error('Something went wrong with fetch in SettingsPage');
            }
            const responseData = await response.json();
            console.log(`user data found in SettingsPage, locateUserAndCheck2FAEnabled: `, responseData);

            if (response.ok && !responseData.verified) {
                return false
            } else if (response.ok && responseData.verified) {
                return true
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation in locateUserAndCheck2FAEnabled() in LoginPage:', error.message);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (credentials.username.trim() === '' || credentials.password.trim() === '') {
            setError('Please enter your credentials!');
            return;
        }

        try {

            //  login authentication, JWT generation and stored in client cookie 
            const response = await fetch('/loginvalidation', {
                method: 'POST',
                credentials: 'include', // Include credentials in the request
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {

                alert('Logged in successfully!');

                // query to see if 2fa is enabled 
                const userHas2FA = await locateUserAndCheck2FAEnabled()

                console.log(`userHas2FA is ${userHas2FA}`);

                // if 2FA is enabled AND Secret exists
                if (userHas2FA) {
                    /* false means the following from 2-fa-model file
                    if (!twoFactor || secret) return false // if FA disabled or official Secret already exists 
                    */
                    // set state value for 2fa input    
                    setAuthenticatorTextbox(true);
                }
                else {
                    // Navigate to HomePage if no 2FA enabled
                    navigate('/home');
                }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!/^[0-9]{6}$/.test(code)) {
            setErrorMsg('The 2FA code should be 6 digits. Please enter a valid code.');
            setIsLoading(false);
            return;
        }

        try {

            console.log(`token is ${code}`)

            const response = await fetch('/api/verify-2fa-login-token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                body: JSON.stringify({ token: code }),
            });

            const responseData = await response.json();
            console.log(`responseData is`, responseData)

            if (response.ok && responseData.verified === true) {
                alert('It worked! Navigating to Home page now.');
                navigate('/home');
            } else {
                setErrorMsg(responseData.message || 'Invalid 2FA code. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying 2FA code upon Logging in And confirming 2fa enabled:', error);
            setErrorMsg('An error occurred in LoginPage when logging in and requesting 2fa. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

            {authenticatorTextbox && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        maxLength="6"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 2FA code"
                        required
                    />
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                    <button type="submit" disabled={isLoading}>Verify</button>
                </form>
            )}


            <p className="register-text">Don't have an account? <Link to="/createaccount">Create one now</Link></p>
        </div>
    );
}

export default LoginPage;
