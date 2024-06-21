import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Channels = () => {
    const { user, fetchUserChannels } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setLoading(true);
                setError(null);
                const userChannels = await fetchUserChannels();
                setChannels(userChannels);
            } catch (error) {
                setError(error.message || 'Failed to fetch channels');
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [fetchUserChannels]);

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
            <Channels fetchUserChannels={fetchUserChannels} />

                {channels.map(channel => (
                    <li key={channel.id}>{channel.name} - {channel.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Channels;
