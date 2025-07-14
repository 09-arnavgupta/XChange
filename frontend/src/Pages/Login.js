import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login/`, credentials, {
        withCredentials: true,
      });
      localStorage.setItem('username', credentials.username.trim());
      navigate('/home');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="hero-icon">🔐</div>
      <h2>Welcome Back</h2>
      <p style={{marginBottom: '2rem', color: '#666'}}>Sign in to your XChange account</p>
      
      <form onSubmit={handleLogin} style={{width: '100%'}}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input 
            name="username" 
            placeholder="Enter your username" 
            onChange={handleChange}
            value={credentials.username}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            name="password" 
            placeholder="Enter your password" 
            type="password" 
            onChange={handleChange}
            value={credentials.password}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p style={{marginTop: '1.5rem', color: '#666'}}>
        Don't have an account? <a href="/register" style={{color: '#667eea'}}>Sign up</a>
      </p>
    </div>
  );
}

export default Login;
