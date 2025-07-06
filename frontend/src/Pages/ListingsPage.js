import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);

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