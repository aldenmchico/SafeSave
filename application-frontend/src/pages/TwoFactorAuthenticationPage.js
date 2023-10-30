import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function TwoFactorAuthenticationPage() {
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);
    const navigate = useNavigate();
    const cooldownTimer = useRef(null);

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/resend-2fa-code', {
                method: 'POST',
            });

            if (response.ok) {
                setSuccessMsg('2FA code resent successfully! Please check your email.');
                setResendCooldown(true);
                cooldownTimer.current = setTimeout(() => {
                    setResendCooldown(false);
                }, 120000);  // 2 minutes cooldown
            } else {
                const responseData = await response.json();
                setErrorMsg(responseData.message || 'Error resending the 2FA code. Please try again later.');
            }
        } catch (error) {
            console.error('Error resending 2FA code:', error);
            setErrorMsg('An error occurred while resending the code. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
            const response = await fetch('/verify-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            const responseData = await response.json();
            
            if (response.ok) {
                navigate('/home');  // Navigate to home page
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
            <p>We've sent a 6-digit 2FA code to your email. Please enter it below to proceed. If you haven't received it, check your spam folder or click the resend button below.</p>
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
            <button onClick={handleResendCode} disabled={resendCooldown || isLoading}>
                Resend Code
            </button>
            {isLoading && <p>Loading...</p>}
        </div>
    );
}

export default TwoFactorAuthenticationPage;
