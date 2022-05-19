#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb+srv://inventory:')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Developer = require('./models/developer')
var Esrb = require('./models/esrb')
var Genre = require('./models/genre')
var Game = require('./models/game')
var GameInstance = require('./models/gameinstance')
var Platform = require('./models/platform')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var developers = []
var esrbs = []
var genres = []
var games = []
var gameinstances = []
var platforms = []

function developerCreate(name, weburl, logo, about, cb) {
  let developerdetail = {name: name, weburl: weburl, logo: logo, about: about}

  var developer = new Developer(developerdetail);

  developer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Developer ' + developer);
    developers.push(developer);
    cb(null, developer)
  });

}

function genreCreate(name, description, cb) {
  var genre = new Genre({ name: name, description: description });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function gameCreate(title, developer, price, esrb, genre, quantity, description, cb) {
  let gamedetail = {
    title: title,
    developer: developer,
    price: price,
    esrb: esrb,
    quantity: quantity,
    description: description,
  }
  if (genre != false) gamedetail.genre = genre

  var game = new Game(gamedetail);

  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game ' + game);
    games.push(game);
    cb(null, game);
  });

}

function gameinstanceCreate(game, platform, imprint, status, due_back, cb) {
  let gameinstancedetail = {
    game: game,
    platform: platform,
    imprint: imprint,
  }
  if (due_back != false) gameinstancedetail.due_back = due_back
  if (status != false) gameinstancedetail.status = status

  var gameinstance = new GameInstance(gameinstancedetail);

  gameinstance.save(function (err) {
    if (err) {
      cb(err, null);
      return
    }
    console.log('New GameInstance' + gameinstance);
    gameinstances.push(gameinstance);
    cb(null, gameinstance)
  });
}

function esrbCreate(rating, description, cb) {
  var esrb = new Esrb({ rating: rating, description: description });
       
  esrb.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Esrb: ' + esrb);
    esrbs.push(esrb)
    cb(null, esrb);
  }   );
}

function platformCreate(console, description, cb) {
  var platform = new Platform({ console: console, description: description });
       
  platform.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    // console.log('New Platform: ' + platform);
    platforms.push(platform)
    cb(null, platform);
  }   );
}

function createEsrbPlatform(cb) {
  async.series([
    function(callback) {
      esrbCreate('E (Everyone)', "Content is generally suitable for all ages. May contain minimal cartoon, fantasy or mild violence and/or infrequent use of mild language.", callback);
    },
    function(callback) {
      esrbCreate('E10+ (Everyone 10 And Up)', "Content is generally suitable for ages 10 and up. May contain more cartoon, fantasy or mild violence, mild language and/or minimal suggestive themes.", callback);
    },
    function(callback) {
      esrbCreate('T (Teen)', "Content is generally suitable for ages 13 and up. May contain violence, suggestive themes, crude humor, minimal blood, simulated gambling and/or infrequent use of strong language.", callback);
    },
    function(callback) {
      esrbCreate('M (Mature)', "Content is generally suitable for ages 17 and up. May contain intense violence, blood and gore, sexual content and/or strong language.", callback);
    },
    function(callback) {
      esrbCreate('RP (Rating Pending)', "Not yet assigned a final ESRB rating. Appears only in advertising, marketing and promotional materials related to a physical (e.g., boxed) video game that is expected to carry an ESRB rating, and should be replaced by a game's rating once it has been assigned.", callback);
    },
    function(callback) {
      platformCreate("Xbox Series X", 'Xbox is a video gaming brand created and owned by Microsoft. The brand consists of five video game consoles, as well as applications, streaming services, an online service by the name of Xbox network, and the development arm by the name of Xbox Game Studios.', callback);
    },
    function(callback) {
      platformCreate("PC", "A personal computer game, also known as a PC game or computer game, is a type of video game played on a personal computer rather than a video game console or arcade machine. Its defining characteristics include: more diverse and user-determined gaming hardware and software; and generally greater capacity in input, processing, video and audio output.", callback);
    },
    function(callback) {
      platformCreate("Playstation 5", 'Recognized as a global leader in interactive and digital entertainment, Sony Interactive Entertainment (SIE) is responsible for the PlayStation® brand and family of products and services. PlayStation has delivered innovation to the market since the launch of the original PlayStation in Japan in 1994. The PlayStation family of products and services include PlayStation®5, PlayStation®4, PlayStation®VR, PlayStation™Store, PlayStation®Plus, PlayStation™Now, and acclaimed PlayStation software titles from PlayStation Studios. Headquartered in San Mateo, California, SIE is a wholly-owned subsidiary of Sony Group Corporation and has global functions in California, London, and Tokyo.', callback)
    },
    function(callback) {
      platformCreate("Nintendo Switch", "Nintendo's mission is to put smiles on the faces of everyone we touch. We do so by creating new surprises for people across the world to enjoy together. We've forged our own path since 1889, when we began making hanafuda playing cards in Kyoto, Japan. Today, we're fortunate to be able to share our characters, ideas and worlds through the medium of video games and the entertainment industry.Nintendo of America, established in 1980 and based in Redmond, Wash., is a wholly owned subsidiary of Nintendo Co., Ltd. We are committed to delivering best-in-class products and services to our customers and to investing in the well-being of our employees as part of the global Nintendo family.", callback);
    },
    ],
    // optional callback
    cb);
}


function createGenreDevelopers(cb) {
    async.series([
        function(callback) {
          developerCreate('DICE', 'https://www.ea.com/', '', "DICE is the studio behind the Battlefield, Star Wars Battlefront, and Mirror's Edge series. Creating unforgettable gaming experiences is what makes us tick - and has been since the beginning.", callback);
        },
        function(callback) {
          developerCreate('Rockstar Studios', 'https://www.rockstargames.com/', '', "Rockstar Games, Inc. is an American video game publisher based in New York City. The company was established in December 1998 as a subsidiary of Take-Two Interactive, using the assets Take-Two had previously acquired from BMG Interactive.", callback);
        },
        function(callback) {
          developerCreate('Nintendo EPD', 'https://www.activision.com/', '', "Nintendo Entertainment Planning & Development Division, commonly abbreviated as Nintendo EPD, is the largest division within the Japanese video game company Nintendo. The division focuses on developing and producing video games, mobile apps, and other related entertainment software for the company.", callback);
        },
        function(callback) {
          developerCreate('FromSoftware', 'https://www.blizzard.com/en-us/', '', "FromSoftware, Inc. is a Japanese video game development company founded in November 1986 and a subsidiary of Kadokawa Corporation. The company is best known for their Armored Core and Souls series, including the related games Bloodborne, Sekiro, and Elden Ring.", callback);
        },
        function(callback) {
          developerCreate('Infinity Ward', 'https://www.infinityward.com/', '', "Infinity Ward, Inc. is an American video game developer. They developed the video game Call of Duty, along with seven other installments in the Call of Duty series. Vince Zampella, Grant Collier, and Jason West established Infinity Ward in 2002 after working at 2015, Inc. previously.", callback);
        },
        function(callback) {
          genreCreate("Action", "Action games emphasize physical challenges that require hand-eye coordination and motor skill to overcome. They center around the player, who is in control of most of the action. Most of the earliest video games were considered action games; today, it is still a vast genre covering all games that involve physical challenges.", callback);
        },
        function(callback) {
          genreCreate("Shooter", "n shooter games (or simply shooters), players use ranged weapons to participate in the action, which takes place at a distance. Most shooters involve violent gameplay; lethal weaponry is used to damage opponents.",callback);
        },
        function(callback) {
          genreCreate("Battle Royale", "A battle royale game is a genre that blends the survival, exploration and scavenging elements of a survival game with last man standing gameplay. Battle royale games challenge a large number of players, starting with minimal equipment, to search for weapons and armor and eliminate other opponents, while trying to stay in safe playable area which shrinks as the time passes, with the winner being the last competitor in the game. Notable battle royale games include PlayerUnknown's Battlegrounds, Fortnite Battle Royale, Garena Free Fire, Apex Legends, and Call of Duty: Warzone, each having received tens of millions of players within months of their releases.", callback);
        },
        function(callback) {
          genreCreate("Role-Playing(RPG)", "Most of these games cast the player in the role of a character that grows in strength and experience over the course of the game. By overcoming difficult challenges and/or defeating monsters, the player gains experience points which represent the character's progress in a chosen profession or class (such as melee combat or ranged magic spells) and allow the player to gain new abilities once a set amount are obtained. Many RPGs contain an open world known as an overworld, which is usually populated with monsters, that allows access to more important game locations, such as towns, dungeons, and castles.",callback);
        },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.series([
        function(callback) {
          gameCreate('Call of Duty: Modern Warfare', developers[4], '59.99', esrbs[3],[genres[0], genres[1]],1,'The stakes have never been higher as players take on the role of lethal Tier One operators in a heart-racing saga that will affect the global balance of power. Call of Duty: Modern Warfare engulfs fans in an incredibly raw, gritty, provocative narrative that brings unrivaled intensity and shines a light on the changing nature of modern war. Developed by the studio that started it all, Infinity Ward delivers an epic reimagining of the iconic Modern Warfare series from the ground up.',callback);
        },
        function(callback) {
          gameCreate('Red Dead Redemption 2', developers[1], '59.99', esrbs[3],[genres[0], genres[1], genres[2], genres[3]],1,'America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.',callback);
        },
        function(callback) {
          gameCreate('Battlefield: 2042', developers[0], '59.99', esrbs[3],[genres[0], genres[1]],1,'Battlefields changing before your eyes. A cutting-edge arsenal at your disposal. The grand return of all-out warfare. Adapt and overcome in massive-scale 128 player battles* where dynamic storms, environmental hazards, total combat freedom, and Battlefield\'s signature destruction spark a new breed of Only in Battlefield moments.',callback);
        },
        function(callback) {
          gameCreate('The Legend of Zelda: Breath of The Wild', developers[2], '59.99', esrbs[1],[genres[0], genres[3]],1,'Forget everything you know about The Legend of Zelda games. Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule in this stunning Open-Air Adventure. Now on Nintendo Switch, your journey is freer and more open than ever. Take your system anywhere, and adventure as Link any way you like.',callback);
        },
        function(callback) {
          gameCreate('Elden Ring', developers[3], '59.99', esrbs[3],[genres[0], genres[3]],1,'ELDEN RING developed by FromSoftware, Inc. and BANDAI NAMCO Entertainment Inc., is a fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin. Danger and discovery lurk around every corner in FromSoftware\'s largest game to-date.',callback);
        },
        function(callback) {
          gameCreate('Test Game 1', developers[4], '59.99', esrbs[3],false,1,'summary of game 1',callback)
        },
        function(callback) {
          gameCreate('Test Game 1', developers[4], '0', esrbs[3],false,1,'summary of game 2',callback)
        }
        ],
        // optional callback
        cb);
}


function createGameInstances(cb) {
    async.series([
        function(callback) {
          gameinstanceCreate(games[0], platforms[0], 'Activision', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[0], platforms[1], 'Activision', 'Loaned', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[0], platforms[2], 'Activision', false, false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[1], platforms[1], 'Rockstar Games', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[1], platforms[0], 'Rockstar Games', 'Maintenance', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[1], platforms[2], 'Rockstar Games', false, false, callback)        
        },
        function(callback) {
          gameinstanceCreate(games[2], platforms[0], 'Electronic Arts', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[2], platforms[2], 'Electronic Arts', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[2], platforms[1], 'Electronic Arts', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[3], platforms[3], 'Nintendo', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[3], platforms[3], 'Nintendo', 'Loaned', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[4], platforms[0], 'Bandai Namco', 'Available', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[4], platforms[2], 'Bandai Namco', 'Loaned', false, callback)
        },
        function(callback) {
          gameinstanceCreate(games[4], platforms[1], 'Bandai Namco', 'Loaned', false, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createEsrbPlatform,
    createGenreDevelopers,
    createGames,
    createGameInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('GAMEinstances: '+gameinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

