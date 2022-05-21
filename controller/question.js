const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const Connection = require("../Connection");
const questionModel = require('../modele/QuestionModel');

router.use((req, res, next) => {
	// on fait next si la session est bonne, on retourne une erreur sinon
	AuthentificationRoutine.check(req, res, next);
});

router.get('/', (req, res) => {
	res.json({
		status : 200,
		data : "Question no ato"
	});
});


router.get('/rep', (req, res) =>{
	const connexion = Connection();
	const promise = questionModel.getChoixReponse(connexion, req.query.idquestion);
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

router.post('/repondre', (req, res) =>{
    const connexion = Connection();
	const promise = questionModel.repondre(connexion, req.body.idjoueur, req.body.idquestion, req.body.pts);
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

router.get('/niveau', (req, res) =>{
	const connexion = Connection();
	const promise = questionModel.getByNiv(connexion, req.query.idniveau);
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
