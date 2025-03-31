import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        axios.post(`http://localhost:8080/news/details`, { id })
            .then(response => {
                setNews(response.data);
                setLikes(response.data.likes);
            })
            .catch(error => console.error(error));
    }, [id]);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        axios.post(`http://localhost:8080/news/comments`, { id })
            .then(response => setComments(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!news) return <div>Loading...</div>;

    const handleAddComment = () => {
        if (newComment.trim()) {
            axios.post(`http://localhost:8080/news/comments/add`, { id, user: 'Anonymous', comment: newComment })
                .then(response => {
                    setComments([...comments, response.data]);
                    setNewComment('');
                })
                .catch(error => console.error(error));
        }
    };

    const handleDeleteComment = (commentId) => {
        axios.post(`http://localhost:8080/news/comments/delete`, { id, commentId })
            .then(() => {
                setComments(comments.filter(comment => comment._id !== commentId));
            })
            .catch(error => console.error(error));
    };

    const handleLike = () => {
        axios.post(`http://localhost:8080/news/like`, { id })
            .then(() => setLikes(likes + 1))
            .catch(error => console.error(error));
    };

    return (
        <div className="news-details">
            <h1>{news.title}</h1>
            <p>{news.content}</p>
            <p><strong>Author:</strong> {news.author}</p>
            <p><strong>Likes:</strong> {likes}</p>
            <button onClick={handleLike}>Like</button>

            <div className="comments-section">
                <h2>Comments</h2>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <p><strong>{comment.user}:</strong> {comment.comment}</p>
                            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>
    );
};

export default NewsDetails;
