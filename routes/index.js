const express = require('express');
const router = express.Router();

router.use('/session', require("./session"));
router.use('/joueur', require("./joueur"));
router.use('/theme', require("./theme"));
router.use('/question', require("./question"));
router.use('/about', express.static("../tools/about_html"));

module.exports = router;
