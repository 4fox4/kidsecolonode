const express = require('express');
const router = express.Router();
const TokenManager = require("../tools/TokenManager");
// const AuthentificationRoutine = require("../tools/AuthentificationRoutine");

router.use((req, res, next) => {
	// --- middleware ---
	next();
});

router.get('/', (req, res) => {
	req.json({
		status : 200,
		data : "Un truc"
	});
});

router.get('/exemple', (req, res) => {
	// ....
});




module.exports = router;