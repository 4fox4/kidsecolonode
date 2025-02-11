/* node JS */
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class JoueurModel{

    static getScore(connexion, idjoueur){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from scorepartheme where idjoueur like $1",
				values : [idjoueur]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
                if(Object.keys(resultSet.rows).length === 0){
                    let result = {
                        "status" : "200",
                        "error": true,
                        "data": "Jouez pour voir vos scores"
                    };
                    resolve(result);
                }
                let finalres = {
                        "status" : "200",
                        "error": false,
                        "data" : resultSet.rows
                    };
                resolve(finalres);
			});
        })
    }

    static inscrire (connexion, nom, prenoms, pseudo, datenaissance, mdp) {
        return new Promise((resolve, reject) => {
            const model = JoueurModel;
            try {
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
                        let result = {
                            "status" : "200",
                            error: true,
                            "data" : []
                        };
                        resolve(result);
                    }else{
                        let result = {
                            "status" : "200",
                            error: false,
                            "data" : []
                        };
                        resolve(result);
                    }
                });
            } catch(e) {
                logger.error(`Echec Insertion user ${pseudo}, Rollback`);
                logger.error(e.detail || (e + ''));
                throw e;
            }
        })
	}

    //login
    static login(connexion, login, password){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from joueur where pseudo like $1 and mdp like sha1($2) and etat>0",
				values : [login, password]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
                if(Object.keys(resultSet.rows).length === 0){
                    let result = {
                        "status" : "200",
                        "error": true,
                        "data": []
                    };
                    resolve(result);
                }
				for(let result in resultSet.rows){
                    if(resultSet.rows[result].etat>0)
                    {
                        let finalres = {
                            "status" : "200",
                            "error": false,
                            "data" : resultSet.rows
                        };
                        resolve(finalres);
                    }
                    else
                    {
                        let result = {
                            "status" : "400",
                            "data" : "Ce compte est déja supprimé"
                        };
                        reject(result);
                    }
				}
			});
        })
    }
}
