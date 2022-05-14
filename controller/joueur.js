const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
const AuthentificationRoutine = require("../tools/AuthentificationRoutine");
const logger = require('../tools/logger');
const Connection = require("../Connection");
const JoueurModel = require('../modele/JoueurModel');

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


router.post('/inscription', (req, res) =>{
    let connection = new Connection();
    promise.then(function(db){
        const promise = JoueurModel.inscrire(req.body.nom, req.body.prenoms, req.body.pseudo, req.body.datenaissance, req.mody.mdp);
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
            connection.endConnection();
        });
    });
});

module.exports = router;
