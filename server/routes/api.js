const authRouter = require("./authroute");
const achievementRouter = require("./achievementRoute");
const locationRouter = require("./locationRoute");
const apiRouter = require("express").Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/achievements", achievementRouter);
apiRouter.use("/locations", locationRouter);

module.exports = apiRouter;
