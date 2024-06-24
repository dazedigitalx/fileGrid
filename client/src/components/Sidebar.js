import React from 'react';
import './Sidebar.css'; // Import or adjust styles as needed
import Channels from './Channels'; // Import Channels component

const Sidebar = ({ isOpen, toggleSidebar, channels, passActiveChannel, handleCreateChannel }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? 'Collapse' : 'Expand'}
            </button>
            <ul className="menu">
                <li>Menu Item 1</li>
                <li>Menu Item 2</li>
                <li>Menu Item 3</li>
            </ul>
            {/* Render Channels component with props */}
            <Channels channels={channels} passActiveChannel={passActiveChannel} />
            {/* Create New Channel Button */}
            <button onClick={handleCreateChannel}>Create New Channel</button>
        </div>
    );
};

export default Sidebar;
