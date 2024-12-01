const express = require("express");
const Router = express.Router();
const { validateLocation } = require("../middlewares/Validate");
const locationController = require("../controllers/locationController");

Router.route("/")
    .get(locationController.getLocations)
    .post(validateLocation, locationController.addLocation);

Router.route("/:location_id")
    .get(locationController.getLocation)
    .put(validateLocation, locationController.updateLocation)
    .delete(locationController.deleteLocation);

module.exports = Router;