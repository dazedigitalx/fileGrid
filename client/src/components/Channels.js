import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const useFetchUserChannels = () => {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChannels = async () => {
            setLoading(true);
            setError(null);

            try {
                // Example: Fetch user-specific channels from your backend
                const response = await fetch('/api/user/channels', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Assuming you have a token in user context
                    },
                });

                if (response.ok) {
                    const channels = await response.json();
                    setChannels(channels);
                } else {
                    throw new Error(`Failed to fetch channels: ${response.statusText}`);
                }
            } catch (error) {
                setError(`Error fetching channels: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [user]); // Dependency on user ensures useEffect runs when user context changes

    return { channels, loading, error };
};

const Channels = () => {
    const { channels, loading, error } = useFetchUserChannels();

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
                    <li key={channel.id}>{channel.name} - {channel.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Channels;
