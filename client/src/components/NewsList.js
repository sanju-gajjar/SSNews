import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/news')
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleReadMore = (id) => {
        navigate(`/news/${id}`);
    };

    return (
        <div className="news-list">
            <h1>News List</h1>
            <ul>
                {newsList.map(news => (
                    <li key={news._id}>
                        <h2>{news.title}</h2>
                        <p>{news.content.substring(0, 100)}...</p>
                        <button onClick={() => handleReadMore(news._id)}>Read More</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewsList;
