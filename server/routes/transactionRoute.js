const express = require("express");
const Router = express.Router();
const { validateTransaction, validateTransactionStatus } = require("../middlewares/Validate");
const transactionController = require("../controllers/transactionController");

Router.route("/")
    .get(transactionController.getTransactions)
    .post(validateTransaction, transactionController.addTransaction);

Router.route("/:transaction_id")
    .get(transactionController.getTransaction)
    .put(validateTransaction, transactionController.updateTransaction)
    .patch(validateTransactionStatus, transactionController.updateTransactionStatus)
    .delete(transactionController.deleteTransaction);

module.exports = Router;