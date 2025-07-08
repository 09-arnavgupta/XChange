import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/`, credentials, {
      withCredentials: true, // Important: send/receive cookies
    });
    localStorage.setItem('username', credentials.username); // You can keep this if needed
    alert('Logged in!');
    navigate('/home');
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Login failed');
  }
};

  return (
    <form onSubmit={handleLogin}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
