import {React} from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function ListingsPage() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        axios.get('/api/listings')
            .then(response => setListings(response.data))
            .catch(error => console.error('Error fetching listings:', error));
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/create-listing">
                    <button>Create Listing</button>
                </Link>
            </div>
            <h2>All Listings</h2>
            <ul>
                {listings.map(listing => (
                    <li key={listing.id}>
                        <strong>{listing.title}</strong> - {listing.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListingsPage;