const Router = require("express").Router();
const eventController = require("../controllers/eventController");
const { validateAddEvent } = require("../middlewares/Validate");

Router.get("/", eventController.getEvents);
Router.get("/:event_id", eventController.getEvent);
Router.post("/", validateAddEvent, eventController.addEvent);
Router.delete("/:event_id", eventController.deleteEvent);
Router.put("/:event_id", eventController.updateEvent);

module.exports = Router;
