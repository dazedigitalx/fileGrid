import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Channels from './Channels'; // Import Channels module
import Chat from './Chat'; // Import Chat component
import './Dashboard.css'; // Ensure correct import path for CSS

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeChannel, setActiveChannel] = useState(null); // State to track active channel
    const [channels, setChannels] = useState([]); // State to store channels

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Function to handle creation of a new channel
    const handleCreateChannel = () => {
        // Example: Generate a new channel
        const newChannel = {
            id: channels.length + 1,
            name: `Channel ${channels.length + 1}`,
            description: `Description for Channel ${channels.length + 1}`,
        };

        // Update channels state with the new channel
        setChannels([...channels, newChannel]);

        // Set the new channel as active
        setActiveChannel(newChannel);
    };

    return (
        <div className="dashboard">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                channels={channels}
                passActiveChannel={setActiveChannel}
                handleCreateChannel={handleCreateChannel}
            />
            <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                <Header />
                <div className={`dashboard-main ${sidebarOpen ? '' : 'contracted'}`}>
                    <h2>Welcome to Dashboard</h2>
                    <Channels channels={channels} setActiveChannel={setActiveChannel} />
                    {activeChannel && <Chat channel={activeChannel} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
