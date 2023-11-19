import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App.js';
import logo from '../SafeSave-Logo.svg'; 

const Navigation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     navigate(`/search/${searchTerm}`);
    // };       


    // TODO: make an HTTP endpoint to a delete cookie endpoint 
    const handleLogout = () => {
        logout();
        navigate('/loginnavigation');
    };

    return (
        <nav>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src={logo} alt="Logo" width={120} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="dropdown">
                        <button className="dropbtn">Create New</button>
                        <div className="dropdown-content">
                            <NavLink to="/createsavedlogin">Create Saved Login</NavLink>
                            <NavLink to="/createsavednote">Create Saved Note</NavLink>
                            <NavLink to="/createaccount">Create Account</NavLink>
                        </div>
                    </div>
                    {/* <form onSubmit={handleSearch} style={{ position: 'relative', marginLeft: '80px' }}>
                        <input 
                            type="search" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '50px' }}
                        />
                        <button type="submit" style={{ position: 'absolute', left: '-25px', top: '2%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                        <svg width="20" height="20" fill="grey" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </form> */}
                </div>
            </div>
            <ul style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-around' }}>
                <li><NavLink to="/">Home</NavLink></li>
                {/* {isAuthenticated ? (
                    <>
                        <li><NavLink to="/favorites">Favorites</NavLink></li>
                        <li><NavLink to="/settings">Settings</NavLink></li>
                        <li><NavLink to="/personalinfo">Personal Info</NavLink></li>
                        <li><NavLink to="/ids">IDs</NavLink></li>
                        <li><NavLink to="/payments">Payments</NavLink></li>
                        <li><NavLink to="/createsavedlogin">Create Saved Login</NavLink></li>
                        <li><NavLink to="/createsavednote">Create Saved Note</NavLink></li>
                        <li onClick={handleLogout}>Logout</li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/createaccount">Create Account</NavLink></li>
                        <li><NavLink to="/login">Login</NavLink></li>
                    </>
                )} */}

                <li><NavLink to="/favorites">Favorites</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
                {/* <li><NavLink to="/personalinfo">Personal Info</NavLink></li> */}
                {/* <li><NavLink to="/ids">IDs</NavLink></li> */}
                {/* <li><NavLink to="/payments">Payments</NavLink></li> */}
                <li><NavLink to="/createsavedlogin">Create Saved Login</NavLink></li>
                <li><NavLink to="/createsavednote">Create Saved Note</NavLink></li>
                {/* <li onClick={handleLogout}>Logout</li> */}
                <li className="logout-button" onClick={handleLogout}><NavLink to="#">Logout</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/twofactorauth">2FA</NavLink></li>
                <li><NavLink to="/createaccount">Create Account</NavLink></li>
                <li><NavLink to="/loginnavigation">Login</NavLink></li>
                {/* Dropdown for Saved Info */}
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
