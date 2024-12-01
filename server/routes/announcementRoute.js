const express = require("express");
const Router = express.Router();
const { validateAnnouncement } = require("../middlewares/Validate");
const announcementController = require("../controllers/announcementController");

Router.route("/")
    .get(announcementController.getAnnouncements)
    .post(validateAnnouncement, announcementController.addAnnouncement);

Router.route("/:announcement_id")
    .get(announcementController.getAnnouncement)
    .put(validateAnnouncement, announcementController.updateAnnouncement)
    .delete(announcementController.deleteAnnouncement);

module.exports = Router;