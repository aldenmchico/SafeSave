import React, { useState } from 'react';

function SettingsPage() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [qrCode, setQRCode] = useState('');



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

    const generateQRCode = async () => {
        // Assume you have the necessary data like mfaSecret and username
        const mfaSecret = '6Y7CQOWNSMA4TTNM5WCLUM6Y67GMP7CV' // The secret generated for the user's 2FA
        const username = 'port11' // The username for the authenticator
        const twoFactorEnabled = 1
    
        try {
            const response = await fetch('http://localhost:8006/api/generate-mfa-qr-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                body: JSON.stringify({ mfaEnabled: twoFactorEnabled, mfaSecret: mfaSecret, username: username }),
            });
    
            if (response.ok) {
                const qrCodeImageBlob = await response.blob();
                setQRCode(URL.createObjectURL(qrCodeImageBlob));
            } else {
                throw new Error('Failed to generate QR code');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            setMessage('An error occurred while generating the QR code for two-factor authentication.');
        }
    };


    const toggleTwoFactorAuthentication = () => {
        setTwoFactorEnabled(prevState => {
            const newState = !prevState;
            // Update the backend about the 2FA status
            updateTwoFactorSetting(newState).then(() => {
                // If 2FA is being enabled, generate the QR code
                if (newState) {
                    generateQRCode();
                } else {
                    // If 2FA is being disabled, clear the QR code
                    setQRCode('');
                }
            }).catch(error => {
                console.error('Error during 2FA update:', error);
                // Optionally revert the checkbox if there's an error
                setTwoFactorEnabled(prevState);
            });
            return newState;
        });
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
                    {twoFactorEnabled && qrCode && (
                        <div>
                            <p>Scan this QR code with your 2FA app:</p>
                            <img src={qrCode} alt="2FA QR Code" />
                        </div>
                    )}
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
