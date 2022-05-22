/* node JS */
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class QuestionModel{

    static delete(connexion, idjoueur, idquestion){
        return new Promise((resolve, reject) => {
            try {
                // user query
                const userQuery = {
                    text : `delete from reponsejoueur where idjoueur like $1 and idquestion like $2`,
                    values : [
                        idjoueur, idquestion
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
                            "error": false,
                            "data" : "Probleme delete"
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
    
    static repondre(connexion, idjoueur, idquestion, pts){
        return new Promise((resolve, reject) => {
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
                const promise2 = this.delete(connexion, idjoueur, idquestion);
                promise2.then(value=>{
                    connexion.query(userQuery, function(error){
                        if(error){
                            logger.error(error);
                            reject(error);
                            return;
                        }else{
                            let result = {
                                "status" : "200",
                                "error": false,
                                "data" : "Success"
                            };
                            resolve(result);
                        }
                    });
                })
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

            connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
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

    static getByNiv (connexion, idniveau, idtheme) {
        var model = this;
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from question where idniveau like $1 and idtheme like $2",
				values : [idniveau, idtheme]
			};
			connexion.query(sql, function(error, resultSet, fields){
				if(error){
					logger.error(error);
					reject(error);
					return;
				}
                let lengthResult = resultSet.rows.length;
                if(lengthResult == 0){
                    let finalres = {
                        "status" : "200",
                        "error": true,
                        "data" : []
                    };
                    resolve(finalres);
                }
                let i = 0;
                resultSet.rows.forEach(res => {
                    const prom2 = model.getChoixReponse(connexion, res.id);
                    console.log(" question id "+res.id);
                    prom2.then (value =>{
                        i++;
                        res.reponses = value.data;
                        console.log(value.data);

                        if(i == lengthResult){
                            let finalres = {
                                "status" : "200",
                                "error": false,
                                "data" : resultSet.rows
                            };
                            resolve(finalres);
                        }
                    });
                })
			});
        })
	}
}
