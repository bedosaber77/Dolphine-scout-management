const express = require("express");
const Router = express.Router();
const { validateSponsor, validateSponsorUpdate } = require("../middlewares/Validate");
const sponsorController = require("../controllers/sponsorController");

Router.route("/")
    .get(sponsorController.getSponsors)
    .post(validateSponsor, sponsorController.addSponsor);

Router.route("/:sponsor_id")
    .get(sponsorController.getSponsor)
    .put(validateSponsorUpdate, sponsorController.updateSponsor)
    .delete(sponsorController.deleteSponsor);

module.exports = Router;