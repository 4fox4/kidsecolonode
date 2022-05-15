const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const Connection = require("../Connection");
const ThemeModel = require('../modele/ThemeModel');

router.use((req, res, next) => {
	// on fait next si la session est bonne, on retourne une erreur sinon
	AuthentificationRoutine.check(req, res, next);
});

router.get('/', (req, res) => {
	res.json({
		status : 200,
		data : "Theme no ato"
	});
});

router.get('/details', (req, res) =>{
	const connexion = Connection();
	const promise = ThemeModel.getDetails(connexion, req.query.idtheme);
	promise.then(function(value){
		res.json(value);
	}).catch( error => {
		console.error(error);
		res.json({
			status : 400, // reponse http
			error : true, // pour signaler que ceci est une erreur
			detailed : `${error} : concernant la requête infos `, // erreur pour les devs
			data : "Une erreur est survenue lors de la requête" // pour les users
		});
	}).finally(()=>{
		connexion.end();
	});
});

router.get('/all', (req, res) =>{
	const connexion = Connection();
	const promise = ThemeModel.getAll(connexion);
	promise.then(function(value){
		res.json(value);
	}).catch( error => {
		console.error(error);
		res.json({
			status : 400, // reponse http
			error : true, // pour signaler que ceci est une erreur
			detailed : `${error} : concernant la requête infos `, // erreur pour les devs
			data : "Une erreur est survenue lors de la requête" // pour les users
		});
	}).finally(()=>{
		connexion.end();
	});
});
module.exports = router;
