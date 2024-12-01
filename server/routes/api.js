const authRouter = require("./authroute");
const achievementRouter = require("./achievementRoute");
const apiRouter = require("express").Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/achievements", achievementRouter);

module.exports = apiRouter;
