import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = (localStorage.getItem('username') || '').trim(); // Or get from backend if you prefer

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
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [username]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">Unable to load profile</div>;

  return (
    <div className="main-container">
      <div className="hero-icon">👤</div>
      <h2>Your Profile</h2>
      
      <div className="card">
        <div style={{marginBottom: '1rem'}}>
          <strong>Username:</strong>
          <div style={{color: '#667eea', fontSize: '1.1rem'}}>{user.username}</div>
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <strong>Email:</strong>
          <div>{user.email}</div>
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <strong>Location:</strong>
          <div>{user.location || 'Not specified'}</div>
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <strong>Intent:</strong>
          <div>{user.intent || 'Not specified'}</div>
        </div>
        
        <div>
          <strong>Interests:</strong>
          <div>{user.interests || 'Not specified'}</div>
        </div>
      </div>
      
      <button className="btn-secondary">Edit Profile</button>
    </div>
  );
}

export default Profile;
