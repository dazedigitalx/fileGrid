import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        window.location.href = '/login'; // Redirect to login page after logout
    };

    const fetchUserDetails = async () => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            try {
                const response = await fetch('http://localhost:5000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data); // Set user state with fetched data
                    setError('');
                } else {
                    setError('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Fetch user error:', error);
                setError('Failed to fetch user. Please try again later.');
            }
        } else {
            console.log('No token found');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);


    

    return (
        <AuthContext.Provider value={{ user, setUser, logout, fetchUserDetails, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
