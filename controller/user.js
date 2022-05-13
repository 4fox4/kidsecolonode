const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const connection = require("../Connection");

router.use((req, res, next) => {
	// on fait next si la session est bonne, on retourne une erreur sinon
	AuthentificationRoutine.check(req, res, next);
});

router.get('/', (req, get) => {
	res.json({
		status : 200,
		data : "Rien par ici"
	});
});

// var PerServ = require('../modele/PersonneModel');
// var FonctServ = require('../modele/FonctionModel');

//--------------------------//
// exemple get liste person //
//--------------------------//

// router.get('/listePerson/:idutilisateur/:searchValue', (req, res) =>{
// 	var id = req.params.idutilisateur;
// 	var search = req.params.searchValue;
// 	let connexion = connection();
// 	const promise = PerServ.getPersonnes(connexion, id, search);
// 	promise.then(value => {
// 		res.json(value);
// 		//connexion.end();
// 	}).catch( error => {
// 		logger.error(error);
// 		//connexion.end();
// 		res.json({
// 			status : 400, // reponse http
// 			error : true, // pour signaler que ceci est une erreur
// 			detailed : `${error} : lors de la recherche ${search}, id=${id}`, // erreur pour les devs
// 			data : "Erreur survenue lors de la requête" // pour les users
// 		});
// 	}).finally(()=>{
// 		connexion.end();
// 	});
// });

//------------------//
// avoir partenaire //
//------------------//

// router.post('/searchPartenaire', (req, res) => {
// 	//ITY id ITY DIA ILAY ID ANLE OLONA M'SE CONNECTE ZANY HOE AZO AVY AMIN'NY SESSION NA AVY ANY AM STORAGE
// 	var id = req.body.id;
// 	var offset = req.body.offset;
// 	var limit = req.body.limit;
// 	let connexion = connection();
// 	const promise = PerServ.searchPartner(connexion ,id, offset, limit);
// 	promise.then(function(value){
// 		res.json(value);
// 		//connexion.end();
// 	}).catch( error => {
// 		logger.error(error);
// 		//connexion.end();
// 		res.json({
// 			status : 400, // reponse http
// 			error : true, // pour signaler que ceci est une erreur
// 			detailed : `${error} : rejection lors de la recherche`, // erreur pour les devs
// 			data : "Erreur survenue lors de la recherche" // pour les users
// 		});
// 	}).finally(()=>{
// 		connexion.end();
// 	});
// });

module.exports = router;
