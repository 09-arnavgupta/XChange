import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const username = localStorage.getItem('username'); // Or get from backend if you prefer

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/${username}/`,
          { withCredentials: true } // Send cookies
        );
        setUser(res.data);
        console.log('User profile fetched:', res.data);
      } catch (err) {
        console.error('Error fetching user:', err.response?.data || err.message);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Intent:</strong> {user.intent}</p>
      <p><strong>Interests:</strong> {user.interests}</p>
    </div>
  );
}

export default Profile;
