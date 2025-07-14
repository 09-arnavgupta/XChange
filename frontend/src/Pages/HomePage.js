import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function HomePage() {
  const username = localStorage.getItem('username');
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: '👤 Profile', icon: '👤' },
    { path: '/listings', label: '📋 Listings', icon: '📋' },
    { path: '/create-listing', label: '➕ Create', icon: '➕' },
    { path: '/logout', label: '🚪 Logout', icon: '🚪' }
  ];

  return (
    <div className="main-container">
      <div className="hero-icon">🏠</div>
      <h1>Welcome, {username}! 👋</h1>
      <p style={{marginBottom: '2rem', color: '#666'}}>Ready to exchange something today?</p>
      <div className="navbar">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="card">
        <h3 style={{color: '#667eea', marginBottom: '1rem'}}>Quick Stats</h3>
        <p>🔄 Active Exchanges: 3</p>
        <p>📦 Items Listed: 5</p>
        <p>⭐ Rating: 4.8/5</p>
      </div>
      {/* Floating AI Agent Button outside the card, fixed to bottom right */}
      <Link to="/aiagent" className="aiagent-fab" title="AI Agent">
        🤖
      </Link>
    </div>
  );
}

export default HomePage;
