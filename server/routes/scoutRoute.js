const express = require("express");
const scoutController = require("../controllers/scoutController");
const { validateAddScout } = require("../middlewares/Validate");
const Router = express.Router();

Router.route("/")
    .get(scoutController.getAllScouts)
    .post(validateAddScout, scoutController.addScout);

Router.route("/:id")
    .get(scoutController.getScoutbyId)
    .put(scoutController.updateScout)
    .delete(scoutController.deleteScout);

Router.route("/:id/achievements")
    .get(validateScoutID, scoutAchievementsController.getScoutAchievements)
    .post(validateScoutAchievement, scoutAchievementsController.addScoutAchievement);

Router.route("/:id/achievements:achievement_id")
    .delete(scoutAchievementsController.deleteScoutAchievement);


module.exports = Router;
