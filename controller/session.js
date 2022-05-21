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


//inscription
// router.post('/inscription', (req,res) => {
// 	var email = req.body.email;
// 	var password = req.body.password;
// 	var nom = req.body.nom;
// 	var prenom = req.body.prenom;
// 	var pseudo = req.body.pseudo;
// 	var naissance = req.body.naissance;
// 	var ville = req.body.ville;
// 	var adress = req.body.adress;
// 	var description = req.body.description;
// 	var nationalite = req.body.nationalite;
// 	var photo = req.body.photo;
// 	let photomatching = req.body.photomatching;
// 	var monSexe = req.body.monSexe;
// 	var Telephone = req.body.Telephone;
// 	var preferenceSexe = req.body.preferenceSexe;
// 	var ageDebut = req.body.ageDebut;
// 	var AgeFin = req.body.AgeFin;
// 	var interet = req.body.interet;
// 	var preferenceVille = req.body.preferenceVille;

// 	let connexion = connection();
// 	const promise = PerServ.inscriptionTransaction(connexion, email, password, nom, prenom, pseudo, naissance, ville, adress, description, nationalite, photo, photomatching,monSexe, Telephone, preferenceSexe, ageDebut, AgeFin, interet, preferenceVille);
// 	promise.then(function(value){
// 		logger.info('Success inscription');
// 		// on genere le token
// 		value.token = TokenManager.generateUsing({ email : email, password : password});
// 		res.json(value);
// 		//connexion.end();
// 	}).catch( error => {
// 		logger.warn('Erreur inscription');
// 		logger.error(error);
// 		//connexion.end();	
		
// 		let error_msg = 'Erreur survenue lors de l\'inscription. Veuillez re-vérifier.';
// 		if ( error.detail ) {
// 			if ( error.detail.toLowerCase().includes('email') ) {
// 				error_msg = 'Email existant ou invalide.';
// 			}
// 		}
		
// 		res.json({
// 			status : 400, // reponse http
// 			error : true, // pour signaler que ceci est une erreur
// 			detailed : error.detail || (error + ''), // erreur pour les devs
// 			data : error_msg  // pour les users
// 		});
// 	}).finally(()=>{
// 		connexion.end();
// 	});
// });

// router.post('/login', (req, res) => {
// 	const email = req.body.email;
// 	const password = req.body.password;
// 	const connexion = connection();
// 	const promise = PerServ.login(connexion, email, password);
// 	promise.then(value => {
// 		// on genere le token
// 		value.token = TokenManager.generateUsing({ email : email, password : password});
// 		res.json(value);
// 		//connexion.end();
// 	}).catch( error => {
// 		//connexion.end();
// 		res.json({
// 			status : 400,
// 			error : true, // pour signaler que ceci est une erreur (facultative mais utile pour le terminal client)
// 			detailed : `${error} : login impossible pour ${email}/${password}`, // erreur pour les devs
// 			data : `Connexion impossible pour ${email}.` // pour les users
// 		});
// 	}).finally(()=>{
// 		connexion.end();
// 	});
// });

// router.post('/logout', (req, res) => {
// 	// ITY id ITY DIA ILAY ID ANLE OLONA M'SE CONNECTE ZANY HOE AZO AVY AMIN'NY SESSION NA AVY ANY AM STORAGE
// 	var id = req.body.id;
// 	let connexion = connection();
// 	const promise = PerServ.logout(connexion, id);
// 	delete( res.locals.connectedPeople[id] ); // variable dans server.js accessible comme c'est un pointeur
// 	promise.then( value => {
// 		res.json(value);
// 		// logger.info( res.locals.connectedPeople );
// 		//connexion.end();
// 	}).catch( error => {
// 		//connexion.end();
// 		res.json({
// 			status : 400, // reponse http
// 			error : true, // pour signaler que ceci est une erreur
// 			detailed : `${error} : Erreur logout pour id=${id}`, // erreur pour les devs
// 			data : "Une erreur est survenue lors de la requête" // pour les users
// 		});
// 	}).finally(()=>{
// 		connexion.end();
// 	});
// });

//	resaka code de confirmation ---------------------------------

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