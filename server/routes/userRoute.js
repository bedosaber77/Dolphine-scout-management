const express = require("express");
const userController = require("../controllers/userController");
const { ValidateAddUser } = require("../middlewares/Validate");
const Router = express.Router();

Router.get("/", userController.getAllUsers);
Router.get("/:id", userController.getUserById);
Router.post("/", ValidateAddUser, userController.addUser);
Router.put("/:id", userController.updateUser);
Router.delete("/:id", userController.deleteUser);

module.exports = Router;