const express = require('express');
const userController = require('../controllers/userController');
const { ValidateAddUser } = require('../middlewares/Validate');
const Router = express.Router();

Router.get('/', userController.getAllUsers);
Router.get('/unverified', userController.getUnverifiedUsers);
Router.get('/:id', userController.getUserById);

Router.post('/', ValidateAddUser, userController.addUser);
Router.put('/:id', userController.updateUser);
Router.patch('/:id', userController.updateUserRole);
Router.delete('/:id', userController.deleteUser);

module.exports = Router;
