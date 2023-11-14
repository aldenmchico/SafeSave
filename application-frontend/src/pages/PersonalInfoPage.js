import React, { useState, useEffect } from 'react';

function PersonalInfoPage() {
    const [personalInfo, setPersonalInfo] = useState({});

    const loadPersonalInfo = async () => {
        const response = await fetch('http://localhost:8008/personalinfo');
        const infoData = await response.json();
        setPersonalInfo(infoData);
    }

    useEffect(() => {
        loadPersonalInfo();
    }, []);

    return (
        <div>
            <h1>Your Personal Information</h1>
            <div className="info-card">
                <p><strong>Name:</strong> {personalInfo.name}</p>
                <p><strong>Email:</strong> {personalInfo.email}</p>
                <p><strong>Phone Number:</strong> {personalInfo.phoneNumber}</p>
                <button onClick={() => {/* Navigate to edit page */}}>Edit Info</button>
            </div>
        </div>
    );
}

export default PersonalInfoPage;
