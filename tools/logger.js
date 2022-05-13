const config = require('./project.config.json')
const winston = require('winston');
const error_log_path = config.ERROR_LOG || 'error.log';
const all_log_path = config.LOG || 'all.log';


function CustomLogger(logger, status) {
	this.path = '';
	this.logger = logger;
	this.status = status;

	this.can = function(str) {
		return !this.status['STOP_ALL'] && this.status[str];
	}
	/**
	 * Initialise le fichier appelant du log courant
	 * @param {string} source Valeur du fichier source appelant 
	 */
	this.initCallerSource = (source) => {
		let path = require('path');
		if ( source ) {
			this.path = path.basename(source);
		} else {
			this.path = path.basename(process.mainModule.filename);
		}
	}

	/**
	 * Formatte la chaine courante pour les logs
	 * @param {string|number} msg 
	 */
	this.withCallerName = function(msg) {
		let label = `${process.pid}|${new Date().toLocaleTimeString()}`;
		if ( this.path != '') {
			if ( typeof msg != 'string' && typeof msg != 'number') {
				try {					
					return `[${label}] [${this.path}] ${ JSON.stringify(msg) }`;
				} catch(e) {
					return `[${label}] [${this.path}] ${ msg }`;
				}
			}
			return `[${label}] [${this.path}] ${msg}`;
		}
		return `[${label}] ${msg}`;
	}
	
	/**
	 * Affiche une information classique
	 * @param {string|number} msg 
	 */
	this.info = function(msg) {
		if ( this.can('INFO') )
			this.logger.info(this.withCallerName(msg));
	}
	
	/**
	 * Affiche un warning
	 * @param {string|number} msg 
	 */
	this.warn = function(msg) {
		if ( this.can('WARN') )
			this.logger.warn(this.withCallerName(msg));
	}

	/**
	 * Affiche une erreur
	 * @param {string|number} msg 
	 */
	this.error = function(msg) {
		if ( this.can('ERROR') )
			this.logger.error(this.withCallerName(msg));
	}
	
	/**
	 * Affiche une info classique
	 * @param {string|number} msg 
	 */
	this.log = function(msg) {
		this.info(msg);
	}

	/**
	 * * Cree un nouveau logger en fonction d'un logger existant
	 * * Utile quand le module principal est un serveur
	 * @param {string} filename nom du fichier appelant (generalement, cela vaut __filename)
	 */
	this.Create = function(filename) {
		let mylog = new CustomLogger(this.logger, this.status);
		try {
			mylog.initCallerSource(filename);
			return mylog;			
		} catch(e) {
			console.log(e);
		}
	}

	/**
	 * Retourne l'instance maitresse de winston.js 
	 */
	this.core = function() {
		return this.logger;
	}
}

module.exports = (() => {
	let logger = winston.createLogger({
		transports: [
			new winston.transports.Console({
				format : winston.format.combine(
					winston.format.colorize(),
					winston.format.simple()
				)
			}),
			new winston.transports.File({ 
				filename : all_log_path,
				format : winston.format.json()
			}),
			new winston.transports.File({ 
				level : 'error',
				filename : error_log_path,
				format : winston.format.json()
			})
		],
		format : winston.format.combine(
			winston.format.colorize(),
			winston.format.prettyPrint()
		)
	});
	
	let custom = new CustomLogger(logger, config['LOG_STATUS']);
	return custom;
})();