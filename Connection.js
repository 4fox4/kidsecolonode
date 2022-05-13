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
module.exports = Connection;
