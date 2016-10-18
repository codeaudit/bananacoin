import songs from '../models/songs';

var Router = require('express').Router;
var uuid = require('uuid');

export default ({ config, db }) => {
	var router = Router(),
		key, fn, url;

	var route = {};
	route.load = (req, id, callback) => {
		let song = songs.find( song => song.id===id ),
			err = song ? null : 'Not found';
		callback(err, song);
	};
  route.id = 'song';

  router.param(route.id, function(req, res, next, id) {
    route.load(req, id, function(err, data) {
      if (err) return res.status(404).send(err);
      req[route.id] = data;
      next();
    });
  });

  var displaySong = (s) => {
    delete s.url;
    return s;
  }

  router.get('/', function({params}, res) {
    songs.map(displaySong)
		res.json(songs);
  });

	router.post('/register', function({ body }, res) {
		body.id = uuid.v4();
    body.active = true; // TODO: should start in false and
                        // become true on SongRegistered
		songs.push(body);
    body.payment = config.namespaceOwner;
		res.json(body);
  });

	router.post('/:song/purchase', function({ body, song }, res) {
		body.id = uuid.v4();
    body.payment = song.owner;
		res.json(body);
  });

	router.get('/:song', function({ song }, res) {
		res.json(displaySong(song));
	});

	return router;

	/** GET /:id - Return a given entity */
};