const express = require('express');
const scoutController = require('../controllers/scoutController');
const {
  validateAddScout,
  validateScoutID,
  validateScoutAchievement,
} = require('../middlewares/Validate');
const Router = express.Router();

Router.route('/')
  .get(scoutController.getAllScouts)
  .post(validateAddScout, scoutController.addScout);

Router.route('/:id')
  .get(scoutController.getScoutbyId)
  .put(scoutController.updateScout)
  .delete(scoutController.deleteScout);

Router.route('/:id/achievements')
  .get(validateScoutID, scoutController.getScoutAchievements)
  .post(validateScoutAchievement, scoutController.addScoutAchievement);

Router.route('/:id/achievements:achievement_id').delete(
  scoutController.deleteScoutAchievement
);

Router.get('/:id/attendance', scoutController.getScoutAttendanceCurrentMonth);

module.exports = Router;
