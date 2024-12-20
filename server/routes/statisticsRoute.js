const statisticsController = require('../controllers/statisticsController');
const router = require('express').Router();

router.get('/rank', statisticsController.getRankStatistics);
router.get('/transactions', statisticsController.getTransactionsStatistics);
router.get('/events', statisticsController.getEventsAttendanceStatistics);
module.exports = router;
