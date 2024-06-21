import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure you import useAuth
import './Login.css';
import './Style.css';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Destructure setUser function from useAuth
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username }),
            });

            const responseData = await response.json();

            if (response.status === 200) {
                const { token, message, user } = responseData;

                // Update user context with setUser function
                setUser({ ...user, token });

                // Save the token to localStorage
                localStorage.setItem('accessToken', token);

                // Display success message and clear error
                setMessage(message);
                setError('');

                // Redirect to dashboard after successful login
                navigate('/dashboard');
            } else {
                // If login fails, show error message
                setError('Failed to login. Please check your credentials and try again.');
                console.error('Login failed:', responseData.message);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Login error:', error);
            setError('Error logging in. Please try again later.');
        }
    };

    return (
        <div className="card">
            <div className="card-image">
                <div className="card-welcome">
                    <h1>Login</h1>
                    <Link to="/signup" className="register-button">Register</Link>
                </div>
            </div>
            <div className="card-content">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
