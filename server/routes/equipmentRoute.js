const express = require("express");
const Router = express.Router();
const { validateEquipment } = require("../middlewares/Validate");
const equipmentController = require("../controllers/equipmentController");

Router.route("/")
    .get(equipmentController.getEquipments)
    .post(validateEquipment, equipmentController.addEquipment);

Router.route("/:equipment_id")
    .get(equipmentController.getEquipment)
    .put(validateEquipment, equipmentController.updateEquipment)
    .delete(equipmentController.deleteEquipment);

module.exports = Router;