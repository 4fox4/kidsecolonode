const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const connection = require('../Connection');
const Email = require('../tools/Email');

router.use((req, res, next) => {
	// on fait next si la session est bonne, on retourne une erreur sinon
	AuthentificationRoutine.check(req, res, next);
});

router.get('/', (req, res) => {
	res.json({
		status : 200,
		data : "Rien par ici"
	});
});

router.post('/generercode', (req, res) => {
	const email = req.body.email;
	const pseudo = req.body.pseudo;
	// on genere le code
	let code = Email.genererCode(email, pseudo);
	// on envoye l'email
	logger.info('migenerer '+code);
	let message = 'Ndao ary code confirmation';
	let sending  = Email.sendCode(email, message, code);
	sending.then(sent =>{
		if(sent == true){
			res.json({
				status : 200, // reponse http
				data : "code envoyer" // pour les users
			});
		}else{
			res.json({
				status : 400, // reponse http
				error : true, // pour signaler que ceci est une erreur
				data : "code non envoyer" // pour les users
			});
		}
	});
});

// verification du code 
router.post('/confirmcode', (req, res) => {
	const email = req.body.email;
	const pseudo = req.body.pseudo;
	const code = req.body.code;
	//confirmer le code
	if(Email.verifierCode(email, pseudo, code)){
		res.json({
			status : 200, // reponse http
			data : "code confirmer" // pour les users
		});
	}else{
		res.json({
			status : 400, // reponse http
			error : true, // pour signaler que ceci est une erreur
			data : "code de confirmation invalide" // pour les users
		});
	}
});

// verification du code 
router.post('/verifemail', (req, res) => {
	const email = req.body.email;
	let connexion = connection();
	//verify email
	const promise = PerServ.verifyEmail(connexion, email);
	promise.then(value =>{
		//connexion.end();
		res.json(value);
	}).catch(error =>{
		//connexion.end();
		res.json(error);
	}).finally(()=>{
		connexion.end();
	});
});

//--------------------------------- resaka oublier mot de passe -----------------------

router.post('/generercodeMDP', (req, res) => {
	const email = req.body.email;
	// on genere le code
	let code = Email.genererCodeMDP(email);
	// on envoye l'email
	logger.info('migenerer MDP'+code);
	let message = 'Ndao ary mot de passe de secours';
	let sending  = Email.sendCode(email, message, code);
	sending.then(sent =>{
		if(sent == true){
			res.json({
				status : 200, // reponse http
				data : "code envoyer" // pour les users
			});
		}else{
			res.json({
				status : 400, // reponse http
				error : true, // pour signaler que ceci est une erreur
				data : "code non envoyer" // pour les users
			});
		}
	});
});

router.post('/loginAndCode', (req,res) =>{
	const email = req.body.email;
	const code = req.body.code;
	if(Email.verifierCodeMDP(email, code)){
		const connexion = connection();
		const promise = PerServ.loginMDPoublier(connexion, email);
		promise.then(value => {
			// on genere le token
			value.token = TokenManager.generateUsing({ email : email, password : code});
			res.json(value);
			//connexion.end();
		}).catch( error => {
			//connexion.end();
			res.json({
				status : 400,
				error : true, // pour signaler que ceci est une erreur (facultative mais utile pour le terminal client)
				detailed : `${error} : login impossible pour ${email}/${password}`, // erreur pour les devs
				data : `Connexion impossible pour ${email}.` // pour les users
			});
		}).finally(()=>{
			connexion.end();
		});
	}else{
		res.json({
			status : 400, // reponse http
			error : true, // pour signaler que ceci est une erreur
			data : "code de confirmation invalide" // pour les users
		});
	}
});

module.exports = router;
