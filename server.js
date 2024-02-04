const express = require('express');
const path = require('path');

const app = express();
const port = 80;

// Serve static files from the 'public' directory
app.use(express.static(path.join('public')));

app.get('/', (req, res) => {
    res.sendFile(path.join('index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});