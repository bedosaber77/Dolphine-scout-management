const express = require("express");
const Router = express.Router();
const { validateMedia } = require("../middlewares/Validate");
const mediaController = require("../controllers/mediaController");

Router.route("/")
    .get(mediaController.getAllMedia)
    .post(validateMedia, mediaController.addMedia);

Router.route("/:media_id")
    .get(mediaController.getMedia)
    .put(validateMedia, mediaController.updateMedia)
    .delete(mediaController.deleteMedia);

module.exports = Router;