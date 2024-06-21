import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Chat from '../components/Chat';
import Nav from '../Nav';
import Sidebar from '../components/Sidebar';
import './Dashboard.css'; // Import your Dashboard specific CSS file for styling
import Channels from '../components/Channels';
import NewChannelForm from '../components/NewChannelForm';

const Dashboard = () => {
    const { user, fetchUserDetails, loading } = useAuth();
    const [collapsed, setCollapsed] = useState(false); // State for sidebar collapse/expand
    const [selectedChannel, setSelectedChannel] = useState('General'); // State for selected channel

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
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
        <div>
            <Nav />
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} onChannelSelect={handleChannelSelect} />
            <div className="dashboard-container">
                <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                    <button className="toggle-button" onClick={toggleSidebar}>
                        {collapsed ? <>&#9654;</> : <>&#9660;</>}
                    </button>
                    <h1>Welcome, {user.name}</h1>
            <Channels />
            <NewChannelForm />
                    {user ? <Chat user={user} channel={selectedChannel} /> : <div>Please log in to access the chat.</div>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
