/* node JS */
const logger = require("../tools/logger").Create(__filename); // debug perso
const Tools = require('../tools/Tools');

module.exports = class NiveauModel{
    static getAll(connexion){
        return new Promise((resolve, reject) => {
			const sql = "select * from niveau order by ordre asc";
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
