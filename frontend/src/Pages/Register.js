import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    interests: '',
    intent: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register/`, form);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'location', label: 'Location', type: 'text', required: false },
    { name: 'interests', label: 'Interests', type: 'text', required: false },
    { name: 'intent', label: 'Intent', type: 'text', required: false }
  ];

  return (
    <div className="main-container">
      <div className="hero-icon">📝</div>
      <h2>Join XChange</h2>
      <p style={{marginBottom: '2rem', color: '#666'}}>Create your account to start exchanging</p>
      
      <form onSubmit={handleSubmit} style={{width: '100%'}}>
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <p style={{marginTop: '1.5rem', color: '#666'}}>
        Already have an account? <a href="/login" style={{color: '#667eea'}}>Sign in</a>
      </p>
    </div>
  );
}

export default Register;
