const express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let topTenMovies = [
    {
        title: 'Happy Gilmore',
        diretor: 'Dennis Dugan'
    },
    {
        title: 'Mean Girls',
        director: 'Mark Waters'
    },
    {
        title: 'Twilight',
        director: 'Catherine Hardwicke'
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg'
    },
    {
        title: 'Gladiator',
        director: 'Ridley Scott'
    },
    {
        title: 'Alien',
        director: 'Ridley Scott'
    },
    {
        title: 'The Departed',
        director: 'Martin Scorsese'
    },
    {
        title: 'Harry Potter and the Sorcer\'s Stone',
        director: 'Chris Columbus'
    },
    {
        title: 'Spirited Away',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Everything Everywhere All at Once',
        director: 'Daniel Kwan, Daniel Scheinert'
    }
]

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to Movie Flix')
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});
