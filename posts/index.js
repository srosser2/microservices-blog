const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const port = 4000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// no longer used
app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title
    }

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: posts[id]
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);
    res.send({});
})

app.listen(port, () => {
    console.log('v5');
    console.log(`Listening on port ${port}`)
});
