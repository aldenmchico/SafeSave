import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App.js';
import logo from '../SafeSave-Logo.svg';
import { useLocation } from 'react-router-dom';


const Navigation = () => {
    const location = useLocation();
    const isLoginOrCreateAccountPage = location.pathname === '/' || location.pathname === '/createaccount' ;

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);

    if (isLoginOrCreateAccountPage) {
        return null; // Don't render Navigation on the login page and on CreateAccount Page
    }


    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     navigate(`/search/${searchTerm}`);
    // };

    // TODO: make an HTTP endpoint to a delete cookie endpoint 
    const handleLogout = async () => {
        try {
            // Send a request to delete cookies
            const response = await fetch('/logout', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });

            if (response.ok) {
                // Navigate to the login page
                console.log('Logging Out. Cookies should have been deleted.');
                navigate('/');
                return;
            } else {
                // Handle error (e.g., show an error message)
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during logout:', error);
        }
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
                    {/*<form onSubmit={handleSearch} style={{ position: 'relative', marginLeft: '80px' }}>*/}
                    {/*    <input */}
                    {/*        type="search" */}
                    {/*        placeholder="Search..." */}
                    {/*        value={searchTerm}*/}
                    {/*        onChange={(e) => setSearchTerm(e.target.value)}*/}
                    {/*        style={{ paddingLeft: '50px' }}*/}
                    {/*    />*/}
                    {/*    <button type="submit" style={{ position: 'absolute', left: '-25px', top: '2%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>*/}
                    {/*    <svg width="20" height="20" fill="grey" viewBox="0 0 16 16">*/}
                    {/*            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>*/}
                    {/*        </svg>*/}
                    {/*    </button>*/}
                    {/*</form>*/}
                </div>
            </div>
            <ul style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-around' }}>
                <li><NavLink to="/home">Home</NavLink></li>
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
                {/*<li><NavLink to="/personalinfo">Personal Info</NavLink></li>*/}
                {/*<li><NavLink to="/ids">IDs</NavLink></li>*/}
                {/*<li><NavLink to="/payments">Payments</NavLink></li>*/}
                <li><NavLink to="/createsavedlogin">Create Saved Login</NavLink></li>
                <li><NavLink to="/createsavednote">Create Saved Note</NavLink></li>
                {/*<li onClick={handleLogout}>Logout</li>*/}
                <li className="logout-button" onClick={handleLogout}><NavLink to="#">Logout</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/twofactorauth">2FA</NavLink></li>
                {/* <li><NavLink to="/createaccount">Create Account</NavLink></li>
                <li><NavLink to="/">Login</NavLink></li> */}
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
