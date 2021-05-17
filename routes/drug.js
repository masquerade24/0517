const express = require('express');
const drugController = require('../controllers/drugController');
const mydrugController = require('../controllers/mydrugController');
const searchController = require('../controllers/searchController');
const util = require('../middleware/util');

const router = express.Router();

router.post('/search', drugController.search);
router.get('/symptomSearch', drugController.symptomSearch);
router.get('/symptom-search', drugController.symptomSearch2);
router.post('/save', drugController.saveDrug);
router.post('/save2mydrug',  drugController.save2mydrug);
router.post('/DUR', mydrugController.test);
router.post('/qrsearch', searchController.qrSearch);
// router.delete('/delete', drugController.deleteMyDrug);

module.exports = router;