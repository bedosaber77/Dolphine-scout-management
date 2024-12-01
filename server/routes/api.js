const authRouter = require("./authroute");
const apiRouter = require("express").Router();

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
