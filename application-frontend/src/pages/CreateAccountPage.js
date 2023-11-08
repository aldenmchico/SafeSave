import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAccountPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return regex.test(password);
    };

    const handleAccountCreation = async () => {
        let valid = true;
        let errs = {};

        if (!validateEmail(formData.email)) {
            valid = false;
            errs.email = 'Invalid email format';
        }

        if (!validatePassword(formData.password)) {
            valid = false;
            errs.password = 'Password must be at least 12 characters long and include at least 1 lowercase, 1 uppercase, 1 numeric, and 1 special character';
        }

        if (formData.password !== formData.confirmPassword) {
            valid = false;
            errs.confirmPassword = 'Passwords do not match';
        }

        setErrors(errs);

        if (valid) {
            const newUser = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            try {
                const response = await fetch('/createaccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (response.ok) {
                    alert('Account created successfully! Please check your email for a confirmation link.');
                    navigate('/login');
                } else {
                    const responseData = await response.json();
                    alert(responseData.message || 'Failed to create account. Please try again.');
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="login-container">
            <h1>Create a New SafeSave Account</h1>
            <p>Enter your desired credentials to create a new account.</p>
            {/* Removed onSubmit from form and applied onClick to button below */}
            <form className="login-form">
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="txt"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="pwd"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter a strong password  "
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="pwd"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                </div>
            </form>
            <div className="submit-button">
                <button className="login-button" onClick={handleAccountCreation}>Create Account</button>
            </div>
        </div>
    );
}

export default CreateAccountPage;
