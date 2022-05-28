const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const Connection = require("../Connection");
const JoueurModel = require('../modele/JoueurModel');
const nivModel = require('../modele/NiveauModel');

router.use((req, res, next) => {
	// on fait next si la session est bonne, on retourne une erreur sinon
	AuthentificationRoutine.check(req, res, next);
});

router.get('/', (req, res) => {
	res.json({
		status : 200,
		data : "Inscription no ato"
	});
});

router.get('/niveau', (req, res) =>{
	const connexion = Connection();
	const promise = nivModel.getAll(connexion);
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

router.get('/score', (req, res) =>{
	const connexion = Connection();
	const promise = JoueurModel.getScore(connexion, req.query.id);
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

router.post('/login', (req, res) =>{
	const connexion = Connection();
	const promise = JoueurModel.login(connexion, req.body.pseudo, req.body.mdp);
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

router.post('/inscription', (req, res) =>{
	const connexion = Connection();
	const promise = JoueurModel.inscrire(connexion, req.body.nom, req.body.prenoms, req.body.pseudo, req.body.datenaissance, req.body.mdp);
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
