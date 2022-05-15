/* node JS */
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class QuestionModel{

    static repondre(connexion, idjoueur, idquestion, pts){
        return new Promise((resolve, reject) => {
            const model = JoueurModel;
            try {
                // user query
                const userQuery = {
                    text : `insert into reponsejoueur (idjoueur, idquestion, pts)
                            values
                            ($1, $2, $3)`,
                    values : [
                        idjoueur, idquestion, pts
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
                throw e;
            }
        })
    }
    static getChoixReponse(connexion, idquestion){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from reponsequestion where idquestion like $1",
				values : [idquestion]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
                let finalres = {
                        "status" : "200",
                        "data" : resultSet.rows
                    };
                resolve(finalres);
			});
        })
    }

    static getByNiv (connexion, idniveau) {
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from question where idniveau like $1",
				values : [idniveau]
			};
			logger.info(sql);
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
                let finalres = {
                        "status" : "200",
                        "data" : resultSet.rows
                    };
                resolve(finalres);
			});
        })
	}
}
