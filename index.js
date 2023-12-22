const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let users = [
    {
        id: 1,
        name: "Jim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Beth",
        favoriteMovies: ["Mean Girls"]
    },
];

let movies = [
    {
        'Title': 'Happy Gilmore',
        'Description': "Happy Gilmore is a short-tempered, unsuccessful ice hockey player whose only skills are fighting and a powerful slapshot he learned from his late father.",
        'Genre': {
            'Name': 'Comedy',
            'Description': "A comedy film is a category of film which emphasizes humor. These films are designed to amuse audiences and make them laugh."
        },
        'Director': {
            'Name': "Dennis Dugan",
            'Bio': "Dennis Barton Dugan (born September 5, 1946) is an American film director, actor, and comedian. He is known for directing the films Problem Child, Brain Donors, Beverly Hills Ninja and National Security, and his partnership with comedic actor Adam Sandler, for whom he directed the films Happy Gilmore, Big Daddy, The Benchwarmers, I Now Pronounce You Chuck & Larry, You Don't Mess with the Zohan, Grown Ups, Just Go with It, Jack and Jill and Grown Ups 2. Dugan is a four-time Golden Raspberry Award for Worst Director nominee, winning once.",
            'Birth': '1946'
        },
        "ImageURL": "https://images.moviesanywhere.com/7308ccb67815dd9d2c50517d3ee3d91e/f9285756-768d-4fef-9c8c-69edb4d3c832.jpg",
        "Featured": false


    },
    {
        'Title': 'Mean Girls',
        'Description': "Sixteen-year-old homeschooled Cady Heron and her parents return to the United States after 12 years in Africa, settling in Evanston, Illinois. After an intimidating first day at North Shore High School, Cady befriends outsiders Janis Ian and Damian Leigh, who explain the school's various cliques and warn her to avoid the \"Plastics\", a clique consisting of wealthy but insecure Gretchen Wieners, sweet but dimwitted Karen Smith, and \"queen bee\" Regina George. When Cady is invited to sit with the Plastics at lunch, Janis persuades her to infiltrate them.",
        'Genre': {
            'Name': 'Comedy',
            'Description': "A comedy film is a category of film which emphasizes humor. These films are designed to amuse audiences and make them laugh."
        },
        'Director': {
            'Name': "Mark Waters",
            'Bio': "Waters was raised in South Bend, Indiana. He studied at the University of Pennsylvania in theatre arts before studying at the American Film Institute. When studying at Penn, he saw The House of Yes and saw things in the play that he felt he could make cinematic. He contacted the author of the play in Wendy MacLeod and got a manuscript copy by saying he was a film producer. He worked as a stage actor and director in Philadelphia and San Francisco before his work with AFI, where he graduated in 1994. He made a number of short films.",
            'Birth': '1964'
        },
        "ImageURL": "https://resizing.flixster.com/HtZiEfthbBdM_Idd_OB4ZsyfgMk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzI2MTVlZjAyLTc1NTAtNGE2Zi1iNzk0LTQxN2ZmMTIyYzRiMC5qcGc=",
        "Featured": false
    },
    {
        'Title': 'Twilight',
        'Description': "Seventeen-year-old Bella Swan leaves Phoenix, Arizona and moves to Forks, a small town located on Washington state's Olympic Peninsula, to live with her father, Charlie, the town's police chief. Her mother, Renée, is remarried to Phil, a minor league baseball player whose career often keeps them on the road.",
        'Genre': {
            'Name': 'Fantasy',
            'Description': "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
        },
        'Director': {
            'Name': "Catherine Hardwicke",
            'Bio': "Helen Catherine Hardwicke (born October 21, 1955) is an American film director, production designer, and screenwriter. Her directorial work includes Thirteen (2003), which she co-wrote with Nikki Reed, the film's co-star, Lords of Dogtown (2005), The Nativity Story (2006), Twilight (2008), Red Riding Hood (2011), Plush (2013), Miss You Already (2015), Miss Bala (2019), and Prisoner's Daughter (2022).",
            'Birth': '1955'
        },
        "ImageURL": "https://bloximages.chicago2.vip.townnews.com/wataugademocrat.com/content/tncms/assets/v3/editorial/a/98/a98f70a6-48c3-11ed-8a2d-c31ae8992b6a/63445ac7da4fc.image.jpg?resize=333%2C500",
        "Featured": false
    },
    {
        'Title': 'Jurassic Park',
        'Description': "Industrialist John Hammond has created Jurassic Park, a theme park of cloned dinosaurs, on the tropical Isla Nublar. After a Velociraptor kills a dinosaur handler, the park's investors, represented by lawyer Donald Gennaro, demand a safety certification. Gennaro invites chaotician Ian Malcolm, and Hammond invites paleontologist Alan Grant and paleobotanist Ellie Sattler. Upon arrival, the group is shocked to see a live Brachiosaurus and a whole herd of other dinosaurs.",
        'Genre': {
            'Name': 'Sci-Fi',
            'Description': "Science fiction (or sci-fi or SF) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies. Science fiction films have often been used to focus on political or social issues, and to explore philosophical issues like the human condition."
        },
        'Director': {
            'Name': "Steven Spielberg",
            'Bio': "Steven Allan Spielberg, born December 18, 1946) is an American film director, producer and screenwriter. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.[1] He is the recipient of many accolades, including three Academy Awards, two BAFTA Awards, and four Directors Guild of America Awards, as well as the AFI Life Achievement Award in 1995, the Kennedy Center Honor in 2006, the Cecil B. DeMille Award in 2009 and the Presidential Medal of Freedom in 2015. Seven of his films have been inducted into the National Film Registry by the Library of Congress as \"culturally, historically or aesthetically significant\".",
            'Birth': '1946'
        },
        "ImageURL": "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_.jpg",
        "Featured": false
    },
    {
        'Title': 'Gladiator',
        'Description': "In 180 AD, Hispano-Roman General Maximus Decimus Meridius intends to return home after he leads the Roman army to victory against Germanic tribes near Vindobona on the Limes Germanicus. Emperor Marcus Aurelius tells Maximus that his own son, Commodus, is unfit to rule and that he wishes Maximus to succeed him, as regent, to restore the Roman Republic. Marcus Aurelius informs Commodus; in response, Commodus murders his father.",
        'Genre': {
            'Name': 'Action',
            'Description': "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        'Director': {
            'Name': "Ridley Scott",
            'Bio': "Sir Ridley Scott (born 30 November 1937) is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades, including the BAFTA Fellowship for lifetime achievement in 2018, two Primetime Emmy Awards, and a Golden Globe Award. In 2003, he was knighted by Queen Elizabeth II.",
            'Birth': '1937'
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p24674_p_v8_ae.jpg",
        "Featured": false
    },
    {
        'Title': 'Alien',
        'Description': "In 2122, The commercial space tug Nostromo is returning to Earth with a seven-member crew in stasis: Captain Dallas, Executive Officer Kane, Warrant Officer Ripley, Navigator Lambert, Science Officer Ash, and engineers Parker and Brett. Detecting a transmission from a nearby moon, the ship's computer, Mother, awakens the crew. Per company policy requiring any potential distress signal be investigated, they land on the moon despite Parker's protests, sustaining damage from its atmosphere and rocky landscape. The engineers stay on board for repairs while Dallas, Kane, and Lambert investigate the terrain. They discover the signal originates from a derelict alien ship and enter it, losing contact with the Nostromo. Ripley deciphers part of the transmission, determining it as a warning, but cannot relay the information to those on the derelict ship.",
        'Genre': {
            'Name': 'Sci-Fi',
            'Description': "Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies."
        },
        'Director': {
            'Name': "Ridley Scott",
            'Bio': "Sir Ridley Scott (born 30 November 1937) is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades, including the BAFTA Fellowship for lifetime achievement in 2018, two Primetime Emmy Awards, and a Golden Globe Award. In 2003, he was knighted by Queen Elizabeth II.",
            'Birth': '1937'
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p2571_p_v8_aw.jpg",
        "Featured": false
    },
    {
        'Title': 'The Departed',
        'Description': "In mid-1980s South Boston, Irish Mob boss Frank Costello introduces himself to a young Colin Sullivan. Twenty years later, Sullivan has been groomed as a spy inside the Massachusetts State Police (MSP) and joins the Special Investigation Unit (SIU), which is building a case against Costello. A police academy recruit, Billy Costigan Jr., is selected by Captain Queenan and Staff Sergeant Dignam to go undercover and infiltrate Costello's crew due to his family ties to organized crime, with his deceased uncle Jackie having been connected with Costello's outfit. SIU Captain George Ellerby informs Special Investigations that the identities of undercovers will be known only to Queenan and Dignam to prevent leaks.",
        'Genre': {
            'Name': 'Thriller',
            'Description': "An atmosphere of menace and sudden violence, such as crime and murder, characterize thrillers. The tension usually arises when the character(s) is placed in a dangerous situation, or a trap from which escaping seems impossible."
        },
        'Director': {
            'Name': "Martin Scorsese",
            'Bio': "Martin Charles Scorsese, born November 17, 1942) is an American/Italian director, producer, screenwriter and actor. He emerged as one of the major figures of the New Hollywood era. Scorsese has received many accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, three Golden Globe Awards, and two Directors Guild of America Awards. He has been honored with the AFI Life Achievement Award in 1997, the Film Society of Lincoln Center tribute in 1998, the Kennedy Center Honor in 2007, the Cecil B. DeMille Award in 2010, and the BAFTA Fellowship in 2012. Five of his films have been inducted into the National Film Registry by the Library of Congress as \"culturally, historically or aesthetically significant\".",
            'Birth': '1942'
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p162564_p_v8_ag.jpg",
        "Featured": false

    },
    {
        'Title': 'Harry Potter and the Sorcerer\'s Stone',
        'Description': "The story follows Harry's first year at Hogwarts School of Witchcraft and Wizardry as he discovers that he is a famous wizard and begins his formal wizarding education.",
        'Genre': {
            'Name': 'Fantasy',
            'Description': "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
        },
        'Director': {
            'Name': "Chris Columbus",
            'Bio': "Chris Joseph Columbus (born September 10, 1958) is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and its sequel Home Alone 2: Lost in New York (1992).",
            'Birth': '1958'
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p28630_p_v8_at.jpg",
        "Featured": false
    },
    {
        'Title': 'Spirited Away',
        'Description': "Spirited Away tells the story of Chihiro Ogino (Hiiragi), a ten-year-old girl who, while moving to a new neighborhood, enters the world of kami (spirits of Japanese Shinto folklore). After her parents are turned into pigs by the witch Yubaba (Natsuki), Chihiro takes a job working in Yubaba's bathhouse to find a way to free herself and her parents and return to the human world.",
        'Genre': {
            'Name': 'Fantasy',
            'Desciption': "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
        },
        'Director': {
            'Name': "Hayao Miyazaki",
            'Bio': "Hayao Miyazaki (宮崎 駿 or 宮﨑 駿, Miyazaki Hayao, [mijaꜜzaki hajao]; born January 5, 1941) is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.",
            'Birth': '1941'
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p21311607_v_v8_ab.jpg",
        "Featured": false
    },
    {
        'Title': 'Everything Everywhere All at Once',
        'Description': "Evelyn Quan Wang is a middle-aged Chinese American immigrant who runs a laundromat with her husband, Waymond; two decades earlier, they eloped to the United States and had a daughter, Joy. In the present day, the laundromat is being audited by the Internal Revenue Service (IRS). Waymond is trying to serve Evelyn divorce papers in an attempt to get her attention so they can talk about their marriage. Evelyn's stern and demanding father (referred to as Gong Gong, Cantonese for \"grandfather\") is visiting for her Chinese New Year party, and Joy is dealing with depression, has a strained relationship with her mother, which also includes Evelyn's reluctance to accept Joy's lesbian relationship with her non-Chinese girlfriend Becky.",
        'Genre': {
            'Name': 'Sci-Fi',
            'Description': "Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies."
        },
        'Director': {
            'Name': "Daniel Kwan, Daniel Schinert",
            'Bio': "Daniel Kwan (born February 10, 1988) and Daniel Scheinert (born June 7, 1987), known collectively as the Daniels, are an American filmmaker duo. They began their career as directors of music videos, including ones for \"Houdini\" (2012) by Foster the People and \"Turn Down for What\" (2013) by DJ Snake and Lil Jon, both of which earned them nominations at the Grammy Awards",
            'Birth': '1988 for Kwan, 1987 for Scheinert'
        },
        "ImageURL": "https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg",
        "Featured": false
    }
]

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(movies);
});

//Allow new users to register (CREATE)
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

//Allow users to update their user info (UPDATE)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

//Allow users to add a movie to their list of favorites (CREATE)

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}\'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

//Allow users to remove a movie from their list of favorites (DELETE)
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}\'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

//Allow existing users to deregister (DELETE)
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(` user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

//Return a list of all movies to the user (READ)
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//Return data about a single movie to the user (READ)
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

//Return data about a genre(description) by name/title (READ)
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

//Return data about a director by name (READ)
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})

//error handling middleware function
//need to put last, but before the app.listen()
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});
