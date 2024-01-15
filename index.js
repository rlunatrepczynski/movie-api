const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect("mongodb://localhost:27017/cfDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let auth = require('./auth')(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const passport = require('passport');
require('./passport');


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(express.static('public'));

//default text response when at /
app.get("/", (req, res) => {
    res.send("Welcome to MyFlix!");
});

//Return a list of all movies to the user (READ)
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get all users (READ)
app.get("/users", passport.authenticate('jwt', { session: false }), function (req, res) {
    Users.find()
        .then(function (users) {
            res.status(201).json(users);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Return data about a single movie to the user (READ)
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Return data about a genre(description) by name/title (READ)
app.get("/movies/genres/:genreName", passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.genreName })
        .then((movies) => {
            res.json(movies.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Return data about a director by name (READ)
app.get("/movies/director/:directorName", passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.directorName })
        .then((movies) => {
            res.json(movies.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Allow new users to register (CREATE)
app.post("/users", async (req, res) => {
    await Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.username + "already exists");
            } else {
                Users.create({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday,
                })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

//Update a user's info, by username (UPDATE)
app.put("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.username },
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday,
            },
        },
        { new: true }
    ) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Allow users to remove a movie from their list of favorites (DELETE)
app.delete("/users/:username/movies/:MovieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { username: req.params.username },
            {
                $pull: { favoriteMovies: req.params.MovieID },
            },
            { new: true }
        );

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});


//Get a user by username (READ)
app.get("/users/:username", passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ username: req.params.username })
        .then((user) => {
            console.log("User:", user); // Log the user data
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Add a movie to a user's list of favorites (CREATE)
app.post("/users/:username/movies/:MovieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate(
        { username: req.params.username },
        {
            $push: { favoriteMovies: req.params.MovieID },
        },
        { new: true }
    ) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Delete a user by username (DELETE)
app.delete("/users/:username", passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndDelete({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + " was not found");
            } else {
                res.status(200).send(req.params.username + " was deleted");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});




// Error handling middleware function
// This should be placed last, but before app.listen()

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error: ' + err.message); // Send the actual error message
});

app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});


