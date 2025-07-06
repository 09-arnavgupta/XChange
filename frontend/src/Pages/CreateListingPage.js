import React, { useState } from 'react';
import axios from 'axios';

export default function CreateListingPage() {
  const [form, setForm] = useState({
    title: '', description: '', expected_item: '',
    cash_value: '', tags: '', location: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/listings/`, form)
      .then(() => alert("Listing created!"))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Listing</h2>
      {["title", "description", "expected_item", "cash_value", "tags", "location"].map(field => (
        <div key={field}>
          <input
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required={field !== "tags" && field !== "location"}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
