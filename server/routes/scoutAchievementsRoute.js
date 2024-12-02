const express = require("express");
const Router = express.Router({ mergeParams: true });
const { validateScoutID, validateScoutAchievement } = require("../middlewares/Validate");
const scoutAchievementsController = require("../controllers/scoutAchievementsController");

Router.route("/")
    .get(validateScoutID, scoutAchievementsController.getScoutAchievements)
    .post(validateScoutAchievement, scoutAchievementsController.addScoutAchievement);

Router.route("/:achievement_id")
    .delete(scoutAchievementsController.deleteScoutAchievement);

module.exports = Router;