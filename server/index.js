const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors())

// Connect to MongoDB
mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(bodyParser.json());

// News Schema and Model
const newsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    likes: { type: Number, default: 0 },
    comments: [{ user: String, comment: String }],
    createdAt: { type: Date, default: Date.now }
});

const News = mongoose.model('News', newsSchema);

// Routes
// Admin: Add news
app.post('/news', async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Admin: Update news
app.put('/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Admin: Delete news
app.delete('/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get all news
app.get('/news', async (req, res) => {
    try {
        const news = await News.find();
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get news details
app.post('/news/details', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Like a news
app.post('/news/like', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        news.likes += 1;
        await news.save();
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Get all comments for a news
app.post('/news/comments', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        res.send(news.comments);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Add a comment to a news
app.post('/news/comments/add', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        news.comments.push({ user: req.body.user, comment: req.body.comment });
        await news.save();
        res.send(news.comments[news.comments.length - 1]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User: Delete a comment from a news
app.post('/news/comments/delete', async (req, res) => {
    try {
        const news = await News.findById(req.body.id);
        if (!news) return res.status(404).send('News not found');
        const commentIndex = news.comments.findIndex(comment => comment._id.toString() === req.body.commentId);
        if (commentIndex === -1) return res.status(404).send('Comment not found');
        news.comments.splice(commentIndex, 1);
        await news.save();
        res.send(news);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.listen(8080, () => {
    console.log('server listening on port 8080')
})
