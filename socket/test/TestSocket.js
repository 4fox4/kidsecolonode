// [!] params est facultative
// equivalent de socket.on('evenement', data => {})
// params est une variable venant de server.js

/**
 * @params {socket.io} io variable comme dans io.emit('event', unTruc)
 * @params {JSON|string|number} data comme dans socket.on('event', data => {}) 
 * @params {JSON} params Variable venant de server.js par injection ici
 */
function handle(io, socket, data, params) {
	// io.emit('recu', {
		// OF COURSE THIS SHIT WOULD NEVER WORK YOU DUMBASS IDIOT. 
		// MAKE SURE TO REMEMBER THIS SHIT YOUR WHOLE FUCKING LIFE
		// temp1 : params, // WTF 1
		// temp1 : params.socket,  // WTF 2
		// temp2 : 'Hello world',
		// temp3 : data
	// });
	
	io.emit('recu', { data : `Received ${JSON.stringify(data)}`})
	socket.broadcast.emit('forEveryoneExceptMe', `J'ai recu une info broadcast de ${ socket.id }, heure ${ new Date().toJSON()}`);
	// console.log('Recu d\'un client', data);
	if ( params.modifiezMoi ) {
		params.modifiezMoi = Math.random();
	}
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