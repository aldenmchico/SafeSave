import React, { useState } from 'react';

function SettingsPage() {
    const [userID, setUserID] = useState(1);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [pendingTwoFactorEnabled, setPendingTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState('');

    // TODO: Add part where App looks for a session user (JWT) so that I can use that to look up their credentials in DB ... needs to be done to load their Settings (2FA enabled or not) 


    const updateTwoFactorSetting = async (newState) => {
        // Account update logic
        const userId = 87; // TODO: Replace with actual user ID from session or JWT token

        try {
            const response = await fetch('http://localhost:8006/api/2fa-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                body: JSON.stringify({ enableTwoFactor: newState, userId: userId }),
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
            setTwoFactorEnabled(!newState);
        }
    };

    const toggleTwoFactorAuthentication = () => {
        setPendingTwoFactorEnabled(prevState => !prevState);
    };

    const handleSaveChanges = async () => {
        // Save settings logic
        try {
            await updateTwoFactorSetting(pendingTwoFactorEnabled);
            // Update the actual state to reflect the saved changes
            setTwoFactorEnabled(pendingTwoFactorEnabled);
            setMessage('Settings have been saved.');
        } catch (error) {
            // Error handling is already done inside updateTwoFactorSetting
            console.error(error)
        }
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (confirmation) {
            // Account deletion logic
            console.log("Account deletion initiated");
        }
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
                            checked={pendingTwoFactorEnabled}
                            onChange={toggleTwoFactorAuthentication}
                        />
                        Enable Two-Factor Authentication
                    </label>
                    <p>Enhance your account security by requiring a second verification step during login.</p>
                    {twoFactorEnabled && <p>Change over to the 2FA tab to finish the 2FA sign up process.</p>}
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
