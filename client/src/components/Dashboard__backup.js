import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Chat from '../components/Chat';
import Nav from '../Nav';
import Sidebar from '../components/Sidebar';
import './Dashboard.css'; // Import your Dashboard specific CSS file for styling

const Dashboard = () => {
    const { user, fetchUserDetails, loading } = useAuth();
    const [collapsed, setCollapsed] = useState(false); // State for sidebar collapse/expand

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        if (!user) {
            fetchUserDetails();
        }
    }, [user, fetchUserDetails]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while fetching user details
    }

    return (
        <div className="dashboard-container">
            <Nav />
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                {user ? <Chat user={user} /> : <div>Please log in to access the chat.</div>}
            </div>
        </div>
    );
};

export default Dashboard;
