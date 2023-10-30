import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PaymentsPage() {
    const [savedPayments, setSavedPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadSavedPayments = async () => {
        const response = await fetch('/payments');
        const paymentsData = await response.json();
        setSavedPayments(paymentsData);
    }

    useEffect(() => {
        loadSavedPayments();
    }, []);

    const filteredPayments = savedPayments.filter(payment => 
        payment.methodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Your Saved Payment Methods</h1>
            <input 
                type="text" 
                placeholder="Search payment methods..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
            />

            {filteredPayments.length > 0 ? (
                <ul>
                    {filteredPayments.map(payment => (
                        <li key={payment._id}>
                            {payment.methodName} - Ending in {payment.lastFourDigits}
                            <button onClick={() => {/* Edit  */}}>Edit</button>
                            <button onClick={() => {/* Delete  */}}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No payment methods found. Please add a new one.</p>
            )}
            
            <Link to="/createpaymentmethod">Add New Payment Method</Link>
        </div>
    );
}

export default PaymentsPage;
