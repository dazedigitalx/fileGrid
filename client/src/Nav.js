import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path as per your project structure
import './Nav.css'; // Import the CSS file

const Nav = () => {
    const { user, logout } = useAuth(); // Destructure user state and logout function from useAuth

    const handleLogout = () => {
        logout(); // Call logout function provided by useAuth hook
    };

    // Check if user is null or undefined before accessing user properties
    if (!user) {
        return (
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                </ul>
            </nav>
        );
    }

    // User is defined, render navigation with user info
    return (
        <nav>
            <ul>
                <li>
                    <div className="user-info">
                        <p>Welcome User :  {user.username}</p>
                        <p>ID: {user.id}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                    </div>
                </li>
                <li><Link to="/">Home</Link></li>

                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Nav;
