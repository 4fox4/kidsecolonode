const config = require("./tools/project.config.json");
var database = require('pg');
let configuration = config.DATABASE_CONF;

function Connection(){
	// console.log(configuration);
	const connection = new database.Client(configuration);
	connection.connect(function(err){
		if(err){
			console.log(err);
		}
	});
return connection;
}

/*function Connection(){
	const client = new database.Client({
		user: 'zzaclhrprkykvj',
		host: 'ec2-107-21-209-1.compute-1.amazonaws.com',
		database: 'dcb769ahe6je5b',
		password: '5b792df86fda42c3b47e34f85c6ff41b5c2dd885d5bccb94677d97f19c77e0fc',
		port: 5432,
		ssl: false
		// ssl  : {
		//   ca : fs.readFileSync('<path to CA cert file>')
		// }
	  })
	  client.connect(function(err) {
		if (err){
			console.log(err);	
		}else{
			return client;
		}
		console.log("Connected!");
	  });	
}*/

module.exports = Connection;
