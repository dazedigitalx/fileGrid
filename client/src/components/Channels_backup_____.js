import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Assuming your AuthContext is correctly imported

const Channels = ({ onChannelSelect, onCreateChannel }) => {
    const { user } = useAuth(); // Accessing user from AuthContext
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDescription, setNewChannelDescription] = useState('');

    useEffect(() => {
        const fetchUserChannels = async () => {
            setLoading(true);
            setError(null);

            try {
                let token = user?.token || localStorage.getItem('accessToken');

                if (!token) {
                    throw new Error('Token not available.');
                }

                const response = await fetch('http://localhost:5000/api/channels/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized: Please login again.');
                    }
                    throw new Error(`Failed to fetch channels: ${response.statusText}`);
                }

                const data = await response.json();
                // Filter channels to only include those belonging to the authenticated user
                const userChannels = data.filter(channel => channel.creator_id === user.id);
                setChannels(userChannels);
            } catch (error) {
                setError(`Error fetching channels: ${error.message}`);
                console.error('Error fetching channels:', error); // Log detailed error information
            } finally {
                setLoading(false);
            }
        };

        fetchUserChannels();
    }, [user]); // Fetch channels whenever user changes

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let token = user?.token || localStorage.getItem('accessToken');

            if (!token) {
                throw new Error('Token not available.');
            }

            // Basic validation
            if (!newChannelName || !newChannelDescription) {
                throw new Error('Channel Name and Description are required.');
            }

            // Make API request to create channel
            const response = await fetch('http://localhost:5000/api/channels/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newChannelName,
                    description: newChannelDescription,
                    creator_id: user.id
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please login again.');
                }
                throw new Error(`Failed to create channel: ${response.statusText}`);
            }

            const newChannel = await response.json();

            // Update channels state with the new channel
            setChannels([...channels, newChannel]);

            // Notify parent about the new channel
            onCreateChannel(newChannel);

            // Clear input fields after successful creation
            setNewChannelName('');
            setNewChannelDescription('');

            console.log('Created Channel:', newChannel.id, 'User ID:', user.id); // Log new channel ID and user ID
        } catch (error) {
            setError(`Error creating channel: ${error.message}`);
            console.error('Error creating channel:', error); // Log detailed error information
        } finally {
            setLoading(false);
        }
    };

    const handleChannelClick = (channel) => {
        onChannelSelect(channel); // Notify parent component
    };

    if (loading) {
        return <div>Loading channels...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Channels</h2>
            <ul>
                {channels.map(channel => (
                    <li key={channel.id} onClick={() => handleChannelClick(channel)}>
                        {channel.name} - {channel.description}
                    </li>
                ))}
            </ul>

            <h3>Create New Channel</h3>
            <form onSubmit={handleCreateChannel}>
                <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Create Channel Name"
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
