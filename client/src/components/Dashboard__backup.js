import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Channels from './Channels'; // Import Channels module
import './Dashboard.css'; // Ensure correct import path for CSS

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`dashboard-content ${sidebarOpen ? 'expanded' : ''}`}>
                <Header />
                <div className={`dashboard-main ${sidebarOpen ? '' : 'contracted'}`}>
                    <Channels /> {/* Render Channels module */}
                    <h2>Welcome to Dashboard</h2>
                    <p>Header content...</p>
                    <p>Main content...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
