import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h1>Hello, {username} 👋</h1>
      <Link to="../profile">Go to Profile</Link><br />
      <Link to="../listings">View Listings</Link>
    </div>
  );
}

export default HomePage;
