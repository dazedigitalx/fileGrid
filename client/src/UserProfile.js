import React from 'react';
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not authenticated.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      {/* Display additional user details as needed */}
    </div>
  );
};

export default UserProfile;
