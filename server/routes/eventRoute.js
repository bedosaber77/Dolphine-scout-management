const Router = require("express").Router();
const eventController = require("../controllers/eventController");
const {
  validateAddEvent,
  validateAddEventAttendace,
} = require("../middlewares/Validate");

Router.get("/", eventController.getEvents);
Router.get("/:event_id", eventController.getEvent);
Router.post("/", validateAddEvent, eventController.addEvent);
Router.delete("/:event_id", eventController.deleteEvent);
Router.put("/:event_id", eventController.updateEvent);
Router.get("/:event_id/attendance", eventController.getEventAttendees);
Router.post(
  "/:event_id/attendance",
  validateAddEventAttendace,
  eventController.addEventAttendee
);
Router.delete(
  "/:event_id/attendance/:scout_id",
  eventController.deleteEventAttendee
);

module.exports = Router;
