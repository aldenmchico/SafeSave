import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TwoFactorAuthenticationPage() {
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(true); // New state variable
    const [qrCode, setQRCode] = useState('');
    const [mfaSecret, setmfaSecret] = useState('');
    const [invalidCookie, setInvalidCookie] = useState(false);


    const navigate = useNavigate();
    const cooldownTimer = useRef(null);

    useEffect(() => {
        if (invalidCookie) {
            alert('Invalid or expired cookie');
            navigate('/');
        }
    }, [invalidCookie]);


    // check if current User has 2FA enabled on mounting 
    useEffect(() => {
        const check2FAStatus = async () => {
            const isEnabledAndNoSecret = await locateUserAndConfirm2FAEnabledAndNoSecret();
            setIs2FAEnabled(isEnabledAndNoSecret); // Set the state based on the 2FA status

            if (!isEnabledAndNoSecret) {
                // If 2FA is not enabled, handle accordingly, e.g., navigate back or show a message.
                setErrorMsg('Two-factor authentication is not enabled or you are already set up. Please check the Settings tab. Otherwise, please disable and enable 2-FA again.');
                // navigate('/settings'); // Uncomment this line to navigate to the settings page.
                return;
            }

            // display the QR code here
            await generateAndDisplayQRCode();
        };
        check2FAStatus();
    }, []); // The empty dependency array means this effect will run once when the component mounts.

    const generateAndDisplayQRCode = async () => {

        // THIS WHOLE FUNCTION SHOULD BE A GET REQUEST (USER DOESNT NEED TO SEND ANY BODY DATA)
        try {
            const response = await fetch('/api/generate-mfa-qr-code');

            if (response.ok) {
                const responseData = await response.json();
                const base64Image = responseData.qrCodeImage;
                const binaryImage = atob(base64Image); // Decoding base64
                const length = binaryImage.length;
                const imageBytes = new Uint8Array(length);

                for (let i = 0; i < length; i++) {
                    imageBytes[i] = binaryImage.charCodeAt(i);
                }

                const qrCodeImageBlob = new Blob([imageBytes], { type: 'image/png' });
                setQRCode(URL.createObjectURL(qrCodeImageBlob));
                setmfaSecret(responseData.mfaTempSecret);
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }

            else {
                throw new Error('Failed to generate QR code');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            setErrorMsg('An error occurred while generating the QR code for two-factor authentication.');
            if(!invalidCookie){
                setInvalidCookie(true);
            }
        }
    };

    const locateUserAndConfirm2FAEnabledAndNoSecret = async () => {
        try {
            const response = await fetch('/api/check-2fa-enabled-and-no-secret') // PORT 8006 
            if (!response.ok) {
                throw new Error('Something went wrong with fetch in TwoFactorAuthPage');
            }
            const responseData = await response.json();
            console.log(`user data found in TwoFactorAuthPage, locateUserAndCheck2FAEnabledAndNoSecret: `, responseData);

            if (response.ok && !responseData.has2FAAndNoSecret) {
                return false
            }
            else if(response.status === 401 || response.status === 403 || response.status === 500){
                if(!invalidCookie){
                    setInvalidCookie(true);
                }
            }
            else if (response.ok && responseData.has2FAAndNoSecret) {
                return true
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation in SettingsPage, locateUserAndCheck2FAEnabledAndNoSecret():', error.message);
            if(!invalidCookie){
                setInvalidCookie(true);
            }

        }
    }


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

            const response = await fetch('/api/verify-2fa-setup-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required, such as authentication tokens
                },
                body: JSON.stringify({ token: code }),
            });

            const responseData = await response.json();
            console.log(`responseData is`, responseData)

            if (response.ok && responseData.verified) {
                setErrorMsg('It worked! 2FA has been set up for your account. Do not lose the Authenticator entry.');
            } else {
                setErrorMsg(responseData.message || 'Invalid 2FA code. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying 2FA code:', error);
            setErrorMsg('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Two Factor Authentication</h1>
            {!is2FAEnabled ? (
                // If 2FA is not enabled, display only the error message.
                <p style={{ color: 'red' }}>{errorMsg}</p>
            ) : (
                // If 2FA is enabled, display the form and other elements.
                <>
		    <p>Please scan the QR code below with a 2FA authenticator app and enter the six-digit code in the box below. Microsoft Authenticator is the preferred choice.</p>
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
                        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
                        <button type="submit" disabled={isLoading}>Verify</button>
                    </form>
                    {qrCode && (
                        <div>
                            <p>Scan this QR code with your 2FA app:</p>
                            <img src={qrCode} alt="2FA QR Code" />
                            <br></br>
                            <br></br>
                            <p>Alternatively, you can copy this code directly into your authenticator app:</p>
                            <code>{mfaSecret}</code>
                        </div>
                    )}
                    {isLoading && <p>Loading...</p>}
                </>
            )}
        </div>
    );
}

export default TwoFactorAuthenticationPage;
