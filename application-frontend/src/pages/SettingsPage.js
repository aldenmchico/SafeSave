import React, { useState } from 'react';

function SettingsPage() {
    const [userID, setUserID] = useState(1);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState('');

    const toggleTwoFactorAuthentication = async () => {
        setTwoFactorEnabled(prevState => !prevState);
        // Account update logic
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
                <button onClick={() => {/* Navigate to account details */}}>View Account Details</button>
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
