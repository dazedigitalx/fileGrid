import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Chat from './Chat'; // Assuming Chat component is in the same directory

const Channels = () => {
    const { user, setUser } = useAuth(); // Assuming setUser is provided by AuthContext
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null); // State to track active channel
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDescription, setNewChannelDescription] = useState('');

    // Function to get the token from local storage or cookies
    const getToken = () => {
        return localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    };

    useEffect(() => {
        const fetchUserChannels = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = getToken();

                if (!user || !token) {
                    throw new Error('User or token not available.');
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
                const userChannels = data.filter(channel => channel_id.creator_id === user.id);
                setChannels(userChannels);
            } catch (error) {
                setError(`Error fetching channels: ${error.message}`);
                console.error('Error fetching channels:', error); // Log detailed error information
            } finally {
                setLoading(false);
            }
        };

        const token = getToken();
        if (token) {
            if (!user) {
                // If user is not available in context, fetch user info using the token
                fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    fetchUserChannels();
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                    setError('Failed to authenticate user. Please login again.');
                });
            } else {
                fetchUserChannels();
            }
        } else {
            setLoading(false);
            setError('No token found. Please login again.');
        }
    }, [user]);

    const handleChannelClick = (channel) => {
        setActiveChannel(channel); // Set the clicked channel as active
        console.log('Clicked Channel:', creator_id, 'User ID:', user.id); // Log channel ID and user ID
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = getToken();

            if (!user || !token) {
                throw new Error('User or token not available.');
            }

            // Basic validation
            if (!newChannelName || !newChannelDescription) {
                throw new Error('Channel Name and Description are required.');
            }

            // Optimistically update UI
            const tempChannel = { name: newChannelName, description: newChannelDescription, creator_id: user.id };
            setChannels([...channels, tempChannel]);
            setNewChannelName('');
            setNewChannelDescription('');

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

            // Update channels state with the actual response from the server
            setChannels([...channels, newChannel]);

            console.log('Created Channel:', newChannel.id, 'User ID:', user.id); // Log new channel ID and user ID
        } catch (error) {
            setError(`Error creating channel: ${error.message}`);
            console.error('Error creating channel:', error); // Log detailed error information
        } finally {
            setLoading(false);
        }
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
            <div>
                <p>Authenticated User: {user ? `${user.username} (${user.email})` : 'Not authenticated'}</p>
            </div>
            <ul>
                {channels.map(channel => (
                    <li key={channel.id} onClick={() => handleChannelClick(channel)}>
                        {channel.name} - {channel.description} {activeChannel && activeChannel.id === channel.id ? "(Active)" : ""}
                    </li>
                ))}
            </ul>
            {activeChannel && <Chat channel={activeChannel} />}
            
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
