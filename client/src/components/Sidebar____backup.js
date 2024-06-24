import React, { useState } from 'react';
import './Sidebar.css'; // Adjust styles as needed
import Channels from './Channels'; // Import Channels component

const Sidebar = ({ isOpen, toggleSidebar, onChannelSelect }) => {
  const [selectedChannel, setSelectedChannel] = useState(null); // State to track selected channel

  // Function to handle selecting a channel
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    onChannelSelect(channel); // Pass selected channel to parent component
  };

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
      <Channels onSelect={handleChannelSelect} />
    </div>
  );
};

export default Sidebar;
