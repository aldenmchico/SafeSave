import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../SafeSave-Logo.svg';

const Navigation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchTerm}`);
    };

    return (
        <nav>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src={logo} alt="Logo" width={120} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <NavLink to="/create">
                        <button>Create New</button>
                    </NavLink>
                    <form onSubmit={handleSearch} style={{ position: 'relative', marginLeft: '20px' }}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '70px' }}
                        />
                        <button type="submit" style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            <ul style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-arod' }}>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/createaccount">Create Account</NavLink></li>
                <li><NavLink to="/favorites">Favorites</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/twofactorauth">2FA</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/personalinfo">Personal Info</NavLink></li>
                <li><NavLink to="/ids">IDs</NavLink></li>
                <li><NavLink to="/payments">Payments</NavLink></li>
                <li><NavLink to="/createsavedlogin">Create Saved Login</NavLink></li>
                <li><NavLink to="/createsavednote">Create Saved Note</NavLink></li>
                <div className="dropdown">
                    <NavLink to="#" className="dropbtn">Saved Info</NavLink>
                    <div className="dropdown-content">
                        <NavLink to="/savedlogins">Saved Logins</NavLink>
                        <NavLink to="/savednotes">Saved Notes</NavLink>
                    </div>
                </div>
            </ul>
        </nav>
    );
};

export default Navigation;
