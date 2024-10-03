const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


const words = ["NINJA", "APPLE", "GAMER", "RIDER", "TOWER", "BEACH", "START"]

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/api/random-word', (req, res) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    res.json({word: randomWord});
});


app.get('/', function (req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
