import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TAG_OPTIONS = ["Clothing", "Electronics", "Books", "Shoes", "Accessories", "Other"];

export default function CreateListingPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    expected_item: '',
    cash_value: '',
    tags: [],
    location: '',
    images: [] // multiple images
  });

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleTagAdd = tag => {
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput('');
    }
  };

  const handleTagRemove = tag => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleAutocompleteDescription = async () => {
    if (!form.images.length) {
      alert('Please upload at least one image first.');
      return;
    }

    const formData = new FormData();
    form.images.forEach(img => formData.append('images', img));
    formData.append('title', form.title);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/listings/ai-agent/`,
        formData
      );
      setForm(f => ({ ...f, description: res.data.features?.description || '' }));
    } catch (err) {
      console.error(err);
      alert('Failed to generate description.');
    }
  };

  const handleAutocompleteTags = async () => {
    if (!form.images.length) {
      alert('Please upload at least one image first.');
      return;
    }

    const formData = new FormData();
    form.images.forEach(img => formData.append('images', img));
    formData.append('title', form.title);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/listings/ai-agent/`,
        formData
      );
      setForm(f => ({ ...f, tags: res.data.features?.tags || [] }));
    } catch (err) {
      console.error(err);
      alert('Failed to generate tags.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'tags') {
          submitData.append('tags', JSON.stringify(value));
        } else if (key === 'images') {
          value.forEach(img => submitData.append('images', img));
        } else {
          submitData.append(key, value);
        }
      });

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/listings/create/`, submitData, {
        withCredentials: true
      });

      navigate('/listings');
      alert('Listing created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="hero-icon">📝</div>
      <h2>Create New Listing</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Share what you want to exchange</p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {/* TITLE FIRST */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Images (multiple allowed)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
          />
          <button type="button" onClick={handleAutocompleteDescription} style={{ marginLeft: 8 }}>
            Autocomplete
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
            {form.tags.map(tag => (
              <span
                key={tag}
                className="tag-box"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  background: '#f5f5f7',
                  borderRadius: '16px',
                  padding: '8px 24px 8px 12px',
                  margin: '2px 6px 2px 0',
                  fontSize: '0.95rem',
                  color: '#1d1d1f',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  minWidth: '48px',
                  minHeight: '28px',
                }}
              >
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => handleTagRemove(tag)}
                  style={{
                    position: 'absolute',
                    top: '-17px',
                    right: '0px',
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    width: '16px',
                    height: '16px',
                    display: 'block',
                  }}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Add tag"
            style={{ marginRight: '8px' }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleTagAdd(tagInput.trim());
              }
            }}
          />
          <button type="button" onClick={handleAutocompleteTags} style={{ marginLeft: 8 }}>
            Autocomplete
          </button>
          <div style={{ marginTop: '8px' }}>
            {TAG_OPTIONS.filter(tag => !form.tags.includes(tag)).map(tag => (
              <button
                key={tag}
                type="button"
                style={{
                  background: '#391250e8',
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  marginRight: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleTagAdd(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Expected Item</label>
          <input
            type="text"
            name="expected_item"
            placeholder="Enter expected item"
            value={form.expected_item}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cash Value (₹)</label>
          <input
            type="number"
            name="cash_value"
            placeholder="Enter cash value"
            value={form.cash_value}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
