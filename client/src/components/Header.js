import React from 'react';
import { useAuth } from './AuthContext';

const Header = () => {
    const { user } = useAuth();

    return (
        <header>
            <nav>
                <ul>
                    <li>Welcome, {user.username}!</li>
                    {/* Add other header links and components */}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
