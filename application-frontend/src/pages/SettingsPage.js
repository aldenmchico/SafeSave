import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [pendingTwoFactorEnabled, setPendingTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState('');

    // check if current User has 2FA enabled on mounting 
    useEffect(() => {
        const check2FAAndOfficialSecretStatus = async () => {
            const isEnabled = await locateUserAndCheck2FAEnabled();
            setPendingTwoFactorEnabled(isEnabled); // Set the state based on the 2FA/secret status
            setTwoFactorEnabled(isEnabled);
        };
        check2FAAndOfficialSecretStatus();
    }, []);

    const locateUserAndCheck2FAEnabled = async () => {

        try {
            const response = await fetch('/api/check-2fa-enabled') // PORT 8006 
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
            console.error('There was a problem with the fetch operation in locateUserAndCheck2FAEnabled() in SettingsPage:', error.message);
        }
    }


    const updateTwoFactorSetting = async (newState) => {
        try {
            //            const response = await fetch('https://localhost:8006/api/2fa-registration', {
            const response = await fetch('/api/2fa-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                credentials: 'include', // Include credentials in the request
                body: JSON.stringify({ enableTwoFactor: newState }),
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
            setPendingTwoFactorEnabled(!newState);
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

    // const handleDeleteAccount = async () => {
    //     const confirmation = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    //     if (confirmation) {
    //         // Account deletion logic
    //         const response = await fetch(`/users/${userID}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         if (response.status === 204) {
    //             const navigate = useNavigate()
    //             navigate('/createaccount')
    //         }
    //         else alert("Failed to delete account...")
    //     }
    // };

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
                    {twoFactorEnabled && <p>If not already done, change over to the 2FA tab to finish the 2FA sign up process.</p>}
                </div>
            </section>
            <section>
                <h2>Account</h2>
                <button onClick={() => {/* Navigate to account details */ }}>View Account Details</button>
                {/* <button onClick={handleDeleteAccount}>Delete Account</button> */}
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
