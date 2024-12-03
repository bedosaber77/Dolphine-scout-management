const express = require("express");
const scoutController = require("../controllers/scoutController");
const { validateAddScout } = require("../middlewares/Validate");
const Router = express.Router();

Router.get("/", scoutController.getAllScouts);
Router.get("/:id", scoutController.getScoutbyId);
Router.post("/", validateAddScout, scoutController.addScout);
Router.put("/:id", scoutController.updateScout);
Router.delete("/:id", scoutController.deleteScout);

module.exports = Router;
