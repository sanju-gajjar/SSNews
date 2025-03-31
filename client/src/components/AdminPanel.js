import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [formData, setFormData] = useState({ title: '', content: '', author: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/news', formData)
            .then(response => alert('News added successfully'))
            .catch(error => console.error(error));
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
                <textarea name="content" placeholder="Content" onChange={handleChange} required />
                <input type="text" name="author" placeholder="Author" onChange={handleChange} required />
                <button type="submit">Add News</button>
            </form>
        </div>
    );
};

export default AdminPanel;
