import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/listings/`);
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div className="loading">Loading listings...</div>;

  return (
    <div className="main-container">
      <div className="hero-icon">📋</div>
      <h1>All Listings</h1>
      <p style={{marginBottom: '2rem', color: '#666'}}>
        Discover items available for exchange
      </p>
      
      <button 
        className="btn-secondary" 
        onClick={() => navigate('/create')}
        style={{marginBottom: '2rem'}}
      >
        ➕ Create New Listing
      </button>
      
      <div className="listing-grid">
        {Array.isArray(listings) && listings.length > 0 ? (
          listings.map(listing => (
            <div className="listing-item" key={listing.id}>
              <h3 style={{color: '#667eea', marginBottom: '0.5rem'}}>
                {listing.title}
              </h3>
              <p style={{marginBottom: '0.5rem'}}>{listing.description}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 'bold', color: '#4fd1c7'}}>
                  ₹{listing.cash_value}
                </span>
                <span style={{fontSize: '0.9rem', color: '#666'}}>
                  📍 {listing.location || 'Location not specified'}
                </span>
              </div>
              {listing.tags && (
                <div style={{marginTop: '0.5rem', fontSize: '0.8rem', color: '#888'}}>
                  🏷️ {listing.tags}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card">
            <p style={{textAlign: 'center', color: '#666'}}>
              No listings available yet. Be the first to create one! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}