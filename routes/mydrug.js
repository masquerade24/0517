const express = require('express');
const drugController = require('../controllers/drugController');
const mydrugController = require('../controllers/mydrugController');
const util = require('../middleware/util');

const router = express.Router();

router.get('/show', mydrugController.showInfo);

module.exports = router;