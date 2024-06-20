import React from 'react';
import { useAuth } from '../AuthContext';
import Chat from '../components/Chat';

const Dashboard = () => {
    const { user } = useAuth(); // Assuming useAuth returns { user }


    
    return (
        <Chat user={user} />
    );
};

export default Dashboard;
