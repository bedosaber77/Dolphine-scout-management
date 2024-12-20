const statisticsController = require('../controllers/statisticsController');
const router = require('express').Router();

router.get('/rank', statisticsController.getRankStatistics);
router.get('/transactions', statisticsController.getTransactionsStatistics);
module.exports = router;
