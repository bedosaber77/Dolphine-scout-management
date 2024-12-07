const Router = require("express").Router();
const gatheringController = require("../controllers/gatheringController");

Router.get("/", gatheringController.getAllGatherings);
Router.get("/:gathering_id", gatheringController.getGathering);
Router.post("/", gatheringController.addGathering);
Router.put("/:gathering_id", gatheringController.updateGathering);
Router.delete("/:gathering_id", gatheringController.deleteGathering);

module.exports = Router;
