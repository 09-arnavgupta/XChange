import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/listings/`)
      .then(res => {
        console.log("API Response:", res.data); // Check this!
        setListings(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Listings</h1>
      <button onClick={() => navigate('/create-listing')}>Create Listing</button>
      <ul>
        {Array.isArray(listings) && listings.map(listing => (
          <li key={listing.id}>
            <strong>{listing.title}</strong>: {listing.description} ({listing.cash_value}₹)
          </li>
        ))}
      </ul>
    </div>
  );
}