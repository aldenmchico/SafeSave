import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateAccountPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const history = useHistory();
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return regex.test(password);
    };
    
    const handleAccountCreation = async (e) => {
        e.preventDefault();
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

        if (valid) {
            // Simulate account creation logic
            console.log('Creating account...'); // Add logic later
            const newUser = {
                username: formData.username,
                email: formData.email,
                password: formData.password, 
            };

            // Placeholder for future endpoint
            const response = await fetch('/createaccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Account created successfully!');
                history.push('/login'); // Redirect to the login page after account creation
            } else {
                alert('Failed to create account. Please try again.');
            }
        } else {
            setErrors(errs);
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
        <div>
            <h1>Create a New SafeSave Account</h1>
            <p>Enter your desired credentials to create a new account.</p>
            <form onSubmit={handleAccountCreation}>
                <label>
                    Username:
                    <input 
                        type="text" 
                        name="username"
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="Enter your username"
                        required
                    />
                </label>
                <br/>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email"
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}
                </label>
                <br/>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Enter a strong password"
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}
                </label>
                <br/>
                <label>
                    Confirm Password:
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="Confirm your password"
                        required
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                </label>
                <br/>
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default CreateAccountPage;
