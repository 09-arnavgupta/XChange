import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    interests: '',
    intent: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/register/', form);
      alert('User registered!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="interests" placeholder="Interests" onChange={handleChange} />
      <input name="intent" placeholder="Intent" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
