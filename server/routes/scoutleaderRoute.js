const Router = require("express").Router();
const scoutleaderController = require("../controllers/scoutleaderController");
const { validateAddScoutleader } = require("../middlewares/Validate");

Router.get("/", scoutleaderController.getAllScoutleaders);
Router.get("/:id", scoutleaderController.getScoutleaderbyId);
Router.post("/", validateAddScoutleader, scoutleaderController.addScoutleader);
Router.delete("/:id", scoutleaderController.deleteScoutleader);

module.exports = Router;
