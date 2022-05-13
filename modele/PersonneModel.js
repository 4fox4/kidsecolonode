/* node JS */
//let connection = require('../Connection');
//let connexion = connection();
const logger = require("../tools/logger").Create(__filename); // debug perso
const assert = require('assert');
const config = require('../tools/project.config.json');
const Tools = require('../tools/Tools');

module.exports = class PersonneModel{

    //recherche person Specifique
    static getPersonnes(connexion, id, searchValue){
        return new Promise((resolve, reject)=> {
			// "select * from critereUser where idutilisateur not like '"+id+"' and lower(pseudo) like lower('%"+searchValue+"%')";
			const sql = {
				text: "SELECT * FROM critereUser WHERE idutilisateur NOT LIKE $1 AND LOWER(pseudo) LIKE CONCAT('%', LOWER($2), '%') and etat>=0 LIMIT $3",
				values: [ id, searchValue, config['SEARCH_LIMIT'] || 10 ]
			};
			logger.info(sql);
            connexion.query(sql, (error, resultSet, fields) => {
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
				let data = [];
				for(let result in resultSet.rows){
					data.push(resultSet.rows[result]);
                }
				resolve({
                    "statut": 200,
                    "data": data
                });
			});
        });
    }

    //get sequence
    static getSequence(connexion, mysequence){
        return new Promise((resolve, reject) => {
			const sql = {
				text:  "select nextval($1) as seq",
				values: [ mysequence ]
			};
			connexion.query(sql, function(error, resultSet, fields){
				logger.info(sql.text);
				logger.info(sql.values);
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
				let data = [];
				for(let result in resultSet.rows){
					data.push(resultSet.rows[result].seq);
                }
				resolve(data[0]);
			});
		})
    }

	/**
	 * INSCRIPTION EN MODE TRANSACTIONNEL
	 * PERMET D'ASSURER QU'UNE INSCRIPTION S'INSERE AVEC UNE PREFERENCE EXISTANTE
	 */
    static async inscriptionTransaction (
		connexion, email, password, nom, prenom,
		pseudo, naissance, ville, adress, description,
		nationalite, photo, photomatching, monSexe, telephone,
		preferenceSexe, ageDebut, ageFin, interet, preferenceVille ) {

		let date = new Date();
		const dates = Tools.toTimestamp( date );

		const model = PersonneModel;
		let iduser = null;
		let idpref = null;
		try {
			await connexion.query('BEGIN'); // debute la transaction

			const sequence = await model.getSequence(connexion, "mysequence");
			assert(sequence != undefined && sequence != null, 'Toute sequence doit etre ultimement definie');
			iduser = 'U' + sequence;
			idpref = 'PR' + sequence;
			// user query
			const userQuery = {
				text : `insert into UTILISATEUR (idutilisateur, idprofil, email, password, nom, prenom, pseudo, naissance, ville, adresse, description, nationalite, photo, photomatching, sexe, telephone, nbjetons, etat, dateinscription)
						 values
						($1, $2, $3, sha1($4), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
				values : [
					iduser, 'P1', email, password, nom, prenom,
					pseudo, naissance, ville, adress, description, nationalite,
					photo, photomatching, monSexe, telephone, 0, 1, dates
				]
			};
			const prefQuery = {
				text : "insert into PREFERENCE (idpreference, idutilisateur, sexe, agedebut, agefin, idinteret, ville) values ($1, $2, $3, $4, $5, $6, $7)",
				values : [
					idpref, iduser,  preferenceSexe,
					parseInt(ageDebut), parseInt(ageFin), interet,
					preferenceVille
				]
			};
			logger.info(`Debut tentative d'insertion user ${iduser} et pref ${idpref} : ok`);

			await connexion.query(userQuery); // insertion user
			await connexion.query(prefQuery); // insertion preference

			await connexion.query('COMMIT'); // Termine la transaction
			logger.info(`Insertion user ${iduser} et ${idpref} : ok`);
			return {
				code : 200,
				data : iduser
			};
		} catch(e) {
			logger.error(`Echec Insertion user ${iduser} et ${idpref}, Rollback`);
			logger.error(e.detail || (e + ''));
			await connexion.query('ROLLBACK');
			throw e;
		}
	}

	/**
	 * Update des infos confidentielles d'une personne mais sans sa description
	 * @param {*} connexion
	 * @param {string} idutilisateur
	 * @param {string} email
	 * @param {string} nom
	 * @param {string} prenom
	 * @param {string} pseudo
	 * @param {string} ville
	 * @param {string} adresse
	 * @param {string} nationalite
	 * @param {string} telephone
	 */
	static async updatePersonne(connexion, idutilisateur, email, nom, prenom, pseudo, ville, adresse, nationalite, telephone) {
		try {
			const sql = {
				text : `update UTILISATEUR set
						email = $1, nom = $2, prenom = $3, pseudo = $4, ville = $5,
						adresse = $6, nationalite = $7, telephone = $8
						where idUtilisateur like $9`,
				values : [email, nom, prenom, pseudo, ville, adresse, nationalite, telephone, idutilisateur]
			};
			await connexion.query(sql);
			return {
				status : 200,
				data : "success"
			};
		} catch(e) {
			throw e;
		}
	}

	//verify doublant email
	static verifyEmail(connexion, email){
        return new Promise((resolve, reject) => {
           // "select * from UTILISATEUR where EMAIL like '"+login+"' and PASSWORD like '"+password+"'";
			const sql = {
				text : "select count(*) as nb from UTILISATEUR where EMAIL like $1 and etat>=0",
				values : [email]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
				for(let result in resultSet.rows){
                    if(resultSet.rows[result].nb==0)
                    {
						let result = {
                            "status" : "200",
                            "data" : "peut s'inscrire"
                        };
                        resolve(result);
					}
                    else
                    {
                        let result = {
                            "status" : "400",
                            "data" : "email deja employé"
                        };
                        // resolve(result);
                        reject(result);
                    }
				}
			});
        })
    }

    //login
    static login(connexion, login, password){
        return new Promise((resolve, reject) => {
           // "select * from UTILISATEUR where EMAIL like '"+login+"' and PASSWORD like '"+password+"'";
			const sql = {
				text : "select IDUTILISATEUR, IDPROFIL, EMAIL, NOM, PRENOM, PSEUDO, NAISSANCE, VILLE, ADRESSE, DESCRIPTION, NATIONALITE, PHOTO, PHOTOMATCHING, SEXE, TELEPHONE, NBJETONS, ETAT, DATEINSCRIPTION from UTILISATEUR where EMAIL like $1 and PASSWORD like sha1($2) and etat>=0",
				//text : "select * from UTILISATEUR where EMAIL like $1 and PASSWORD like $2",
				values : [login, password]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				logger.error(error);
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
				let data = [];
				for(let result in resultSet.rows){
                    if(resultSet.rows[result].etat>=0)
                    {
                        data.push(resultSet.rows[result]);
                    }
                    else
                    {
                        let result = {
                            "status" : "400",
                            "data" : "Ce compte est déja supprimé"
                        };
                        // resolve(result);
                        reject(result);
                    }
				}
				if(data.length == 0){
                    let result = {
                        "status" : "400",
                        "data" : "Veuillez vérifier votre email ou votre mot de passe"
                    };
                    // resolve(result);
					reject(result);
					
                } else {
                    // "update Utilisateur set etat=1 where idUtilisateur='"+data[0].idutilisateur+"'";
					const sql1 = {
						text : "update Utilisateur set etat=1 where idUtilisateur=$1",
						values : [ data[0].idutilisateur ]
					};
                    logger.info(sql1);
                    connexion.query(sql1, function(error, resultSet, fields){
						if(error){
							logger.error(error);
							reject(error);
							return;
						}else{
							let result = {
								"status" : "200",
								"data" : data
							};
							resolve(result);
						}
					});
                }
			});
        })
    }

    //rechercher partenaire
    static searchPartner(connexion, idUtilisateur, offset, limit){
        return new Promise((resolve, reject) => {
			const sql = {
				text : `SELECT * FROM critereUser
					WHERE sexeuser like (SELECT sexe FROM preference WHERE IDUTILISATEUR=$1)
					AND (
						date_part('year', age(NAISSANCE))
						BETWEEN (SELECT agedebut FROM preference WHERE IDUTILISATEUR=$2)
						AND (SELECT agefin FROM preference WHERE IDUTILISATEUR=$3)
					)
					AND villeuser=(SELECT ville FROM preference WHERE idUtilisateur=$4)
					AND IDUTILISATEUR NOT IN (SELECT idliker FROM likes WHERE idlikeur LIKE $5 AND ETAT>=0)
					AND ETAT >=0
					and IDUTILISATEUR!=$6 limit $7 offset $8`,
				values : [
					idUtilisateur, idUtilisateur, idUtilisateur,
					idUtilisateur, idUtilisateur, idUtilisateur,
					parseInt(limit), parseInt(offset)
				]
			};
			logger.info(sql);
            connexion.query(sql, function(error, resultSet, fields){
                if(error){
					logger.error(error);
					reject(error);
					return;
				}
				let data = [];
				for(let result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				if(data.length == 0){
                    let result = {
                        "status" : "400",
                        "data" : data
                    }
                    resolve(result);
                } else {
                    let result = {
                        "status" : "200",
                        "data" : data
                    }
                    resolve(result);
                }
				// console.log(data.length, 'is the length');
			});
        })
    }
}
