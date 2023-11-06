import React, { useState } from 'react';

function SettingsPage() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState('');

    const toggleTwoFactorAuthentication = async () => {
        setTwoFactorEnabled(prevState => !prevState);
        // Account update logic

        // TODO:  temporary user id created...need to implement session JWT token to hold curr user creds
        const userId = 87;

        try {
            const response = await fetch('http://localhost:8006/api/2fa-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                body: JSON.stringify({ enableTwoFactor: twoFactorEnabled, userId: userId }),
            });

            if (response.ok) {
                const data = await response.json();
                // Handle success. If a token is sent back, you can use it here.
                console.log('2FA setting updated', data);
                setMessage('Two-factor authentication settings have been updated.');
            } else {
                throw new Error('Failed to update two-factor authentication settings');
            }
        } catch (error) {
            console.error('Error updating 2FA settings:', error);
            setMessage('An error occurred while updating two-factor authentication settings.');
            // Revert the checkbox state in case of an error
            setTwoFactorEnabled(prevState => !prevState);
        }
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (confirmation) {
            // Account deletion logic
            console.log("Account deletion initiated");
        }
    };

    const handleSaveChanges = () => {
        // Save settings logic
        setMessage('Settings have been saved.');
    };

    return (
        <div>
            <h1>Settings</h1>
            <section>
                <h2>Security</h2>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={twoFactorEnabled}
                            onChange={toggleTwoFactorAuthentication}
                        />
                        Enable Two-Factor Authentication
                    </label>
                    <p>Enhance your account security by requiring a second verification step during login.</p>
                </div>
            </section>
            <section>
                <h2>Account</h2>
                <button onClick={() => {/* Navigate to account details */ }}>View Account Details</button>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </section>
            <section>
                <h2>Save Changes</h2>
                {message && <p>{message}</p>}
                <button onClick={handleSaveChanges}>Save Changes</button>
            </section>
        </div>
    );
}

export default SettingsPage;
