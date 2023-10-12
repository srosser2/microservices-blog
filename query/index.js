const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = 4002;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        console.log(post);
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, postId, status, content } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (_req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    const res = await axios.get('http://event-bus-srv:4005/events')
        .catch(err => console.log(err));

    for (let event of res.data) {
        console.log(`Processing event: ${event.type}`);
        handleEvent(event.type, event.data);
    }
});
