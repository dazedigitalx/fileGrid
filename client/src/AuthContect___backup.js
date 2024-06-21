import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.token);
                setUser(data.user);
                setError('');
            } else {
                setError('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login error: ' + error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        window.location.href = '/login'; // Redirect to login page after logout
    };

    const fetchUserDetails = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, fetchUserDetails, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
