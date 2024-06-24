import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Chat from './Chat'; // Assuming Chat component is in the same directory

const Channels = () => {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [errorChannels, setErrorChannels] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null); // State to track active channel
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDescription, setNewChannelDescription] = useState('');

    useEffect(() => {
        const fetchChannels = async () => {
            setLoadingChannels(true);
            setErrorChannels(null);

            try {
                if (!user || !user.token) {
                    throw new Error('User not authenticated or token not available.');
                }

                const response = await fetch('http://localhost:5000/api/channels/', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch channels: ${response.statusText}`);
                }

                const data = await response.json();
                // Filter channels to only include those belonging to the authenticated user
                const userChannels = data.filter(channel => channel.creator_id === user.id);
                setChannels(userChannels);
            } catch (error) {
                console.error('Error fetching channels:', error);
                setErrorChannels(`Error fetching channels: ${error.message}`);
            } finally {
                setLoadingChannels(false);
            }
        };

        fetchChannels();
    }, [user]);

    const handleChannelClick = (channel) => {
        setActiveChannel(channel); // Set the clicked channel as active
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setLoadingChannels(true);
        setErrorChannels(null);

        try {
            if (!user || !user.token) {
                throw new Error('User not authenticated or token not available.');
            }

            // Basic validation
            if (!newChannelName || !newChannelDescription) {
                throw new Error('Channel Name and Description are required.');
            }

            const response = await fetch('http://localhost:5000/api/channels/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newChannelName,
                    description: newChannelDescription,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create channel: ${response.statusText}`);
            }

            const newChannel = await response.json();
            setChannels([...channels, newChannel]);
            setNewChannelName('');
            setNewChannelDescription('');
        } catch (error) {
            console.error('Error creating channel:', error);
            setErrorChannels(`Error creating channel: ${error.message}`);
        } finally {
            setLoadingChannels(false);
        }
    };

    if (loadingChannels) {
        return <div>Loading channels...</div>;
    }

    if (errorChannels) {
        return <div>Error: {errorChannels}</div>;
    }

    return (
        <div>
            <h2>Your Channels</h2>
            <ul>
                {channels.map(channel => (
                    <li key={channel.id} onClick={() => handleChannelClick(channel)}>
                        {channel.name} - {channel.description} {activeChannel && activeChannel.id === channel.id ? "(Active)" : ""}
                    </li>
                ))}
            </ul>
            {activeChannel && (
                <Chat
                    channel={activeChannel}
                    user={user}
                    channels={channels}
                    setChannels={setChannels}
                />
            )}
            
            <h3>Create New Channel</h3>
            <form onSubmit={handleCreateChannel}>
                <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Channel Name"
                    required
                />
                <input
                    type="text"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    placeholder="Channel Description"
                    required
                />
                <button type="submit">Create Channel</button>
            </form>
        </div>
    );
};

export default Channels;
