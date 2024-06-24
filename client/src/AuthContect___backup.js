import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Importing js-cookie to handle cookies

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initialize loading state to true
    const [error, setError] = useState('');

    // Function to fetch the current user
    const fetchCurrentUser = async () => {
        const storedToken = localStorage.getItem('accessToken') || Cookies.get('accessToken'); // Retrieve token from localStorage or cookies
        console.log('Stored Token:', storedToken); // Debugging: Log the token
        if (storedToken) {
            setLoading(true); // Set loading state to true while fetching data
            try {
                const response = await fetch('http://localhost:5000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`, // Attach token in the request headers
                    },
                });
                console.log('Fetch User Response:', response); // Debugging: Log the response
                if (response.ok) {
                    const userData = await response.json();
                    console.log('User Data:', userData); // Debugging: Log the user data
                    setUser(userData); // Update the user state with fetched data
                    setError(''); // Clear any previous errors
                } else {
                    const errorData = await response.json();
                    console.error('Fetch User Error Data:', errorData); // Debugging: Log the error data
                    setError(`Failed to fetch user details: ${errorData.message}`); // Set error message
                }
            } catch (error) {
                console.error('Fetch User Error:', error); // Debugging: Log the error
                setError('Failed to fetch user. Please try again later.'); // Set error message
            } finally {
                setLoading(false); // Set loading state to false after fetching data
            }
        } else {
            console.log('No stored token found.'); // Debugging: Log if no token is found
            setLoading(false); // Set loading state to false if no token is found
        }
    };

    // useEffect to fetch the current user when the component mounts or token changes
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken') || Cookies.get('accessToken'); // Check token on mount
        if (storedToken) {
            console.log('AuthProvider mounted. Fetching current user.'); // Debugging: Log when useEffect runs
            fetchCurrentUser(); // Initial fetch on component mount
        } else {
            console.log('No stored token found during mount.'); // Debugging: Log when no token is found
            setLoading(false); // Set loading state to false if no token is found
        }
    }, [/* Include dependencies that could change and trigger useEffect */]);

    // Function to handle login
    const login = async (credentials) => {
        setLoading(true); // Set loading state to true while logging in
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
                body: JSON.stringify(credentials), // Send credentials in the request body
            });
            const data = await response.json();
            console.log('Login Response:', response); // Debugging: Log the response
            console.log('Login Data:', data); // Debugging: Log the data
            if (response.ok) {
                localStorage.setItem('accessToken', data.token); // Store token in localStorage
                Cookies.set('accessToken', data.token, { expires: 7 }); // Store token in cookies for 7 days
                fetchCurrentUser(); // Fetch user details after login
                setError(''); // Clear any previous errors
            } else {
                setError('Login failed: ' + data.message); // Set error message
            }
        } catch (error) {
            console.error('Login Error:', error); // Debugging: Log the error
            setError('Login error: ' + error.message); // Set error message
        } finally {
            setLoading(false); // Set loading state to false after login attempt
        }
    };

    // Function to handle logout
    const logout = () => {
        console.log('Logging out...'); // Debugging: Log the logout action
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        Cookies.remove('accessToken'); // Remove token from cookies
        setUser(null); // Clear the user state
        window.location.href = '/login'; // Redirect to login page after logout
    };

    return (
        // Provide context values to children components
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
