const express = require("express");
const Router = express.Router();
const { validateAchivement } = require("../middlewares/Validate");
const achievementController = require("../controllers/achievementController");

Router.route("/")
    .get(achievementController.getAchievements)
    .post(validateAchivement, achievementController.addAchievement);

Router.route("/:achievement_id")
    .get(achievementController.getAchievement)
    .put(validateAchivement, achievementController.updateAchievement)
    .delete(achievementController.deleteAchievement);

module.exports = Router;