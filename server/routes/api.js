const authRouter = require("./auth");
const apiRouter = require("express").Router();

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
