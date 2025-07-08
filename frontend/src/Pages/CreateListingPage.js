import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateListingPage() {
  const [form, setForm] = useState({
    title: '', description: '', expected_item: '',
    cash_value: '', tags: '', location: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/listings/`, form, {withCredentials: true});
      navigate('/listings');
    } catch (err) {
      console.error(err);
      alert('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'description', label: 'Description', required: true },
    { name: 'expected_item', label: 'Expected Item', required: true },
    { name: 'cash_value', label: 'Cash Value (₹)', required: true, type: 'number' },
    { name: 'tags', label: 'Tags', required: false },
    { name: 'location', label: 'Location', required: false }
  ];

  return (
    <div className="main-container">
      <div className="hero-icon">📝</div>
      <h2>Create New Listing</h2>
      <p style={{marginBottom: '2rem', color: '#666'}}>Share what you want to exchange</p>
      
      <form onSubmit={handleSubmit} style={{width: '100%'}}>
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            {field.name === 'description' ? (
              <textarea
                name={field.name}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                rows={3}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
