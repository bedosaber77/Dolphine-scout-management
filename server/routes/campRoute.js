const Router = require("express").Router();
const campController = require("../controllers/campController");
const { validateAddCamp } = require("../middlewares/Validate");

Router.get("/", campController.getAllCamps);
Router.get("/:camp_id", campController.getCamp);
Router.post("/", validateAddCamp, campController.addCamp);
Router.put("/:camp_id", campController.updateCamp);
Router.delete("/:camp_id", campController.deleteCamp);

module.exports = Router;
