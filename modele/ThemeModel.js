/* node JS */
let connection = require('../Connection');
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class ThemeModel{
    static getDetails(connexion, idtheme){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from detailstheme where idtheme like $1",
				values : [idtheme]
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

    static getAll(connexion){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from theme",
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
