import React from 'react';
import { useAuth } from './AuthContext'; // Assuming AuthContext is correctly implemented
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth(); // Assuming useAuth hook provides authenticated user details

    if (!user) {
        // If user is not authenticated, redirect to login page
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Welcome, {user.email}!</h1>
            <p>This is your dashboard page.</p>
            {/* Add more dashboard content as needed */}
        </div>
    );
};

export default Dashboard;
