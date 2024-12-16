const Router = require('express').Router();
const eventController = require('../controllers/eventController');
const { storage } = require('../utils/cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const {
  validateAddEvent,
  validateAddEventAttendace,
} = require('../middlewares/Validate');

Router.route('/')
  .get(eventController.getEvents)
  .post(validateAddEvent, upload.array('images'), eventController.addEvent);

Router.route('/:event_id')
  .get(eventController.getEvent)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

Router.route('/:event_id/attendance')
  .get(eventController.getEventAttendees)
  .post(validateAddEventAttendace, eventController.addEventAttendee);

Router.delete(
  '/:event_id/attendance/:scout_id',
  eventController.deleteEventAttendee
);

module.exports = Router;
