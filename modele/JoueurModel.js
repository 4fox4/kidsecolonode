/* node JS */
let connection = require('../Connection');
let connexion = connection();
const logger = require("../tools/logger").Create(__filename); // debug perso
const assert = require('assert');
const config = require('../tools/project.config.json');
const Tools = require('../tools/Tools');

module.exports = class JoueurModel{

	/**
	 * INSCRIPTION EN MODE TRANSACTIONNEL
	 * PERMET D'ASSURER QU'UNE INSCRIPTION S'INSERE AVEC UNE PREFERENCE EXISTANTE
	 */
    static async inscrire (nom, prenoms, pseudo, datenaissance, mdp) {

		const model = JoueurModel;
		try {
			await connexion.query('BEGIN'); // debute la transaction

			// user query
			const userQuery = {
				text : `insert into JOUEUR (nom, prenoms, pseudo, datenaissance, mdp)
						 values
						($1, $2, $3, $4, sha1($5))`,
				values : [
					nom, prenoms, pseudo, datenaissance, mdp
				]
			};
            connexion.query(userQuery, function(error){
                if(error){
                    logger.error(error);
                    reject(error);
                    return;
                }else{
                    let result = {
                        "status" : "200",
                        "data" : model
                    };
                    resolve(result);
                }
            });
		} catch(e) {
			logger.error(`Echec Insertion user ${pseudo}, Rollback`);
			logger.error(e.detail || (e + ''));
			await connexion.query('ROLLBACK');
			throw e;
		}
	}

    //login
    static login(connexion, login, password){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from JOUEUR where EMAIL like $1 and PASSWORD like sha1($2) and etat>=0",
				//text : "select * from JOUEUR where EMAIL like $1 and PASSWORD like $2",
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
                    // "update JOUEUR set etat=1 where idJOUEUR='"+data[0].idJOUEUR+"'";
					const sql1 = {
						text : "update JOUEUR set etat=1 where idJOUEUR=$1",
						values : [ data[0].idJOUEUR ]
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
}
