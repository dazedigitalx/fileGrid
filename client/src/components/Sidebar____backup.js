import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ collapsed, toggleSidebar }) => {
    return (
        <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <button className="toggle-button" onClick={toggleSidebar}>
                    {collapsed ? <>&#9654;</> : <>&#9660;</>}
                </button>
                {!collapsed && (
                    <>
                        <h1>Sidebar</h1>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;
