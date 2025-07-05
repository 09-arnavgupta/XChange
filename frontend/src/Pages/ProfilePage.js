import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const accessToken = localStorage.getItem('access');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchProfile = async () => {
      const url = `${process.env.REACT_APP_API_BASE_URL}/users/${username}`
      console.log('Fetching user profile from:', url); // Debugging line

      try {
        const res = await axios.get(`http://localhost:8000/api/users/${username}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('User data:', res.data); // Debugging line
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [username, accessToken]);

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
