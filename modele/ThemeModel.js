/* node JS */
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class ThemeModel{
    static getDetails(connexion, idtheme){
        return new Promise((resolve, reject) => {
			const sql = {
				text : "select * from detailstheme where idtheme like $1",
				values : [idtheme]
			};
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

	static rechercher(connexion, keyword){
        return new Promise((resolve, reject) => {
			const sql = "select * from theme where valeur like '%"+keyword+"%' or desce like '%"+keyword+"%'";
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
