const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = 4005;
const app = express();
app.use(bodyParser.json());

const events = []

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    console.log(event);

    try {
        axios.post('http://posts-clusterip-srv:4000/events', event).catch(err => console.log(err.message, 'posts'));
        axios.post('http://comments-clusterip-srv:4001/events', event).catch(err => console.log(err.message, 'comments'));
        axios.post('http://query-clusterip-srv:4002/events', event).catch(err => console.log(err.message, 'query'));
        axios.post('http://moderation-clusterip-srv:4003/events', event).catch(err => console.log(err.message, 'moderation'));
    } catch (err) {
        console.log(err);
    }

    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
    res.send(events);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
