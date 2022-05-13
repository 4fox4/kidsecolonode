// [!] params est facultative
// equivalent de socket.on('evenement', data => {})
// params est une variable venant de server.js

/**
 * @params {socket.io} io variable comme dans io.emit('event', unTruc)
 * @params {JSON|string|number} data comme dans socket.on('event', data => {})
 * @params {JSON} params Variable venant de server.js par injection ici
 */
var connection = require('../../Connection');
const logger = require("../../tools/logger").Create(__filename); // debug perso

function handle(io, socket, data, params) {

	console.info(data);

	let responseClient = data;
	let pseudoLikeur = responseClient.pseudo;
	let pseudoLiker = responseClient.pseudoLiker;

	( async () => {
		let connexion = connection();
		try {

			logger.info(`Like par user ${responseClient.pseudo} liker ${responseClient.pseudoLiker}`);

		} catch(e) {
			logger.error(e + '');
		} finally {
			// permet d'eviter le terminal qui pende
			connexion.end();
		}
	}) ();
}

// [!] : ne pas toucher
module.exports = (io, params) => {
	const custom_handler = (socket) => {
		return data => {
			return handle(io, socket, data, params);
		}
	};
	return custom_handler;
};
