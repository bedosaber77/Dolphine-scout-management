const express = require("express");
const Router = express.Router();
const { validateAchievement } = require("../middlewares/Validate");
const achievementController = require("../controllers/achievementController");

Router.route("/")
    .get(achievementController.getAchievements)
    .post(validateAchievement, achievementController.addAchievement);

Router.route("/:achievement_id")
    .get(achievementController.getAchievement)
    .put(validateAchievement, achievementController.updateAchievement)
    .delete(achievementController.deleteAchievement);

module.exports = Router;