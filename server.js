const express = require('express');
const app = express();
const http = require('http').Server(app);
let bodyParser = require('body-parser');

// [!] : Pour la maintenance sur l'ensemble et le debogage
const config = require("./tools/project.config.json"); // fichier de config
const logger = require("./tools/logger").Create(__filename); // debug perso

// [!] : middleware pour la structuration des requetes particuliers (ex : POST)
app.use(bodyParser.json()); // Lit l'élément Json dans l'url(s'il y en a)
app.use(bodyParser.urlencoded({ extended: true })); // Supporte les bodies encodés

// [!] : middleware de Gestion du CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, append, delete, entries, foreach, get, has, keys, set, values");
	res.header("Access-Control-Allow-Credentials", true);
    next();
});


// [!] : definition des routes
// Chaque lien et sous lien devrait avoir une protection token
app.use('/session', require("./controller/session")); // check token validation (login, logout)
app.use('/joueur', require("./controller/joueur")); // inscription, 
app.use('/theme', require("./controller/theme")); // theme, 

// [!] : mini page web pour tester les sockets (faites pas attention)
app.use('/test_socket', express.static('./tools/test_socket'));

// [!] : middleware qui capture tous les erreurs 404
app.use((req, res, next) => {
	if ( res.status(404) ) {
		res.json({
			code : 404,
			error : true,
			detailed : req.url,
			data : "Error 404"
		});
	} else {
		next();
	}
});

// [!] : demarrage du serveur
const port = process.env.PORT || config.PORT; // utilise le port par defaut de l'environement si possible sinon on utilise celle de la config
const addr = config.SERVER_ADDR || 'localhost'; // utilise localhost si SERVER_ADDR est non definie
logger.warn(`Listening on ${addr}:${port}`);
let server = http.listen(port, function(){
	logger.warn(`Listening on ${ addr }:${ port }`);
});


// [!] : Gestion socket
// definition
const socket = require('socket.io');
const io = socket(server);

// [!] : Socket middleware
io.use((socket, next) => {
	// called every connect event
	logger.info('Socket id = ' + socket.id);
	// Object.keys(socket.handshake).forEach(key => {
		// logger.info(socket.handshake[key]);
	// });
	next();
});


const params = {
	// variables de test pour tester si le partage entre fichier socket fonctionne
	uneVariableTest : 'Je suis une variable accessible dans tous les fichiers sockets',
	modifiezMoi : Math.random()
};

// pour une nouvelle(future) connexion socket, creer un fichier et l'ajouter
// dans cette liste suivant le modele des autres
let eventHandlers = {
	'like' : require('./socket/autres/like')(io, params),
	'test' : require('./socket/test/TestSocket')(io, params)
};

io.sockets.on('connection', socket => {
	logger.info('Une personne s\'est connectee.');

    // Gere tous les evenements
	for (let event in eventHandlers) {
		// pour chaque evenement possible, gerer cet evenement avec la fonction appropriee
		let handler = eventHandlers[event];
		// params.socket = config;
		socket.on(event, handler(socket) );
	}
});

