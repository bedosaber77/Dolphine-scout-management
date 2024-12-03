const express = require("express");
const Router = express.Router({ mergeParams: true });
const { validateParentID, validateParentScout } = require("../middlewares/Validate");
const parentScoutController = require("../controllers/parentScoutController");

Router.route("/")
    .get(validateParentID, parentScoutController.getScouts)
    .post(validateParentScout, parentScoutController.addScout);

module.exports = Router;