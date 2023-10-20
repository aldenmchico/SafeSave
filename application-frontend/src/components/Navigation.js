import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink to="/" exact>Home</NavLink></li>
      <li><NavLink to="/favorites">Favorites</NavLink></li>
      <li><NavLink to="/logins">Logins</NavLink></li>
      <li><NavLink to="/notes">Notes</NavLink></li>
      <li><NavLink to="/payments">Payments</NavLink></li>
      <li><NavLink to="/personalinfo">Personal Info</NavLink></li>
      <li><NavLink to="/ids">IDs</NavLink></li>
      <li><NavLink to="/settings">Settings</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
    </ul>
  </nav>
);

export default Navigation;
