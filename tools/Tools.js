module.exports = class Tools {
	/**
	* Ajoute un zero suppl. si < 10. (ex : 1 => 01 , 22 => 22, 6 => 06)
	* @params {number} n
	* @returns {string}
	*/
	static addZero( n ) {
		return n < 10 ? `0${n}` : n;
	}

	/**
	* @params {Date} date
	* @params {number} days
	* @returns {Date} la date apres 'days'-jours
	*/
	static addDays( date, days ) {
		const result = new Date();
		result.setDate(date.getDate() + days);
		return result;
	}
	
	/**
	* @params {Date} date
	* @returns {string} la date au format timestamp
	*/
	static toTimestamp( date ) {
		let [year, month, days, hour, min, sec] = [
			date.getFullYear(), date.getMonth() + 1, date.getDate(),
			date.getHours(), date.getMinutes(), date.getSeconds()
		].map( Tools.addZero ); // on ajoute un zero si un item < 10 (genre 1:3:33 => 01:03:33)
		
		return `${year}-${month}-${days} ${hour}:${min}:${sec}`;
	}
}